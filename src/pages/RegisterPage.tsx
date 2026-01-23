import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu nhập lại không khớp');
            return;
        }

        setLoading(true);

        try {
            await authService.register({ name, email, password });
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
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
                    <div className={styles.subtitle}>Tạo tài khoản mới</div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Nhập họ tên của bạn"
                            disabled={loading}
                        />
                    </div>

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

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="Nhập lại mật khẩu"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <div className={styles.footer}>
                    Đã có tài khoản? {' '}
                    <a href="#" className={styles.footerLink} onClick={(e) => {
                        e.preventDefault();
                        navigate('/login');
                    }}>Đăng nhập ngay</a>
                </div>
            </div>
        </div>
    );
}
