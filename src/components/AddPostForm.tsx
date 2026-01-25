import { useMemo, useState } from 'react';
import type { Post } from '../types/post.type';
import { authService } from '../services/auth.service';
import { postService, type CreatePostRequest } from '../services/post.service';
import { usePostsRefresh } from '../contexts/PostsContext';
import styles from './AddPostForm.module.css';

type Props = {
  onCreated?: (post: Post) => void;
};

const isValidUrl = (value: string) => {
  try {
    // allow http/https only
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function AddPostForm({ onCreated }: Props) {
  const currentUser = useMemo(() => authService.getCurrentUser(), []);
  const { bumpRefresh } = usePostsRefresh();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Post['type']>('image');
  const [url, setUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const t = title.trim();
    const d = description.trim();
    const u = url.trim();

    if (!t) return setError('Vui lòng nhập tiêu đề.');
    if (!d) return setError('Vui lòng nhập nội dung.');
    if (!u) return setError('Vui lòng nhập URL.');
    if (!isValidUrl(u)) return setError('URL không hợp lệ (cần http/https).');

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const payload: CreatePostRequest = {
        userId: Number.parseInt(currentUser.id, 10) || 0,
        userName: currentUser.name,
        avatar:
          currentUser.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`,
        title: t,
        description: d,
        status: 'active',
        type,
        url: u,
        createDate: now,
        updateDate: now,
      };

      const created = await postService.createPost(payload);

      setTitle('');
      setDescription('');
      setType('image');
      setUrl('');
      setSuccess('Đăng bài thành công!');

      onCreated?.(created);
      //báo cho Home/Profile refetch lại từ API để refresh không mất
      bumpRefresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đăng bài thất bại');
    } finally {
      setLoading(false);
      // auto-clear success
      setTimeout(() => setSuccess(''), 1500);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <img className={styles.avatar} src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`} alt={currentUser.name} />
        <div className={styles.meta}>
          <div className={styles.name}>{currentUser.name}</div>
          <div className={styles.sub}>Tạo bài viết mới</div>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label className={styles.label}>Tiêu đề</label>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Hôm nay mình học React..."
            disabled={loading}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Nội dung</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.row}>
            <label className={styles.label}>Loại</label>
            <select
              className={styles.input}
              value={type}
              onChange={(e) => setType(e.target.value as Post['type'])}
              disabled={loading}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>URL (ảnh/video)</label>
            <input
              className={styles.input}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              disabled={loading}
            />
          </div>
        </div>

        {(error || success) && (
          <div className={error ? styles.error : styles.success}>
            {error || success}
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? 'Đang đăng...' : 'Đăng'}
          </button>
        </div>
      </form>
    </div>
  );
}
