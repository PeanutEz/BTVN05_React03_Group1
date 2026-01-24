import type { Post } from '../types/post.type';

// Mock data - trong thực tế sẽ fetch từ API
import postsData from '../data/posts.example.json';

export interface PostResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

export const postService = {
  // Lấy posts với pagination và search
  async getPosts(page: number = 1, limit: number = 5, searchTerm: string = ''): Promise<PostResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter only active posts
    let activePosts = (postsData as Post[])
      .filter(post => post.status === 'active');
    
    // Search by title if searchTerm is provided
    if (searchTerm.trim()) {
      activePosts = activePosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by createDate (newest first)
    activePosts = activePosts.sort((a, b) => 
      new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = activePosts.slice(startIndex, endIndex);
      return {
      posts,
      total: activePosts.length,
      hasMore: endIndex < activePosts.length
    };
  },
  // Lấy posts của một user cụ thể theo userId (simulating ?userId=...)
  async getPostsByUserId(userId: string | number, page: number = 1, limit: number = 100): Promise<PostResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert userId to number for comparison
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    
    // Filter posts by userId and active status
    let userPosts = (postsData as Post[])
      .filter(post => post.status === 'active' && post.userId === userIdNum);
    
    // Sort by createDate (newest first)
    userPosts = userPosts.sort((a, b) => 
      new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = userPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      total: userPosts.length,
      hasMore: endIndex < userPosts.length
    };
  }
};