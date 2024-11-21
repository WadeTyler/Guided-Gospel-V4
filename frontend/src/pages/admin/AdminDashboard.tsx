
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar"
import toast from "react-hot-toast";
import LineChart, { Plot } from "../../components/util/graphs/LineChart";
import PieChart, { Pie } from "../../components/util/graphs/PieChart";

type DashboardData = {
  totalUsers: [
    {
      userid: string;
      createdat: string;
    }
  ],
  usersThisWeek: [
    {
      userid: string;
      createdat: string;
    }
  ],
  flagsThisWeek: [
    {
      weight: number;
      timestamp: string;
    }
  ],
  violationsThisWeek: Pie[];
  numberPosts: number;
  numberMessages: number;
  guidedMessagesThisWeek: Plot[];
}


const AdminDashboard = () => {

  // Retreive dashboard data. (totalUsers, usersThisWeek, flagsThisWeek, violationsThisWeek, numberPosts, numberMessages, guidedMessages)
  const [dashboardData, setDashboardData] = useState<DashboardData>();

  const retreiveDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setDashboardData(data);
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  }

  // Retreive dashboard data
  useEffect(() => {
    retreiveDashboardData();
  }, [])

  useEffect(() => {
    console.log(dashboardData);
  }, [dashboardData]);

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar />

      <div className="w-full p-4 flex flex-col ml-[15rem] bg-white dark:bg-darkbg dark:text-darktext gap-8 pb-24">
        <header className="admin-panel-header">
          <h1 className="text-primary text-5xl">Admin Dashboard</h1>
        </header>
        {dashboardData &&
          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-4">
              {/* Total Number of Users */}
              <div className="w-full h-full rounded-xl p-4 border-gray-300 shadow-lg border-[1px]">
                <p className="text-primary text-2xl">Total Users</p>
                <p>{dashboardData?.totalUsers.length}</p>
              </div>

              {/* Total Number of Users */}
              <div className="w-full h-full rounded-xl p-4 border-gray-300 shadow-lg border-[1px]">
                <p className="text-primary text-2xl">Users This Week</p>
                <p>{dashboardData?.usersThisWeek.length}</p>
              </div>
            </div>

            {/* Guided Messages This Week */}
            <div className="w-full h-full rounded-xl p-4 border-gray-300 border-[1px] shadow-lg">
              <p className="text-primary text-2xl">Guided Messages This Week: {dashboardData.guidedMessagesThisWeek.length}</p>
              <div className="w-full max-h-[200px] h-[200px] p-2">
                <LineChart plots={dashboardData.guidedMessagesThisWeek} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Posts This Week */}
              <div className="w-full h-full rounded-xl p-4 border-gray-300 border-[1px] shadow-lg">
                <p className="text-primary text-2xl">Posts This Week</p>
                <p>{dashboardData?.numberPosts}</p>
              </div>

              {/* Private Messages This Week */}
              <div className="w-full h-full rounded-xl p-4 border-gray-300 border-[1px] shadow-lg">
                <p className="text-primary text-2xl">Private Messages This Week</p>
                <p>{dashboardData?.numberMessages}</p>
              </div>
            </div>

            {/* Violations This Week */}
            <div className="w-full rounded-xl p-4 border-gray-300 border-[1px] shadow-lg flex flex-col gap-4">
              <p className="text-primary text-2xl">Violations This Week: {dashboardData.violationsThisWeek.length}</p>
              <div className="w-full h-full">
                <PieChart pies={dashboardData.violationsThisWeek} circleWidth="150px" />
              </div>
            </div>

            {/* Flags This Week */}
            <div className="w-full rounded-xl p-4 border-gray-300 border-[1px] shadow-lg">
              <p className="text-primary text-2xl">Flags This Week</p>
              <p>{dashboardData?.flagsThisWeek.length}</p>
            </div>

          </div>
        }


      </div>
    </div>
  )
}

export default AdminDashboard