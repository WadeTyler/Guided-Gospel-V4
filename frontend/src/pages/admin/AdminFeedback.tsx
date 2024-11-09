// Feedback page for admins to view and review feedbacks

import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar"
import toast from "react-hot-toast";
import { IconSearch } from "@tabler/icons-react";
import { formatTimestamp } from "../../lib/utils";

type Feedback = {
  feedbackid: string;
  text: string;
  userid: string;
  timestamp: string;
}

const AdminFeedback = () => {
  
  // Feedback useState
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  const [search, setSearch] = useState<string>('');

  // retrieve feedbacks from the database
  const getFeedback = async () => {
    try {
      const response = await fetch('/api/feedback/all', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      console.log(data);
      setFeedback(data);

    } catch (error) {
      toast.error((error as Error).message || "Failed to retrieve feedbacks");
      
    }
  }

  // search for feedbacks
  const submitSearch = async () => {

  }

  // useEffect to get feedbacks
  useEffect(() => {
    getFeedback();
  }, []);
  



  return (
    <div className="w-full min-h-screen flex">
      <AdminSidebar />

      {/* Body */}
      <div className="w-full min-h-screen flex flex-col p-4 gap-4 bg-white dark:bg-darkbg dark:text-darktext">
        {/* Header */}
        <header className="admin-panel-header">
            <h1 className="text-primary text-5xl">Feedback</h1>
            <div className="admin-panel-header-nav">
              <form action="" className="flex form-input-bar" onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}>
                <input type="text" placeholder="This doesn't work right now... WIP" className="border-none w-full focus:ring-0 rounded-2xl bg-transparent" onChange={(e) => {setSearch(e.target.value)}} />
                <button className="pr-2"><IconSearch /></button>
              </form>
            </div>
          </header>

        {/* Feedbacks */}
        <div className="w-full h-full overflow-scroll flex flex-col relative">

          {/* Header */}
          <div className="">
            <div className="grid grid-cols-4 gap-2">
              <div className="text-primary font-bold ">Timestamp</div>
              <div className="text-primary font-bold">Feedback ID</div>
              <div className="text-primary font-bold">User ID</div>
              <div className="text-primary font-bold">Feedback</div>
            </div>
          </div>

          {/* Feedback */}
          <div className="mt-10 w-full max-h-[28rem] flex flex-col gap-2 h-full overflow-y-scroll">
            {feedback.map((feedback) => {
              return (
                <div key={feedback.feedbackid} className="grid grid-cols-4 gap-2 border-primary border-[1px] p-2 rounded-xl">
                  <div>{formatTimestamp(feedback.timestamp)}</div>
                  <div>{feedback.feedbackid}</div>
                  <div>{feedback.userid || "N/A"}</div>
                  <div>{feedback.text}</div>
                </div>
              )
            })}
          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminFeedback