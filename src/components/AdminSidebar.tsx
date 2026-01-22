import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  onExpandedChange?: (expanded: boolean) => void;
}

export default function AdminSidebar({ onExpandedChange }: AdminSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onExpandedChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onExpandedChange?.(false);
  };
  const menuItems = [
    {
      id: 'users',
      icon: '👥',
      label: 'User Management',
      path: '/admin/users'
    }
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    navigate(item.path);
  };
  return (
    <aside 
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >      <div className={styles.sidebarContent}>
        <nav className={styles.nav}>
          {menuItems.map((item) => (            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`${styles.menuItem} ${
                location.pathname === item.path ? styles.active : ''
              }`}
              data-tooltip={item.label}
            >
              <span className={styles.menuIcon}>
                {item.icon}
              </span>
              <span className={styles.menuLabel}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
