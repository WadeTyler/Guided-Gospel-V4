
import { useEffect, useState } from 'react';
import Header from '../../components/together/Header'
import { IconUserPlus, IconMessages, IconFriendsOff } from '@tabler/icons-react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Post from '../../components/together/Post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatTimestampToDifference, checkIfFollowingTarget } from '../../lib/utils';



const UserProfile = () => {

  const queryClient = useQueryClient();
  const username = useParams<{username:string}>().username;

  const [followingTarget, setFollowingTarget] = useState<boolean>(false);
  const [isSelf, setIsSelf] = useState<boolean>(false);

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
    queryClient.invalidateQueries({ queryKey: ['targetPosts'] });

    // Check if is self
    if (authUser && username === authUser?.username) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }

  }, [username]);

  // Check if the user is following the target user
  useEffect(() => {
    if (followingList && targetUser) {
      setFollowingTarget(checkIfFollowingTarget(followingList, targetUser.userid));
    }

    console.log(targetUser);

    console.log(followingList);
  }, [targetUser, followingList]);
  

  return (
    <div className='flex justify-center bg-white dark:bg-darkbg min-h-screen'>
      <Header />

      {/* Body Content */}
      <div className="w-[40rem] mt-20">
        
        {targetUser && <div className="">
          {/* Banner Image */}
          <div className="w-full h-32 bg-zinc-500 flex items-center justify-start">

          </div>

          {/* User Profile */}
          <div className="w-full min-h-32 border-gray-300 border-[1px] flex flex-col justify-center p-8 dark:text-darktext">
            <div className="flex gap-4 w-full">
              <img src="/images/default-avatar.jpg" alt="User Avatar" className="h-16 w-16 rounded-full" />
              <section className="flex flex-col w-full">
                <div className="flex justify-between w-full">
                  <section className="flex flex-col">
                    <p className="">{targetUser?.username}</p>
                    <p className="text-gray-500 text-xs">{formatTimestampToDifference(targetUser?.createdat || '')}</p>
                  </section>
                  <section className="action-btns flex items-center justify-center gap-8 text-primary">
                    <button className="flex gap-2">
                      {!isSelf && <span className='flex gap-2'><IconMessages /> Message</span>}
                    </button>
                    <button onClick={() => followUser()}>
                      {!followingTarget && !isSelf && <span className='flex gap-2'> <IconUserPlus /> Follow</span>}
                      {followingTarget && !isSelf && <span className='flex gap-2'> <IconFriendsOff /> Unfollow</span>}   
                    </button>
                  </section>
                </div>
                <section className="flex gap-2">
                  <p className="text-xs">{targetUser?.followers} Followers</p>
                  <p className="text-xs">{targetUser?.following} Following</p>
                </section>
                <p className={`${targetUser?.bio ? 'text-sm' : 'text-xs text-gray-500'}`}>
                  {targetUser?.bio || "This user has not set a bio yet"}
                </p>
              </section>
              
            </div>
          </div>

          {/* User Posts */}
          <div className="flex flex-col gap-4 mt-4">
            <p className="text-primary text-2xl">User's Posts</p>
            {targetPosts?.map((post) => (
              <Post key={post.postid} post={post} />
            ))}
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