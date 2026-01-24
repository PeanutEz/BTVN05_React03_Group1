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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: ''
  });
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
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      avatar: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setUpdating(true);
      const updatedUser = await userService.updateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: formData.avatar || undefined,
        updateDate: new Date().toISOString()
      });

      // Update local state
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      alert(`Đã cập nhật user: ${updatedUser.name}`);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Không thể cập nhật user. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa user ${user.name}?`)) {
      try {
        setDeletingId(user.id);
        await userService.deleteUser(user.id);
        
        // Remove user from local state
        setUsers(users.filter(u => u.id !== user.id));
        alert(`Đã xóa user: ${user.name}`);
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Không thể xóa user. Vui lòng thử lại.');
      } finally {
        setDeletingId(null);
      }
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
                        disabled={deletingId === user.id}
                      >
                        {deletingId === user.id ? '⏳ Đang xóa...' : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal for editing user */}
      {isModalOpen && editingUser && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Chỉnh sửa thông tin User</h2>
              <button className={styles.modalCloseButton} onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleUpdateUser} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Tên người dùng *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                  placeholder="Nhập tên người dùng"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                  placeholder="Nhập email"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">Chọn role</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Nhập URL avatar (tùy chọn)"
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelButton}
                  disabled={updating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={updating}
                >
                  {updating ? '⏳ Đang cập nhật...' : '💾 Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
