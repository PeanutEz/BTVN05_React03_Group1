import { useState } from 'react';
import { postService } from '../services/post.service';
import { usePostsRefresh } from '../contexts/PostsContext';
import styles from './DeletePostButton.module.css';

interface DeletePostButtonProps {
    postId: number | string;
    onDeleted?: () => void;
}

export default function DeletePostButton({ postId, onDeleted }: DeletePostButtonProps) {
    const [loading, setLoading] = useState(false);
    const { bumpRefresh } = usePostsRefresh();

    const handleClick = async () => {
        // Hiển thị confirm dialog
        const confirmed = window.confirm('Bạn có chắc muốn xóa bài viết này không?');

        if (!confirmed) {
            return;
        }

        setLoading(true);

        try {
            // Gọi API xóa post
            await postService.deletePost(postId);

            // Gọi callback onDeleted nếu có
            if (onDeleted) {
                onDeleted();
            }

            // Trigger refresh danh sách post qua PostsContext
            bumpRefresh();
        } catch (error: any) {
            // Lấy message lỗi
            const errorMessage =
                error?.message ||
                error?.response?.data?.message ||
                'Xóa bài viết thất bại';

            // Hiển thị alert với message lỗi
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={styles.deleteButton}
            onClick={handleClick}
            disabled={loading}
            title="Xóa bài viết"
        >
            {loading ? 'Đang xóa...' : 'Xóa'}
        </button>
    );
}
