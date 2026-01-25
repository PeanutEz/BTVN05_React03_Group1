import { createContext, useContext, useMemo, useState } from 'react';

type PostsRefreshContextValue = {
  refreshKey: number;
  bumpRefresh: () => void;
};

const PostsRefreshContext = createContext<PostsRefreshContextValue | null>(null);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const value = useMemo(
    () => ({
      refreshKey,
      bumpRefresh: () => setRefreshKey((k) => k + 1),
    }),
    [refreshKey]
  );

  return <PostsRefreshContext.Provider value={value}>{children}</PostsRefreshContext.Provider>;
}

export function usePostsRefresh() {
  const ctx = useContext(PostsRefreshContext);
  if (!ctx) {
    throw new Error('usePostsRefresh must be used within PostsProvider');
  }
  return ctx;
}
