/* 
  This component is the sidebar of Guided Together.
  It contains the logo, the navigation links and the user profile.
*/

import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; 

// Icons
import { IconBellFilled, IconMessages, IconLogin, IconFriends, IconMessageFilled, IconX } from "@tabler/icons-react";
import { SetStateAction, useEffect, useState } from "react";
import Loading from "../Loading";
import toast from "react-hot-toast";

const Sidebar = () => {

  const queryClient = useQueryClient();
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });
  const { data:notifications } = useQuery<NotificationType[]>({ queryKey: ['notifications'] });

  // Unseen notifications
  const unseenNotifications = () => {
    let counter = 0;
    notifications?.forEach((notification) => {
      if (notification.seen === 0) counter++;
    });
    return counter;
  }

  // Unseen messages
  const unseenMessages = () => {
    let counter = 0;
    notifications?.forEach((notification) => {
      if (notification.seen === 0 && notification.type === "message") counter++;
    });
    return counter;
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }, [authUser])


  // Creating new Post
  const [posting, setPosting] = useState(false);


  return (
    <div className="fixed flex flex-col p-4 bg-neutral-800 dark:bg-darkaccent w-48 min-h-screen left-0 top-0 gap-8 z-50 shadow-[rgba(0,0,0)_0px_2px_8px]">

      <h2 className="text-primary font-bold text-xl text-center mt-1">Guided Together</h2>

      {/* New Post */}
      {authUser && 
        <div className="flex gap-4 text-primary hover:text-white cursor-pointer" onClick={() => setPosting(true)}>
          <IconMessageFilled />
          <p>New Post</p>
        </div>
      }

      {posting && <Posting setPosting={setPosting} />}


      {/* Nav Section */}
      <section className="flex flex-col gap-4 text-primary">
        <Link to="/together" className="flex gap-4 hover:text-white">
          <IconFriends />
          <p>Home</p>
        </Link>
        <Link to="/together/messages" className="flex gap-4 hover:text-white">
          <IconMessages />
          <p>Messages</p>
          {notifications && unseenMessages() > 0 && 
            <div className="bg-red-500 w-3 h-3 rounded-full bottom-0 right-0 flex items-center justify-center p-2">
              <p className="text-xs text-white">{unseenNotifications()}</p>
            </div>
          }
        </Link>
        <Link to="/together/notifications" className="flex items-center gap-4 hover:text-white">
          <IconBellFilled />
          <p>Notifications</p>

          {notifications && unseenNotifications() > 0 && 
              <div className="bg-red-500 w-3 h-3 rounded-full bottom-0 right-0 flex items-center justify-center p-2">
                <p className="text-xs text-white">{unseenNotifications()}</p>
              </div>
            }
        </Link>
      </section>




      {/* User Profile Section */}
      {authUser && 
        <section className="flex gap-4 text-white items-center justify-center absolute bottom-5">
          <img src={authUser?.avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${authUser.avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full w-14 h-14" />
          <div className="flex flex-col">
            <p className="font-bold">{authUser.username}</p>
            <Link to={`/together/users/${authUser?.username}`} className="text-xs text-gray-200 hover:underline">View Profile</Link>
          </div>
        </section>
      }
      {/* Login Button */}
      {!authUser &&
        <Link to="/login" className="flex items-center justify-center text-primary font-bold">
            <IconLogin />
            <p>Login</p>
        </Link>
      }
    </div>
  )
}

// Posting Component - New Post
const Posting = ({setPosting}: {setPosting: React.Dispatch<SetStateAction<boolean>>;}) => {

  const queryClient = useQueryClient();

  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });
  const navigate = useNavigate();

  const [content, setContent] = useState<string>('');
  
  
  // create Post
  const { mutate:createPost, isPending:sendingPost } = useMutation({

    mutationFn: async ({ text: content }:{ text:string; }) => {
      try {
        const response = await fetch('/api/together/posts', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content })
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error((error as Error).message || "Something went wrong");
      }
    },
    onSuccess: () => {
      navigate(`/together/users/${authUser?.username}`);
      queryClient.invalidateQueries({ queryKey: ['targetPosts'] });
      toast.success("Post Created Successfully");
      setPosting(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  // submit create Post
  const handleSubmitPost = () => {
    if (content.length > 300) {
      return toast.error("Content too Long. Please keep it under 300 characters");
    }
    createPost({text: content});
  }

  return (
    <div className="fixed w-full top-0 left-0 min-h-screen bg-[rgba(0,0,0,.8)] flex items-center justify-center z-50">
      <div className="w-[40rem] h-96 bg-white rounded-2xl flex flex-col items-end justify-center dark:text-darktext dark:bg-darkbg relative p-4 gap-4">
        <IconX className="absolute top-4 right-4 hover:text-red-500 cursor-pointer" onClick={() => setPosting(false)} />
        <h4 className="text-primary text-3xl text-end mt-8 w-full">New Post</h4>
        <textarea name="createpost" id="createpost" 
          className="w-full h-full bg-white dark:bg-darkbg form-input-bar resize-none" placeholder="Send a new Post!"
          value={content}
          onChange={(e) => {
            e.preventDefault();
            setContent(e.target.value);
          }} />
          <div className="flex justify-between w-full">
            <p className={`${content.length > 300 ? 'text-red-500' : ''}`}>{content.length} / 300</p>
            {!sendingPost && <button className="flex gap-2 items-center hover:text-primary transition-all duration-300 ease-in-out " onClick={handleSubmitPost}><IconMessageFilled /> Send Post</button>}
            {sendingPost && <Loading size="md" cn="text-primary" />}
          </div>
      </div>
    </div>
  )
}

export default Sidebar