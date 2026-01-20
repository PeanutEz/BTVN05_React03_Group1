export interface Post {
    id: number,
    userId: number,
    userName: string,
    title: string,
    description: string,
    status: 'active' | 'inactive',
    createDate: string,
    updateDate?: string,
    imgUrl?: string
}