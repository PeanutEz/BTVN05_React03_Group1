import { useState, useEffect } from 'react';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import { userService } from '../services/user.service';
import type { User } from '../types/user.type';
import styles from './UserManagerPage.module.css';

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Generate avatar từ tên nếu không có avatar từ user data
const generateAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d084&color=fff&size=64`;
};

export default function UserManagerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
  const handleClearSearch = () => {
    setSearchTerm('');
  };



  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user: User) => {
    alert(`Xem chi tiết user:\nTên: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
  };

  const handleEdit = (user: User) => {
    alert(`Chỉnh sửa user: ${user.name}`);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa user ${user.name}?`)) {
      alert(`Đã xóa user: ${user.name}`);
    }
  };

  const normalizedSearch = normalizeText(searchTerm);

  const filteredUsers = users.filter(user =>
    normalizeText(user.name).includes(normalizedSearch) ||
    normalizeText(user.email).includes(normalizedSearch)
  );


  return (
    <div className={styles.container}>
      <Header />
      <AdminSidebar onExpandedChange={setSidebarExpanded} />
      <div className={`${styles.content} ${sidebarExpanded ? styles.expanded : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>👥</span>
            User Management
          </h1>
          <p className={styles.subtitle}>Manage and monitor user accounts</p>
        </div>

        <div className={styles.searchBox}>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>🔍</div>

            <input
              type="text"
              className={styles.searchInput}
              placeholder="Nhập email hoặc tên người dùng ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                className={styles.clearButton}
                onClick={handleClearSearch}
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⚠️</div>
            <p className={styles.emptyText}>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className={styles.userGrid}>
              {filteredUsers.length === 0 && searchTerm.trim() !== '' ? (
                <div className={styles.emptycenter}>
                  <div className={styles.emptyIcon}>🔍</div>
                  <p className={styles.emptyText}>
                    Không tìm thấy người dùng phù hợp
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    Thử tìm bằng email hoặc tên khác
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className={styles.userCard}>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={styles.userAvatar}
                        onError={(e) => {
                          // Fallback to generated avatar if user avatar fails to load
                          e.currentTarget.src = generateAvatarUrl(user.name);
                        }}
                      />
                    ) : (
                      <div className={styles.userAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                    <div className={`${styles.userRole} ${user.role === 'Admin' ? styles.roleAdmin : styles.roleUser}`}>
                      {user.role}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      <div>Created: {formatDate(user.createDate)}</div>
                      {user.updateDate && <div>Updated: {formatDate(user.updateDate)}</div>}
                    </div>
                    <div className={styles.userActions}>
                      <button
                        onClick={() => handleView(user)}
                        className={styles.actionButton}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
