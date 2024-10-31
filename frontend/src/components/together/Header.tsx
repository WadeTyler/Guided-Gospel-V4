import { IconBellFilled, IconMessages } from "@tabler/icons-react";
import { useState } from "react";
import Posting from "./Posting";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Header = () => {
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });
  const [isPosting, setIsPosting] = useState<Boolean>(false);


  return (
    <header className="flex w-full bg-white dark:bg-zinc-600 text-primary justify-between items-center px-4 py-2 shadow-lg z-50 fixed top-0 h-20">
        {/* Left Side */}
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Guided Together</h1>
          <Link to="/together" className="">Home</Link>
          <p className="">Groups</p>
          <p className="">News</p>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => setIsPosting(true)} className="submit-btn">New Post</button>
          <p className=""><IconMessages /></p>
          <p className=""><IconBellFilled /></p>
          <Link to={`/together/users/${authUser?.username}`} className="border-2 rounded-full border-primary">
              <img src="/images/testimonials/David.png" alt="User Profile Image" className="w-12 h-12" />
          </Link>
        </div>

        {isPosting && <Posting setIsPosting={setIsPosting} />}
      </header>
  )
}

export default Header