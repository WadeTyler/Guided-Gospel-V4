/* 
  This component is the sidebar of Guided Together.
  It contains the logo, the navigation links and the user profile.
*/

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; 

// Icons
import { IconBellFilled, IconMessages, IconLogin, IconFriends, IconUsersGroup } from "@tabler/icons-react";



const Sidebar = () => {

  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });

  return (
    <div className="fixed flex flex-col p-4 bg-neutral-800 dark:bg-darkaccent w-48 min-h-screen left-0 top-0 gap-8 z-50">
      {/* User Profile Section */}
      {authUser && 
        <section className="flex gap-4 text-white items-center justify-center">
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
    </div>
  )
}

export default Sidebar