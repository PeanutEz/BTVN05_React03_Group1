import { useState, useEffect } from 'react';
import { usePostsRefresh } from '../contexts/PostsContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import EditPostModal from '../components/EditPostModal';
import AddPostForm from '../components/AddPostForm';
import { authService } from '../services/auth.service';
import { postService } from '../services/post.service';
import { userService } from '../services/user.service';
import type { User } from '../types/user.type';
import type { Post } from '../types/post.type';
import styles from './ProfilePage.module.css';

const generateAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00d084&color=fff&size=150`;
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function ProfilePage() {
  const { refreshKey } = usePostsRefresh();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    fetchUserData();
  }, [refreshKey]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
        if (currentUser) {
        // Fetch user's posts by userId using new API function
        const response = await postService.getPostsByUserId(currentUser.id);
        setUserPosts(response.posts);
      }

    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${user.name}"?\n\nHành động này không thể hoàn tác!`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await userService.deleteUser(user.id);
      
      // Logout and redirect to login
      authService.logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Không thể xóa tài khoản. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditProfile = () => {
    if (!user) return;
    
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      avatar: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsUpdating(true);
      const updatedUser = await userService.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar || undefined,
        updateDate: new Date().toISOString()
      });

      // Update local state and localStorage
      setUser(updatedUser);
      authService.updateCurrentUser(updatedUser);
      
      alert('Cập nhật hồ sơ thành công!');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handleCloseEditPostModal = () => {
    setEditingPost(null);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    // Update the post in the list
    setUserPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
    setEditingPost(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>
          <h2>❌ Không tìm thấy thông tin người dùng</h2>
          <p>Vui lòng đăng nhập lại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        {/* Cột trái: Thông tin User */}
        <aside className={styles.userInfo}>
          <div className={styles.userCard}>
            <div className={styles.avatarSection}>
              <img
                src={user.avatar || generateAvatarUrl(user.name)}
                alt={user.name}
                className={styles.avatar}
              />
            </div>
            
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userEmail}>{user.email}</p>
            
            <div className={styles.userStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{userPosts.length}</span>
                <span className={styles.statLabel}>Bài viết</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>0</span>
                <span className={styles.statLabel}>Bạn bè</span>
              </div>
            </div>

            <div className={styles.userDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>👤</span>
                <div>
                  <div className={styles.detailLabel}>Vai trò</div>
                  <div className={styles.detailValue}>{user.role}</div>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>📅</span>
                <div>
                  <div className={styles.detailLabel}>Tham gia</div>
                  <div className={styles.detailValue}>{formatDate(user.createDate)}</div>
                </div>
              </div>
              
              {user.updateDate && (
                <div className={styles.detailItem}>
                  <span className={styles.detailIcon}>🔄</span>
                  <div>
                    <div className={styles.detailLabel}>Cập nhật</div>
                    <div className={styles.detailValue}>{formatDate(user.updateDate)}</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <button 
                className={styles.editButton}
                onClick={handleEditProfile}
              >
                ✏️ Chỉnh sửa hồ sơ
              </button>
              <button 
                className={styles.editButton}
                style={{ backgroundColor: '#dc3545' }}
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? '⏳ Đang xóa...' : '🗑️ Xóa tài khoản'}
              </button>
            </div>
          </div>
        </aside>

        {/* Cột phải: Posts của User */}
        <main className={styles.postsSection}>
          <div className={styles.postsHeader}>
            <h2>📝 Bài viết của tôi</h2>
            <span className={styles.postCount}>{userPosts.length} bài viết</span>
          </div>

          <AddPostForm />

          {userPosts.length > 0 ? (
            <div className={styles.postsList}>
              {userPosts.map(post => (
                <article key={post.id} className={styles.postCard}>
                  <div className={styles.postHeader}>
                    <img
                      src={post.avatar || generateAvatarUrl(post.userName)}
                      alt={post.userName}
                      className={styles.postAvatar}
                    />
                    <div className={styles.postMeta}>
                      <div className={styles.postAuthor}>{post.userName}</div>
                      <div className={styles.postDate}>{formatDate(post.createDate)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`${styles.postType} ${styles[post.type]}`}>
                        {post.type === 'image' ? '🖼️' : '🎥'} {post.type}
                      </span>
                      <button
                        className={styles.editPostButton}
                        onClick={() => handleEditPost(post)}
                        title="Chỉnh sửa bài viết"
                      >
                        ✏️
                      </button>
                    </div>
                  </div>

                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postDescription}>{post.description}</p>

                  {post.url && (
                    <div className={styles.postMedia}>
                      {post.type === 'image' ? (
                        <img 
                          src={post.url} 
                          alt={post.title} 
                          className={styles.mediaImage}
                        />
                      ) : (
                        <video 
                          src={post.url} 
                          controls 
                          className={styles.mediaVideo}
                        />
                      )}
                    </div>
                  )}

                  <div className={styles.postActions}>
                    <button className={styles.actionButton}>
                      👍 Thích
                    </button>
                    <button className={styles.actionButton}>
                      💬 Bình luận
                    </button>
                    <button className={styles.actionButton}>
                      🔗 Chia sẻ
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.noPosts}>
              <div className={styles.noPostsIcon}>📝</div>
              <h3>Chưa có bài viết nào</h3>
              <p>Hãy chia sẻ bài viết đầu tiên của bạn!</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal for editing profile */}
      {isModalOpen && user && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>✏️ Chỉnh sửa hồ sơ</h2>
              <button className={styles.modalCloseButton} onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleUpdateProfile} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Tên hiển thị *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                  placeholder="Nhập tên của bạn"
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
                  placeholder="Nhập email của bạn"
                />
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
                {formData.avatar && (
                  <div className={styles.avatarPreview}>
                    <img 
                      src={formData.avatar} 
                      alt="Avatar preview" 
                      onError={(e) => {
                        e.currentTarget.src = generateAvatarUrl(formData.name);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelButton}
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isUpdating}
                >
                  {isUpdating ? '⏳ Đang cập nhật...' : '💾 Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing post */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          isOpen={!!editingPost}
          onClose={handleCloseEditPostModal}
          onUpdate={handlePostUpdate}
        />
      )}
    </div>
  );
}
