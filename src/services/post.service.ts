import api from './api';
import type { Post } from '../types/post.type';
import api from './api';


export interface PostResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

<<<<<<< HEAD
export interface UpdatePostRequest {
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
}
=======
export type CreatePostRequest = Omit<Post, 'id'>;

>>>>>>> ffcebe0e84611c51d67d9d18624246b57d4ff98a

export const postService = {
  // Lấy posts với pagination và search (CALL API thật)
async getPosts(page: number = 1, limit: number = 5, searchTerm: string = ''): Promise<PostResponse> {
  try {
    // Lấy toàn bộ posts từ API rồi filter/sort/paginate phía client để tránh phụ thuộc query params backend
    const response = await api.get<Post[]>('/posts');
    let activePosts = response.data.filter((p) => p.status === 'active');

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      activePosts = activePosts.filter((p) => p.title.toLowerCase().includes(q));
    }

    activePosts = activePosts.sort(
      (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = activePosts.slice(startIndex, endIndex);

    return {
      posts,
      total: activePosts.length,
      hasMore: endIndex < activePosts.length,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Không thể lấy danh sách bài viết';
    throw new Error(message);
  }
},

  // Lấy posts của một user cụ thể theo userId (CALL API thật)
async getPostsByUserId(userId: string | number, page: number = 1, limit: number = 100): Promise<PostResponse> {
  try {
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const response = await api.get<Post[]>('/posts');
    let userPosts = response.data.filter(
      (p) => p.status === 'active' && p.userId === userIdNum
    );

    userPosts = userPosts.sort(
      (a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = userPosts.slice(startIndex, endIndex);

    return {
      posts,
      total: userPosts.length,
      hasMore: endIndex < userPosts.length,
    };
<<<<<<< HEAD
  },

  // Cập nhật bài viết
  async updatePost(postId: string, data: UpdatePostRequest): Promise<Post> {
    try {
      const updateData = {
        ...data,
        updateDate: new Date().toISOString()
      };
      
      const response = await api.put<Post>(`/posts/${postId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Không thể cập nhật bài viết');
    }
=======
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Không thể lấy bài viết của người dùng';
    throw new Error(message);
>>>>>>> ffcebe0e84611c51d67d9d18624246b57d4ff98a
  }
}
,
// Tạo post mới (CALL API thật)
async createPost(payload: CreatePostRequest): Promise<Post> {
  try {
    const response = await api.post<Post>('/posts', payload);
    return response.data;
  } catch (error: any) {
    // MockAPI thường trả lỗi dạng này
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Không thể tạo bài viết';
    throw new Error(message);
  }
},

// Xóa post (CALL API thật)
async deletePost(postId: number | string): Promise<void> {
  try {
    await api.delete(`/posts/${postId}`);
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Không thể xóa bài viết';
    throw new Error(message);
  }
}
};