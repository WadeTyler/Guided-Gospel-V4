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
    avatar: string;
    banner: string;
  }

  interface Post {
    suspended: number;
    map(arg0: (post: Post) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    postid: number;
    userid: string;
    username: string;
    timestamp: string;
    content: string;
    likes: number;
    comments: number;
    avatar: string;
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
    suspended: number;
    avatar: string;
  }

  interface Following {
    followingid: string;
  }

  interface Report {
    violationid: number;
    content: string;
    timestamp: string;
    violatorid: string;
    reporterid: string;
    postid: number;
  }
}

interface NotificationType {
  notificationid: number;
  receiverid: string;
  senderid: string;
  type: string;
  seen: number;
  sender_username: string;

}

interface TogetherMessage {
  messageid: number;
  sessionid: string;
  userid: string;
  username: string;
  avatar: string;
  timestamp: string;
  text: string;
}