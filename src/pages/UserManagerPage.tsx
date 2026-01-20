import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { userService } from '../services/user.service';
import type { User } from '../types/user.type';

export default function UserManagerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div>
      <Header />
      <div style={{ padding: '30px' }}>
        <h1 style={{ marginBottom: '20px' }}>User Management</h1>
        
        {loading && <p>Đang tải...</p>}
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Create Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #0056b3' }}>Update Date</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #0056b3' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    <td style={{ padding: '12px' }}>{user.id}</td>
                    <td style={{ padding: '12px' }}>{user.name}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: user.role === 'Admin' ? '#28a745' : '#17a2b8',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{formatDate(user.createDate)}</td>
                    <td style={{ padding: '12px' }}>{user.updateDate ? formatDate(user.updateDate) : '-'}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleView(user)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Không có người dùng nào
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
