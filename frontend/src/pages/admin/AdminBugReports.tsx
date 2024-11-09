// Feedback page for admins to view and review feedbacks

import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar"
import toast from "react-hot-toast";
import { IconSearch, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { formatTimestamp } from "../../lib/utils";

type BugReport = {
  reportid: number;
  userid: string;
  category: string;
  impact: number;
  issue: string;
  timestamp: string;
}

const AdminBugReports = () => {
  
  // bugReport useState
  const [bugReports, setBugReports] = useState<BugReport[]>([]);

  const [search, setSearch] = useState<string>('');

  // Sorting
  const sortByImpact = () => {
    const sorted = [...bugReports].sort((a, b) => b.impact - a.impact);
    setBugReports(sorted);
  }

  const sortByTimestamp = () => {
    const sorted = [...bugReports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setBugReports(sorted);
  }

  // retrieve bugReports from the database
  const getBugReports = async () => {
    try {
      const response = await fetch('/api/feedback/bugreports', {
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
      setBugReports(data);

    } catch (error) {
      toast.error((error as Error).message || "Failed to retrieve feedbacks");
      
    }
  }

  // search for bugreports
  const submitSearch = async () => {

  }

  // useEffect to get bugReports
  useEffect(() => {
    getBugReports();
  }, []);
  



  return (
    <div className="w-full min-h-screen flex">
      <AdminSidebar />

      {/* Body */}
      <div className="w-full min-h-screen flex flex-col p-4 gap-4 bg-white dark:bg-darkbg dark:text-darktext">
        {/* Header */}
        <header className="admin-panel-header">
            <h1 className="text-primary text-5xl">Bug Reports</h1>
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
            <div className="grid grid-cols-6 gap-2">
              <div className="text-primary font-bold flex gap-2">Timestamp <IconSortDescending className="hover:scale-110 dark:hover:text-white hover:text-darkaccent cursor-pointer" onClick={sortByTimestamp}/></div>
              <div className="text-primary font-bold">Report ID</div>
              <div className="text-primary font-bold">User ID</div>
              <div className="text-primary font-bold">Category</div>
              <div className="text-primary font-bold flex gap-2">Impact <IconSortDescending className="hover:scale-110 dark:hover:text-white hover:text-darkaccent cursor-pointer" onClick={sortByImpact}/></div>
              <div className="text-primary font-bold">Issue</div>
            </div>
          </div>

          {/* BugReports */}
          <div className="mt-10 w-full max-h-[28rem] flex flex-col gap-2 h-full overflow-y-scroll">
            {bugReports.map((bugreport) => {
              return (
                <div key={bugreport.reportid} className="grid grid-cols-6 gap-2 border-primary border-[1px] p-2 rounded-xl">
                  <div>{formatTimestamp(bugreport.timestamp)}</div>
                  <div>{bugreport.reportid}</div>
                  <div>{bugreport.userid}</div>
                  <div>{bugreport.category}</div>
                  <div>{bugreport.impact}</div>
                  <div>{bugreport.issue}</div>
                </div>
              )
            })}
          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminBugReports