import { useState } from 'react';
import type { Post } from '../types/post.type';
<<<<<<< HEAD
import type { User } from '../types/user.type';
=======
import { authService } from '../services/auth.service';
import DeletePostButton from './DeletePostButton';
>>>>>>> ffcebe0e84611c51d67d9d18624246b57d4ff98a
import styles from './PostCard.module.css';
import EditPostModal from './EditPostModal';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onPostUpdate?: (updatedPost: Post) => void;
}

// Helper function để tính thời gian
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else {
    return postDate.toLocaleDateString('vi-VN');
  }
};

// Generate avatar từ tên nếu không có avatar từ user data
const generateAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d084&color=fff&size=56`;
};

<<<<<<< HEAD
export default function PostCard({ post, currentUser, onPostUpdate }: PostCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isOwner = currentUser && parseInt(currentUser.id) === post.userId;

  const handleUpdate = (updatedPost: Post) => {
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
  };
=======
export default function PostCard({ post }: PostCardProps) {
  const currentUser = authService.getCurrentUser();
  // Chỉ hiển thị nút xóa khi:
  // 1. User đang đăng nhập (không phải admin)
  // 2. Bài viết thuộc về user đó (post.userId === currentUser.id)
  const canDelete = 
    currentUser && 
    currentUser.role !== 'Admin' && 
    post.userId === parseInt(currentUser.id, 10);
>>>>>>> ffcebe0e84611c51d67d9d18624246b57d4ff98a

  return (
    <>
      <div className={styles.postCard}>
        {/* Header với thông tin người dùng */}
        <div className={styles.header}>
          <img
            src={post.avatar || generateAvatarUrl(post.userName)}
            alt={post.userName}
            className={styles.avatar}
            onError={(e) => {
              // Fallback to generated avatar if post avatar fails to load
              e.currentTarget.src = generateAvatarUrl(post.userName);
            }}
          />
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              {post.userName}
            </div>          <div className={styles.timeInfo}>
              <span className={styles.timeAgo}>
                {getTimeAgo(post.createDate)}
              </span>
            </div>
          </div>
          
          {/* More options button - chỉ hiển thị nút edit nếu là chủ bài viết */}
          {isOwner ? (
            <div className={styles.moreButton} onClick={() => setIsEditModalOpen(true)} title="Chỉnh sửa bài viết">
              <span>✏️</span>
            </div>
          ) : (
            <div className={styles.moreButton}>
              <span>•••</span>
            </div>
          )}
        </div>

      {/* Nội dung bài viết */}
      <div className={styles.content}>
        <h3 className={styles.title}>
          {post.title}
        </h3>
        <p className={styles.description}>
          {post.description}
        </p>
      </div>      {/* Media content - Image hoặc Video */}
      <div className={styles.mediaContainer}>
        {post.type === 'video' ? (
          <video
            src={post.url}
            className={styles.video}
            controls
            preload="metadata"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <img
            src={post.url}
            alt={post.title}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/500x400/f0f2f5/8b949e?text=Không+thể+tải+ảnh';
            }}
          />
        )}
      </div>

      {/* Action bar với like, comment, share */}
      <div className={styles.actionBar}>
        <div className={styles.actionButtons}>
          {/* Like button */}
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>👍</span>
            Thích
          </button>

          {/* Comment button */}
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>💬</span>
            Bình luận
          </button>

          {/* Share button */}
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>📤</span>
            Chia sẻ
          </button>
        </div>

        {/* Delete button - chỉ hiển thị khi user là chủ sở hữu bài viết */}
        {canDelete && <DeletePostButton postId={post.id} />}
      </div>
      </div>

      {isEditModalOpen && (
        <EditPostModal
          post={post}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
