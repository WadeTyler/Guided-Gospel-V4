
import { useState, useEffect } from 'react';
import { IconHeartFilled, IconMessageDots } from '@tabler/icons-react';
import { checkIfPostLikedByUser, formatTimestampToDifference } from "../../lib/utils"
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import Comments from './Comments';


const Post = ({post}: {post:Post}) => {
  const [isLiked, setIsLiked] = useState<Boolean>(false);
  const { data:likedPosts } = useQuery<Like[]>({ queryKey: ['likedPosts'] });
  const [viewingComments, setViewingComments] = useState<Boolean>(false);

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
    <div className='w-full flex flex-col gap-2 border-[1px] border-gray-300 dark:text-darktext p-4 rounded-2xl'>
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

export default Post