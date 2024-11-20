
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar"
import toast from "react-hot-toast";

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
  violationsThisWeek: [
    {
      violationid: number;
      timestamp: string;
      violation_type: string;
    }
  ],
  numberPosts: number;
  numberMessages: number;
  guidedMessages: [
    {
      messageid: number;
      timestamp: string;
    }
  ]
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

      <div className="ml-[15rem]">

      </div>
    </div>
  )
}

export default AdminDashboard