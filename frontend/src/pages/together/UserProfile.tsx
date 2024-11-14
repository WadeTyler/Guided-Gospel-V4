
import { useEffect, useState } from 'react';
import { IconUserPlus, IconMessages, IconFriendsOff, IconEdit, IconDeviceFloppy, IconBackspaceFilled, IconHammer } from '@tabler/icons-react'
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import Post from '../../components/together/Post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatTimestampToDifference, checkIfFollowingTarget } from '../../lib/utils';
import Sidebar from '../../components/together/Sidebar';
import Comment from '../../components/together/Comment';
import Loading from '../../components/Loading';


const UserProfile = () => {

  const queryClient = useQueryClient();
  const username = useParams<{username:string}>().username;

  const [type, setType] = useState<string>('posts');

  const [followingTarget, setFollowingTarget] = useState<boolean>(false);
  const [isSelf, setIsSelf] = useState<boolean>(false);

  // authAdmin
  const { data:authAdmin } = useQuery({ queryKey: ['authAdmin'] });
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });
  const { data:followingList } = useQuery<Following[]>({ queryKey: ['followingList'] });

  

  const { data:targetUser } = useQuery<User>({
    queryKey: ['targetUser'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/user/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      }
    }
  });
  
  const { data:targetPosts } = useQuery<Post[]>({
    queryKey: ['targetPosts'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/together/posts/users/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
    
        return data;
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      }
    }
  });

  const { data:targetComments } = useQuery<Comment[]>({
    queryKey: ['targetComments'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/together/posts/users/comments/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        return data;
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      }
    }
  })

  const { data:targetLikedPosts } = useQuery<Post[]>({
    queryKey: ['targetLikedPosts'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/together/posts/users/likes/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        console.log(data);
      
        return data;
      } catch (error) {
        toast.error((error as Error).message || "Something went wrong");
      }
    }
  })


  const { mutate:followUser } = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`/api/together/follows/${username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
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

      // Update the following List
      if (followingTarget) {
        setFollowingTarget(false);
        followingList?.splice(followingList?.findIndex((following) => following.followingid === targetUser?.userid), 1);
        if (targetUser) {
          targetUser.followers -= 1;
        }
      }
      else {
        setFollowingTarget(true);
        if (targetUser) {
          followingList?.push({ followingid: targetUser.userid });
          targetUser.followers += 1;
        }
      }

    },
    onError: (error) => {
      toast.error((error as Error).message || "Something went wrong");
    }
  });

  // Invalidate the query when the username changes
  useEffect(() => {
    
    queryClient.invalidateQueries({ queryKey: ['targetUser'] });
    if (type === 'posts') {
      queryClient.invalidateQueries({ queryKey: ['targetPosts'] });
    }
    if (type === 'comments') {
      queryClient.invalidateQueries({ queryKey: ['targetComments'] });
    }

    if (type === 'likes') {
      queryClient.invalidateQueries({ queryKey: ['targetLikedPosts'] });
    }

    // Check if is self
    if (authUser && username === authUser?.username) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }

  }, [username, type]);

  // Check if the user is following the target user
  useEffect(() => {
    if (followingList && targetUser) {
      setFollowingTarget(checkIfFollowingTarget(followingList, targetUser.userid));
    }
    
  }, [targetUser, followingList]);

  // editing self
  const [editing, setEditing] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File>();
  const [bio, setBio] = useState<string>(authUser?.bio || '');

  const { mutate:changeAvatar, isPending:savingAvatar } = useMutation({
    mutationFn: async () => {
      try {

        const form = new FormData();
        avatar && form.append('avatar', avatar);

        const response = await fetch('/api/user/changeavatar', {
          method: "POST",
          body: form
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error (data.message || "Something went wrong");
        }
        
        console.log(data);
        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: async () => {
      setEditing(false);
      setAvatar(undefined);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.invalidateQueries({ queryKey: ['targetUser'] });
      toast.success("Profile updated successfully");
    },
    onError: async (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  });

  const { mutate:updateUserProfile, isPending:saving } = useMutation({
    mutationFn: async () => {
      try {
        if (bio.length > 300) {
          throw new Error("Bio is too long. 300 characters max.");
        }

        const response = await fetch('/api/user/updatetogetherprofile', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bio })
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    onSuccess: async () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      queryClient.invalidateQueries({ queryKey: ['targetUser'] });
      toast.success("Profile updated successfully");
    },
    onError: async (error: Error) => {
      toast.error((error as Error).message || "Something went wrong")
    }
  }) 

  const submitChanges = () => {
    if (avatar) {
      changeAvatar();
    }

    if (bio) {
      updateUserProfile();
    }
  }


  return (
    <div className='flex justify-center bg-white dark:bg-darkbg min-h-screen'>
      <Sidebar />

      {/* Body Content */}
      <div className="w-[40rem]">
        
        {targetUser && <div className="">
          {/* Banner Image */}
          <div className="w-full h-32 bg-zinc-500 flex items-center justify-start">

          </div>

          {/* User Profile */}
          <div className="w-full min-h-32 border-gray-300 border-[1px] flex flex-col justify-center p-8 dark:text-darktext">
            <div className="flex gap-4 w-full">
              <div className="w-16 h-14 rounded-full relative">
                <img src={targetUser?.avatar ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${targetUser.avatar}` : "/images/default-avatar.jpg"} alt="User Avatar" className="rounded-full w-16 h-14" />
                {isSelf && editing && (
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar"
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatar(file);
                        toast.success("Avatar Changed. Save Changes to see your new Avatar!");
                      }
                    }}
                  />
                )}
                {isSelf && editing && !savingAvatar && !saving &&
                  <label htmlFor="avatar"><IconEdit className='bg-primary w-6 h-6 p-1 rounded-full absolute bottom-0 right-0 hover:scale-110 cursor-pointer' /></label>
                }

              </div>
              
              <section className="flex flex-col w-full">
                <div className="flex justify-between w-full">
                  <section className="flex flex-col">
                    {/* Username and Admin Hammer */}
                    <p className="flex gap-2">
                      {targetUser?.username} 
                      {authAdmin ? <Link to={`/admin/users/${targetUser.userid}`}> <IconHammer className='text-primary' /></Link> : '' }
                    </p>
                    <p className="text-gray-500 text-xs">{formatTimestampToDifference(targetUser?.createdat || '')}</p>
                  </section>
                  <section className="action-btns flex items-center justify-center gap-8 text-primary">
                    {isSelf && saving && !savingAvatar && <Loading cn="text-primary" size="md" />}
                    {isSelf && !saving && !savingAvatar && 
                      <div className="flex gap-8">
                        {editing && 
                          <button onClick={() => {
                            submitChanges();
                          }} className='flex gap-2'>
                            <IconDeviceFloppy /> Save Changes
                          </button>
                        }
                        <button onClick={() => {
                          setEditing(!editing);
                        }}
                        className="flex gap-2">
                          {!editing ? 
                          <span className="flex gap-2"><IconEdit /> Edit Profile</span>  
                          : 
                          <span className="flex gap-2"><IconBackspaceFilled />Cancel Changes</span> }
                        </button>
                        
                      </div>
                    }
                    {!isSelf && 
                      <button className="flex gap-2">
                        <span className='flex gap-2'><IconMessages /> Message</span>
                      </button>
                    }
                    {!isSelf && 
                      <button onClick={() => followUser()}>
                        {!followingTarget && <span className='flex gap-2'> <IconUserPlus /> Follow</span>}
                        {followingTarget && <span className='flex gap-2'> <IconFriendsOff /> Unfollow</span>}   
                      </button>
                    }
                  </section>
                </div>
                <section className="flex gap-2">
                  <p className="text-xs">{targetUser?.followers} Followers</p>
                  <p className="text-xs">{targetUser?.following} Following</p>
                </section>
                {!editing && 
                  <p className={`${targetUser?.bio ? 'text-sm' : 'text-xs text-gray-500'}`}>
                    {targetUser?.bio || "This user has not set a bio yet"}
                  </p>
                }
                {editing && 
                  <div className="flex flex-col gap-2 mt-2">
                    <textarea name="bio" id="bio" className='text-sm text-gray-500 resize-none form-input-bar' defaultValue={targetUser?.bio} onChange={(e) => {
                    setBio(e.target.value);
                    }} />
                    <p className="text-xs"><span className={`${bio.length > 300 ? 'text-red-500' : 'text-primary'}`}>{bio.length}</span>/300</p>
                  </div>
                }
              </section>
              
            </div>
          </div>

          {/* User Posts */}
          <div className="flex flex-col gap-4 mt-4">
            <div className="w-full flex items-center justify-center gap-8 text-primary text-2xl">
              <p 
              onClick={() => setType('posts')}
              className={`${type === "posts" ? 'border-b-2 border-b-primary' : 'hover:scale-110 text-darkbg dark:text-white'} pb-2 cursor-pointer duration-300`}>
                Posts
              </p>
              <p 
              onClick={() => setType('comments')}
              className={`${type === "comments" ? 'border-b-2 border-b-primary' : 'hover:scale-110 text-darkbg dark:text-white'} pb-2 cursor-pointer duration-300`}>
                Comments
              </p>
              <p
              onClick={() => setType('likes')}
              className={`${type === "likes" ? 'border-b-2 border-b-primary' : 'hover:scale-110 text-darkbg dark:text-white'} pb-2 cursor-pointer duration-300`}>
                Likes
              </p>
            </div>
            <div id="user-post-container" className="flex flex-col gap-4">
              {type === "posts" && targetPosts?.map((post) => (
                <Post key={post.postid} post={post} />
              ))}
              {type === "posts" && targetPosts?.length === 0 && <p className="text-primary text-2xl">No Posts Yet</p>}
              {type === "comments" && targetComments?.map((comment) => (
                <Comment key={comment.commentid} comment={comment} />
              ))}
              {type === "comments" && targetComments?.length === 0 && <p className="text-primary text-2xl">No Comments Yet</p>}
              {type === "likes" && targetLikedPosts?.map((post) => (
                <Post key={post.postid} post={post} />
              ))}
              {type === "likes" && targetLikedPosts?.length === 0 && <p className="text-primary text-2xl">No Liked Posts Yet</p>}
            </div>
          </div>
        </div>}
        {!targetUser && 
          <div className="w-full flex items-center justify-center h-1/2">
            <h4 className="text-primary text-3xl">No User exists with that Username</h4>
          </div>
        }
      </div>
    </div>
  )
}

export default UserProfile