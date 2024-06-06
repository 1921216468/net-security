// types/Post.ts
interface Post {
    id: string;
    title: string;
    content: string;
    tags: string[]; // 这里是标签数组，你可以根据实际需求修改
    thumbNum: number;
    favourNum: number;
    userId: string;
    createTime: string;
    updateTime: string;
    isDelete: number;
}

export default Post;
