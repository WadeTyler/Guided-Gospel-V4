import { useNavigate } from "react-router-dom";

export const UserAvatar = ({ avatar, username, size = "10" }: { avatar?: string; username: string; size?: string; }) => {

  const navigate = useNavigate();

  return (
    <img src={avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className={`rounded-full h-${size} w-${size} cursor-pointer`} onClick={() => navigate(`/together/users/${username}`)} />
  )
}
