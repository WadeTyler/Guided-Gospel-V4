
import { useState, useEffect, SetStateAction } from 'react';
import { IconHeartFilled, IconMessageDots, IconX } from '@tabler/icons-react';
import { checkIfPostLikedByUser, formatTimestampToDifference } from "../../lib/utils"
import toast from 'react-hot-toast';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Comments from './Comments';
import { FaDeleteLeft } from 'react-icons/fa6';
import Loading from '../Loading';


const Post = ({post}: {post:Post}) => {
  const [isLiked, setIsLiked] = useState<Boolean>(false);
  const { data:likedPosts } = useQuery<Like[]>({ queryKey: ['likedPosts'] });
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });
  const [viewingComments, setViewingComments] = useState<Boolean>(false);
  const [deletingPost, setDeletingPost] = useState<Boolean>(false);

  useEffect(() => {
    if (likedPosts) {
      setIsLiked(checkIfPostLikedByUser(likedPosts, post.postid));
    }
  },[likedPosts])

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/together/posts/${post.postid}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLiked) {
        post.likes -= 1;
      } else {
        post.likes += 1;
      }

      setIsLiked(!isLiked);
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  }

  return (
    <div className='w-full flex flex-col gap-2 border-[1px] border-gray-300 dark:text-darktext p-4 rounded-2xl relative'>

      {/* Delete Button */}
      {authUser?.userid === post.userid &&
        <FaDeleteLeft className="absolute top-4 right-4 hover:text-red-500 cursor-pointer duration-300" onClick={() => {setDeletingPost(true);}} />
      }
      {deletingPost &&
        <DeletingPost post={post} setDeletingPost={setDeletingPost} />
      }

      <div className="flex gap-2 items-center">
        <img src="/images/default-avatar.jpg" alt="User Avatar" className="rounded-full h-10 w-10" />
        <section className="flex flex-col justify-center">
          <p className="">{post.username}</p>
          <p className="text-xs text-gray-500">{formatTimestampToDifference(post.timestamp)}</p>
        </section>
      </div>
      <section className="flex flex-col gap-2">
        <p className="">{post.content}</p>
      </section>

      <div className="action-btns w-full flex gap-8">
        <section 
        className={`flex gap-2 items-center justify-center text-xs ${isLiked ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-300'}`}>
          <IconHeartFilled onClick={() => handleLike()} className={`cursor-pointer hover:scale-90 transition-all duration-300 ease-in-out hover:text-red-800`} />
          <p className="">{post.likes}</p>
        </section>

        <section className="flex gap-2 items-center justify-center text-xs text-zinc-500 dark:text-zinc-300">
          <IconMessageDots onClick={() => {setViewingComments(true)}} className={`cursor-pointer hover:scale-90 transition-all duration-300 ease-in-out hover:text-zinc-800 dark:hover:text-zinc-600`}/>
          <p className="">{post.comments}</p>
        </section>
      </div>

      {viewingComments && <Comments post={post} handleLike={handleLike} isLiked={isLiked} setViewingComments={setViewingComments} />}
    </div>
  )
}

const DeletingPost = ({post, setDeletingPost}: {post:Post; setDeletingPost:React.Dispatch<SetStateAction<Boolean>>; }) => {

  const queryClient = useQueryClient();

  const { mutate:deletePost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/together/posts/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postid: post.postid })
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
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['targetPosts'] });

      setDeletingPost(false);
    },
    onError: (error) => {
      toast.error((error as Error).message || "Something went wrong");
    }
  });

  return (
    <div className="fixed w-full top-0 left-0 min-h-screen bg-[rgba(0,0,0,.8)] flex items-center justify-center z-50">
      <div className="bg-white dark:bg-darkbg dark:text-darktext rounded-2xl w-96 h-fit flex flex-col items-center justify-center p-4 gap-2 relative">
        {/* Close Button */}
        <h4 className="text-primary text-2xl w-full text-end">Confirm Delete Post</h4>  
        <p className="text-lg">Are you sure you want to delete this post?</p>
        {!isPending && <section className="flex gap-2">
          <button className="delete-btn" onClick={() => deletePost()} >Yes, Delete this post</button>
          <button className="neutral-btn" onClick={() => setDeletingPost(false)}>Cancel</button>
        </section>}
        {isPending && <Loading cn="text-primary" size="md" />}
      </div>
    </div>
  )
}

export default Post