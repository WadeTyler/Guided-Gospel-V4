
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Header from "../components/together/Header"
import toast from "react-hot-toast"
import Loading from "../components/Loading";
import Post from "../components/together/Post";
import { useEffect } from "react";

const GuidedTogether = () => {

  const queryClient = useQueryClient();

  const { data:posts, isLoading:isLoadingPosts, isError } = useQuery<Post>({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/together/posts', {
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

  const { data:likedPosts } = useQuery<Like[]>({
    queryKey: ['likedPosts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/together/posts/likes', {
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

  useEffect(() => {
    // Refresh liked posts when the posts are changed
    queryClient.invalidateQueries({ queryKey: ['likedPosts'] });
  }, [posts])

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-darkbg relative">
      <Header />

      {/* Body Section 
        Body Section will contain a list of posts from users in the middle.
        A recommended users list on the right side.
      */}

      <div className="flex justify-center items-center relative w-full h-full pt-20">
        <div className="w-[10rem]"></div>


        {/* Posts section */}
        <div className="w-[40rem] flex flex-col gap-4 h-full items-center">
          <header className="flex justify-center items-center gap-16 fixed w-full bg-white dark:bg-darkbg z-10 p-4">
            <button className="text-primary font-bold">For You</button>
            <button className="text-primary font-bold">Following</button>
          </header>

          {/* Posts */}
          <div className="flex flex-col w-full pt-14">
            {isLoadingPosts && <Loading size="md" />}
            {isError && <p>Something went wrong</p>}
            {posts && posts.map((post) => (
              <Post key={post.postid} post={post} />
            ))}
          </div>
        </div>



        <div className="w-[10rem]"></div>
      </div>

    </div>
  )
}

export default GuidedTogether