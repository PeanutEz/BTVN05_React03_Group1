import { useState, useEffect } from 'react';
import type { Post } from '../types/post.type';
import { postService, type UpdatePostRequest } from '../services/post.service';
import styles from './EditPostModal.module.css';

interface EditPostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedPost: Post) => void;
}

export default function EditPostModal({ post, isOpen, onClose, onUpdate }: EditPostModalProps) {
  const [formData, setFormData] = useState<UpdatePostRequest>({
    title: post.title,
    description: post.description,
    type: post.type,
    url: post.url
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: post.title,
        description: post.description,
        type: post.type,
        url: post.url
      });
      setError('');
    }
  }, [isOpen, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!formData.title.trim()) {
        setError('Vui lòng nhập tiêu đề');
        setLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError('Vui lòng nhập mô tả');
        setLoading(false);
        return;
      }
      if (!formData.url.trim()) {
        setError('Vui lòng nhập URL');
        setLoading(false);
        return;
      }

      const updatedPost = await postService.updatePost(post.id, formData);
      onUpdate(updatedPost);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Chỉnh sửa bài viết</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Tiêu đề *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Mô tả *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Nhập mô tả bài viết"
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>
              Loại *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="image">Hình ảnh</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="url" className={styles.label}>
              URL *
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className={styles.preview}>
            <label className={styles.label}>Xem trước</label>
            <div className={styles.previewContainer}>
              {formData.type === 'video' ? (
                <video
                  src={formData.url}
                  className={styles.previewMedia}
                  controls
                  preload="metadata"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <img
                  src={formData.url}
                  alt={formData.title}
                  className={styles.previewMedia}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/500x400/f0f2f5/8b949e?text=Không+thể+tải+ảnh';
                  }}
                />
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
