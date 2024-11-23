import { useNavigate } from "react-router-dom"
import { formatTimestampToDifference } from "../../lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaDeleteLeft } from "react-icons/fa6";
import { SetStateAction, useState } from "react";
import Loading from "../Loading";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Comment = ({comment}: {comment:Comment}) => {

  const navigate = useNavigate();
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });

  // If the user is supsended do not display the comment
  if (comment.suspended === 1) {
    return null;
  }

  const [deletingComment, setDeletingComment] = useState<boolean>(false);

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: .5 }}
    className="relative border-[1px] border-gray-300 hover:border-primary duration-300 shadow-lg p-4 rounded-2xl w-full h-fit dark:text-white">

        {/* Delete Button */}
        {authUser?.userid === comment.userid &&
          <FaDeleteLeft className="absolute top-4 right-4 hover:text-red-500 cursor…-pointer duration-300" onClick={() => {setDeletingComment(true);}} />
        }
        {deletingComment &&
          <DeleteComment comment={comment} setDeletingComment={setDeletingComment} />
        }

          <div className="flex gap-2 items-center">
            <img src={comment.avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${comment.avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full h-10 w-10 cursor-pointer" onClick={() => navigate(`/together/users/${comment.username}`)} />
            <section className="flex flex-col justify-center">
              <p className="cursor-pointer hover:underline" onClick={() => navigate(`/together/users/${comment.username}`)} >{comment.username}</p>
              <p className="text-xs text-gray-500">{formatTimestampToDifference(comment.timestamp)}</p>
            </section>
          </div>
          <section className="flex flex-col gap-2 ">
            <p className="break-words">{comment.content}</p>
          </section>
        </motion.div>
      
  )
}

const DeleteComment = ({comment, setDeletingComment}: {comment: Comment; setDeletingComment: React.Dispatch<SetStateAction<boolean>>;}) => {

  const queryClient = useQueryClient();

  const { mutate:deleteComment, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/together/posts/${comment.postid}/${comment.commentid}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);
        console.log(data);
        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      setDeletingComment(false);
      queryClient.invalidateQueries({ queryKey: ['currentComments'] });      
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  });


  return (
    <div className="fixed w-full top-0 left-0 min-h-screen bg-[rgba(0,0,0,.8)] flex items-center justify-center z-50">
      <div className="bg-white dark:bg-darkbg dark:text-darktext rounded-2xl w-96 h-fit flex flex-col items-center justify-center p-4 gap-2 relative">
        {/* Close Button */}
        <h4 className="text-primary text-2xl w-full text-end">Confirm Delete Comment</h4>  
        <p className="text-lg">Are you sure you want to delete this Comment?</p>
        {!isPending && <section className="flex gap-2">
          <button className="delete-btn" onClick={() => deleteComment()} >Yes, Delete this comment</button>
          <button className="neutral-btn" onClick={() => setDeletingComment(false)}>Cancel</button>
        </section>}
        {isPending && <Loading cn="text-primary" size="md" />}
      </div>
    </div>
  )

}

export default Comment