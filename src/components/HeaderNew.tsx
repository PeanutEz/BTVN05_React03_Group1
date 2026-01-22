import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import styles from './Header.module.css';

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
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoText}>
            🚀 TechFeed
          </div>
        </div>

        <div className={styles.navItems}>
          <a href="#" className={`${styles.navLink} ${styles.active}`}>
            Trang chủ
          </a>
          <a href="#" className={styles.navLink}>
            Khám phá
          </a>
          <a href="#" className={styles.navLink}>
            Thông báo
          </a>
        </div>

        <div className={styles.userMenu} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={styles.userButton}
          >
            <div className={styles.userAvatar} style={{
              background: 'linear-gradient(135deg, #00d084 0%, #0066ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span>{user?.name || 'User'}</span>
            <span style={{ 
              fontSize: '12px',
              transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </span>
          </button>

          {showMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              backgroundColor: 'var(--background-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-medium)',
              minWidth: '200px',
              overflow: 'hidden',
              zIndex: 1000,
              marginTop: 'var(--space-sm)'
            }}>
              <div style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: '1px solid var(--border-light)',
                background: 'linear-gradient(135deg, var(--primary-green-ultra-light) 0%, var(--background-secondary) 100%)'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {user?.email || 'user@example.com'}
                </div>
              </div>
              
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-lg)',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-green-ultra-light)';
                  e.currentTarget.style.color = 'var(--primary-green)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                👤 Hồ sơ cá nhân
              </button>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowMenu(false);
                }}
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-lg)',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary-green-ultra-light)';
                  e.currentTarget.style.color = 'var(--primary-green)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                ⚙️ Cài đặt
              </button>
              
              <div style={{ height: '1px', background: 'var(--border-light)', margin: 'var(--space-sm) 0' }} />
              
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: 'var(--space-md) var(--space-lg)',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--error)',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 71, 87, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                🚪 Đăng xuất
              </button>
            </div>
          )}
        </div>

        <button className={styles.mobileMenu}>
          ☰
        </button>
      </nav>
    </header>
  );
}
