export type Post = {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
};

export type Comment = {
  id: number;
  postId: number;
  text: string;
};
