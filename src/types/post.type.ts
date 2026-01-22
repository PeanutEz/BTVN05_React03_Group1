export interface Post {
    id: string,
    userId: number,
    userName: string,
    avatar: string,
    title: string,
    description: string,
    status: 'active' | 'inactive',
    type: 'image' | 'video',
    url: string,
    createDate: string,
    updateDate: string
}