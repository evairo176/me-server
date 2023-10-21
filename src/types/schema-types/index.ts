export interface UserInterface {
  id: string;
  email: string;
  username: string;
  fullname: string;
  password: string;
  bio?: string;
  profile_img?: string;
  youtube?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  github?: string;
  website?: string;
  total_posts: number;
  total_reads: number;
  createdAt: Date;
  updatedAt: Date;
  blogs: Blog[];
}

export interface Blog {
  id: string;
  authorId: string;
  slug: string;
  title: string;
  image: string;
  des?: string;
  content: any[]; // You might want to define a more specific type for content.
  // tags: string[];
  Author: UserInterface[];
  // total_likes: number;
  // total_comments: number;
  // total_reads: number;
  // total_parent_comments: number;
  draft: boolean;
  createdAt: Date;
  updatedAt: Date;
}
