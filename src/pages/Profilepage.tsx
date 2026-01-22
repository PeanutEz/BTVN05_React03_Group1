import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { authService } from '../services/auth.service';
import { postService } from '../services/post.service';
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
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);      if (currentUser) {
        // Fetch user's posts
        const response = await postService.getPosts(1, 100); // Get all posts
        const filteredPosts = response.posts.filter((post: Post) => post.userName === currentUser.name);
        setUserPosts(filteredPosts);
      }

    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
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

            <button className={styles.editButton}>
              ✏️ Chỉnh sửa hồ sơ
            </button>
          </div>
        </aside>

        {/* Cột phải: Posts của User */}
        <main className={styles.postsSection}>
          <div className={styles.postsHeader}>
            <h2>📝 Bài viết của tôi</h2>
            <span className={styles.postCount}>{userPosts.length} bài viết</span>
          </div>

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
                    <span className={`${styles.postType} ${styles[post.type]}`}>
                      {post.type === 'image' ? '🖼️' : '🎥'} {post.type}
                    </span>
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
    </div>
  );
}
