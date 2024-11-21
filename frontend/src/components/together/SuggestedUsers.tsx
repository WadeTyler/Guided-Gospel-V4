"import { useQuery } from "
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Loading";


type SuggestedUser = {
  userid: string;
  username: string;
  avatar: string;
  bio: string;
}

const SuggestedUsers = () => {


  const navigate = useNavigate();

  const { data:suggestedUsers, isPending:isLoadingSuggestedUsers } = useQuery<SuggestedUser[]>({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
      try {
        const response = await fetch("/api/together/follows/suggestedusers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        return data;
      } catch (error) {
        console.log((error as Error).message || "Something went wrong");
      }
    }
  });

  return (
    <div className="fixed top-0 right-48 mt-14 flex flex-col gap-4 border-[1px] border-gray-300 p-4 rounded-xl">

      <p className="text-primary">Suggested Users</p>
      {!isLoadingSuggestedUsers && suggestedUsers?.map((user) => (
        <div className="flex gap-2">
          <img src={user.avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${user.avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full h-10 w-10 cursor-pointer" onClick={() => navigate(`/together/users/${user.username}`)} />

          <section className="flex flex-col overflow-hidden">
            <p className="">{user.username}</p>
            <Link to={`/together/users/${user?.username}`} className="text-xs text-gray-400 hover:underline">View Profile</Link>
          </section>
        </div>
      ))}
      {isLoadingSuggestedUsers && 
        <div className="flex flex-col gap-4">
          <Loading size="md" cn="text-primary" />
          <Loading size="md" cn="text-primary" />
          <Loading size="md" cn="text-primary" />
          <Loading size="md" cn="text-primary" />
          <Loading size="md" cn="text-primary" />
        </div>
      }
    </div>
  )
}

export default SuggestedUsers