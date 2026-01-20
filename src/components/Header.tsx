import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '2px solid #007bff',
      padding: '12px 30px',
      margin: '0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0, 123, 255, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        fontSize: '20px', 
        fontWeight: 'bold',
        color: '#007bff',
        letterSpacing: '0.5px'
      }}>
        MyApp
      </div>

      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            border: '2px solid #007bff',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 6px rgba(0, 123, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
          }}
          title={user?.name || 'User'}
        >
          {user?.name.charAt(0).toUpperCase() || 'U'}
        </button>

        {showMenu && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50px',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000
          }}>
            <div style={{
              padding: '15px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {user?.email}
              </div>
            </div>

            <button
              onClick={() => {
                setShowMenu(false);
                // Navigate to profile page (if exists)
              }}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                borderBottom: '1px solid #e0e0e0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              👤 Profile
            </button>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#dc3545'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
