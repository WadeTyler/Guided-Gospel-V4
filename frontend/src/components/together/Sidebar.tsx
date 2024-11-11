/* 
  This component is the sidebar of Guided Together.
  It contains the logo, the navigation links and the user profile.
*/

import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; 

// Icons
import { IconBellFilled, IconMessages, IconLogin, IconFriends, IconUsersGroup, IconMessageFilled, IconX } from "@tabler/icons-react";
import { SetStateAction, useState } from "react";
import Loading from "../Loading";
import toast from "react-hot-toast";

const Sidebar = () => {

  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });

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
        <Link to="/together" className="flex gap-4 hover:text-white">
          <IconMessages />
          <p>Messages</p>
        </Link>
        <Link to="/together" className="flex gap-4 hover:text-white">
          <IconBellFilled />
          <p>Notifications</p>
        </Link>
        <Link to="/together" className="flex gap-4 hover:text-white">
          <IconUsersGroup />
          <p>Groups</p>
        </Link>
      </section>




      {/* User Profile Section */}
      {authUser && 
        <section className="flex gap-4 text-white items-center justify-center absolute bottom-5">
          <img src="/images/testimonials/David.png" alt="User Profile Image" className="w-12 h-12" />
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
          {!sendingPost && <button className="flex gap-2 items-center hover:text-primary transition-all duration-300 ease-in-out " onClick={handleSubmitPost}><IconMessageFilled /> Send Post</button>}
          {sendingPost && <Loading size="md" cn="text-primary" />}
      </div>
    </div>
  )
}

export default Sidebar