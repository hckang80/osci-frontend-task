export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  content: string;
  createdAt: string;
}
