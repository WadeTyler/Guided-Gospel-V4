export {};

declare global{
  interface User  {
    userid: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    age?: number;
    denomination?: string;
    rates: number;
    defaultrates: number;
    createdat: string;
    lastactive: string;
    suspended: boolean;
    bio: string;
    followers: number;
    following: number;
  }

  interface Post {
    map(arg0: (post: Post) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    postid: number;
    userid: string;
    username: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: number;
  }

  interface Like {
    userid: string;
    postid: number;
    timestamp: string;
  }

  interface Comment {
    username: string;
    commentid: number;
    postid: number;
    userid: string;
    timestamp: string;
    content: string;
  }

  interface Follow {
    followid: string;
    followerid: string;
    followingid: string;
    timestamp: string;
  }
}

