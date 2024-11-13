
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Sidebar from "../../components/together/Sidebar"
import toast from "react-hot-toast"
import Loading from "../../components/Loading";
import Post from "../../components/together/Post";
import { useEffect, useState } from "react";

const GuidedTogether = () => {

  const queryClient = useQueryClient();

  // AuthUser
  const { data:authUser } = useQuery<User>({ queryKey: ['authUser'] });
  const { data:followingList } = useQuery<Following[]>({ queryKey: ['followingList'] });
  const { data:likedPosts } = useQuery<Like[]>({ queryKey: ['likedPosts'] });

  // Can be either 'For You' or 'Following'
  const [type, setType] = useState<string>("for you");

  // Retreive posts from the server
  const { data:posts, isLoading:isLoadingPosts, isError } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/together/posts/all/${type}`, {
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

 
  // Invalidate queries when the authUser changes
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['likedPosts'] });
    queryClient.invalidateQueries({ queryKey: ['followingList'] });
    
  }, [authUser]);

  useEffect(() => {
    // Refresh liked posts when the posts are changed
    queryClient.invalidateQueries({ queryKey: ['likedPosts'] });
  }, [posts]);

  // Invalidate posts when the type is changed
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  }, [type]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-darkbg relative">
      <Sidebar />

      {/* Body Section 
        Body Section will contain a list of posts from users in the middle.
        A recommended users list on the right side.
      */}

      <div className="flex justify-center items-center relative w-full h-full pb-24">
        <div className="w-[10rem]"></div>


        {/* Posts section */}
        <div className="w-[40rem] flex flex-col gap-4 h-full items-center justify-start">
          <header className="flex justify-center items-center gap-16 fixed w-fit z-20">
            <button 
            onClick={() => {
              setType('for you');
              const postsContainer = document.getElementById('home-posts-container');
              postsContainer?.scrollIntoView();
            }}
            className={`text-primary p-2 flex items-center justify-center ${type === 'for you' ? 'border-b-2 border-b-primary' : ''}`}>
              <p className="">For You</p>
            </button>
            <button 
            onClick={() => {
              setType('following');
              const postsContainer = document.getElementById('home-posts-container');
              postsContainer?.scrollIntoView();
            }}
            className={`text-primary p-2 flex items-center justify-center ${type === 'following' ? 'border-b-2 border-b-primary' : ''}`}>
              <p className="">Following</p>
            </button>
          </header>

          {/* Posts */}
          <div className="flex flex-col w-full pt-14 gap-4" id="home-posts-container">
            {isLoadingPosts && <Loading size="md" />}
            {isError && <p>Something went wrong</p>}
            {posts && posts.map((post) => (
              <Post key={post.postid} post={post} />
            ))}
            {posts && posts.length === 0 && <p>No Posts to Show...</p>}
          </div>
        </div>



        <div className="w-[10rem]"></div>
      </div>

    </div>
  )
}

export default GuidedTogether