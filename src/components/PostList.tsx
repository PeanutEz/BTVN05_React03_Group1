import { useState, useEffect, useCallback } from 'react';
import type { Post } from '../types/post.type';
import { postService } from '../services/post.service';
<<<<<<< HEAD
import { authService } from '../services/auth.service';
=======
import { usePostsRefresh } from '../contexts/PostsContext';
>>>>>>> ffcebe0e84611c51d67d9d18624246b57d4ff98a
import PostCard from './PostCard';
import styles from './PostList.module.css';

export default function PostList() {
  const { refreshKey } = usePostsRefresh();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
<<<<<<< HEAD
  const [currentUser] = useState(() => authService.getCurrentUser());

=======
>>>>>>> ffcebe0e84611c51d67d9d18624246b57d4ff98a
  // Load posts function
  const loadPosts = useCallback(async (pageNumber: number, isInitial = false, search = searchTerm) => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await postService.getPosts(pageNumber, 5, search);
      
      if (isInitial) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setHasMore(response.hasMore);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, searchTerm]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
    setHasMore(true);
    loadPosts(1, true, term);
  }, [loadPosts]);

  // Handle post update
  const handlePostUpdate = useCallback((updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  }, []);

  // Load initial posts
  useEffect(() => {
    loadPosts(1, true);
  }, [refreshKey]);
  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        if (hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadPosts(nextPage, false, searchTerm);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page, loadPosts, searchTerm]);
  if (error) {
    return (
      <div className={styles.emptyState}>
        {error}
      </div>
    );
  }  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>        {/* Search box */}
        <div className={styles.searchBox}>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              🔍
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className={styles.clearButton}
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>        {posts.length === 0 && !loading ? (
          <div className={styles.emptyState}>
            {searchTerm ? (
              <>
                <div className={styles.emptyIcon}>🔍</div>
                <div className={styles.emptyText}>Không tìm thấy bài viết nào với từ khóa "<strong>{searchTerm}</strong>"</div>
                <div className={styles.emptySubtext}>
                  Thử tìm kiếm với từ khóa khác
                </div>
              </>
            ) : (
              'Không có bài viết nào'
            )}
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                currentUser={currentUser}
                onPostUpdate={handlePostUpdate}
              />
            ))}            {loading && (
              <div className={styles.loadingBox}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>
                  Đang tải thêm bài viết...
                </p>
              </div>
            )}
          </>
        )}      </div>
    </div>
  );
}
