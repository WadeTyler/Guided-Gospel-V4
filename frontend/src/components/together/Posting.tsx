import { IconMessageDots, IconX } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { SetStateAction, useState } from 'react'
import toast from 'react-hot-toast';
import Loading from '../Loading';

const Posting = ({setIsPosting}: {setIsPosting:React.Dispatch<SetStateAction<Boolean>>} ) => {

  const queryClient = useQueryClient();

  const { data:posts } = useQuery<Post[]>({ queryKey: ['posts'] });

  const [postContent, setPostContent] = useState<string>('');

  const { mutate:createPost, isPending:creatingPost } = useMutation({
    mutationFn: async (postContent: string) => {
      try {
        const response = await fetch(`/api/together/posts/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: postContent })
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
      toast.success("Post Created");
      setPostContent('');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts']});
      setIsPosting(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    }
  })

  return (
    <div className="fixed w-full h-screen bg-[rgba(0,0,0,.8)] z-40 top-0 left-0 flex items-center justify-center">
      
      <div className="bg-white dark:bg-darkbg w-[40rem] p-4 flex flex-col gap-4 relative max-h-[30rem] overflow-auto rounded-2xl">  
        <div className="w-full flex justify-end">
          <button className="hover:text-red-500"
          onClick={() => setIsPosting(false)}
          >
            <IconX />
          </button>
        </div>

        <div className="flex flex-col items-end gap-4">
          <p className="text-2xl text-primary self-start">Create Post</p>
          <textarea name="addcomment" id="addcomment" disabled={creatingPost} value={postContent}
          className="w-full bg-white dark:bg-darkbg form-input-bar resize-none h-32" placeholder={`What's on your mind?`} onChange={(e) => {
            e.preventDefault();
            setPostContent(e.target.value);
          }} />
          {!creatingPost && <button className="flex gap-2 items-center justify-center hover:text-primary transition-all duration-300 ease-in-out" onClick={() => createPost(postContent)}><IconMessageDots /> Create Post</button>}
          {creatingPost && <Loading size="md" cn="text-primary" />}
        </div>



      </div>
      

    </div>
  )
}

export default Posting