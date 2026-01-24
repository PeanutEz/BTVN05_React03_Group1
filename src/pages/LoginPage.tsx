import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      // Redirect dựa vào role
      if (response.user.role === 'Admin') {
        navigate('/admin/users');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🚀</div>
          <div className={styles.logoText}>TechFeed</div>
          <div className={styles.subtitle}>Chào mừng trở lại!</div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="Nhập email của bạn"
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Nhập mật khẩu"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>hoặc</span>
          <div className={styles.dividerLine}></div>
        </div>

        <div className={styles.socialButtons}>
          <button className={styles.socialButton}>
            <span>🚀</span>
            <span>Demo Login</span>
          </button>
        </div>

        <div className={styles.footer}>
          Chưa có tài khoản? {' '}
          <span
            className={styles.footerLink}
            onClick={() => navigate('/register')}
            style={{ cursor: 'pointer' }}
          >
            Đăng ký ngay
          </span>
        </div>
      </div>
    </div>
  );
}
