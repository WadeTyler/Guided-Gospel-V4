import { IconHeartFilled, IconMessageDots, IconX } from "@tabler/icons-react"
import { formatTimestampToDifference } from "../../lib/utils"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Comment from "./Comment";
import { useMutation } from "@tanstack/react-query";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";


const Comments = ({post, handleLike, isLiked, setViewingComments}:{post: Post, handleLike: () => void, isLiked:Boolean; setViewingComments: React.Dispatch<React.SetStateAction<Boolean>>}) => {
  const [commentContent, setCommentContent] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const navigate = useNavigate();

  const getComments = async () => {
    try {
      const response = await fetch(`/api/together/posts/${post.postid}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      setComments(data);
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  }

  const { mutate:addComment, isPending:sendingComment } = useMutation({
    mutationFn: async (commentContent: string) => {
      try {
        const response = await fetch(`/api/together/posts/${post.postid}/addComment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({content: commentContent})
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      toast.success("Comment added successfully");
      post.comments += 1;
      setCommentContent('');
      getComments();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  useEffect(() => {
    getComments();
  }, [post])

  return (
    <div className="fixed w-full h-screen bg-[rgba(0,0,0,.8)] z-40 top-0 left-0 flex items-center justify-center">
      
      <div className="bg-white dark:bg-darkbg w-[40rem] p-4 flex flex-col gap-4 relative max-h-[30rem] overflow-auto rounded-2xl">
        <div className="w-full flex justify-end">
          <button className="hover:text-red-500"
          onClick={() => setViewingComments(false)}
          >
            <IconX />
          </button>
        </div>
        {/* Original Post */}
        <div className="original-post border-[1px] border-gray-300 p-4 rounded-2xl">

          <div className="flex gap-2 items-center">
            <img src="/images/default-avatar.jpg" alt="User Avatar" className="rounded-full h-10 w-10 cursor-pointer" onClick={() => navigate(`/together/users/${post.username}`)} />
            <section className="flex flex-col justify-center">
              <p className="cursor-pointer hover:underline" onClick={() => navigate(`/together/users/${post.username}`)}>{post.username}</p>
              <p className="text-xs text-gray-500">{formatTimestampToDifference(post.timestamp)}</p>
            </section>
          </div>
          <section className="flex flex-col gap-2">
            <p className="">{post.content}</p>
          </section>

          <div className="action-btns w-full flex gap-8">
            <section 
            className={`flex gap-2 items-center justify-center text-xs ${isLiked ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-300'}`}>
              <IconHeartFilled onClick={() => handleLike()} className='cursor-pointer hover:scale-90 transition-all duration-300 ease-in-out' />
              <p className="">{post.likes}</p>
            </section>
          </div>
        </div>
        {/* Add Comment Section */}
        <div className="flex flex-col items-end gap-4">
          <textarea name="addcomment" id="addcomment" disabled={sendingComment} value={commentContent}
          className="w-full bg-white dark:bg-darkbg form-input-bar resize-none" placeholder={`${comments.length === 0 ? 'Be the first to comment! Add your message here...' : 'Add a comment here...' }`} onChange={(e) => {
            e.preventDefault();
            setCommentContent(e.target.value);
          }} />
          {!sendingComment && <button className="flex gap-2 items-center justify-center hover:text-primary transition-all duration-300 ease-in-out" onClick={() => addComment(commentContent)}><IconMessageDots /> Send Comment</button>}
          {sendingComment && <Loading size="md" cn="text-primary" />}
        </div>

        {/* All Comments */}
        <div className="flex flex-col w-full items-center justify-center gap-4">
          {comments.map((comment) => (
            <Comment key={comment.commentid} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Comments