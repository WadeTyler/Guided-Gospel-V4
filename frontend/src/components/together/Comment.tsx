import { useNavigate } from "react-router-dom"
import { formatTimestampToDifference } from "../../lib/utils"


const Comment = ({comment}: {comment:Comment}) => {

  const navigate = useNavigate();

  return (
    <div className="original-post border-[1px] border-gray-300 p-4 rounded-2xl w-full">

          <div className="flex gap-2 items-center">
            <img src="/images/default-avatar.jpg" alt="User Avatar" className="rounded-full h-10 w-10 cursor-pointer" onClick={() => navigate(`/together/users/${comment.username}`)} />
            <section className="flex flex-col justify-center">
              <p className="cursor-pointer hover:underline" onClick={() => navigate(`/together/users/${comment.username}`)} >{comment.username}</p>
              <p className="text-xs text-gray-500">{formatTimestampToDifference(comment.timestamp)}</p>
            </section>
          </div>
          <section className="flex flex-col gap-2">
            <p className="">{comment.content}</p>
          </section>
        </div>
      
  )
}

export default Comment