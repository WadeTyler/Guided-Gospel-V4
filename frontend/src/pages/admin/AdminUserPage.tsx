import { useParams } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { formatName, formatTimestamp } from "../../lib/utils";
import ChangeRates from "../../components/admin/ChangeRates";


const AdminUserPage = () => {
  const userid = useParams().userid;

  const [user, setUser] = useState<User | null>(null);


  const setUserData = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userid}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUser(data);
      console.log(data);

    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  }

  useEffect(() => {
    setUserData();
  }, [userid]);


  const suspendAndUnsuspendUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userid}/suspend`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      
      console.log(data);

      setUserData();
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  }

  const [changingRates, setChangingRates] = useState<Boolean>(false);

  const resetRates = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userid}/resetRates`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setUserData();
    } catch (error) {
      toast.error((error as Error).message || "Error resetting rates");
    }
  }

  return (
    <div className="w-full min-h-screen flex">
      <AdminSidebar />
      
      <div className="w-full p-4 flex flex-col bg-white dark:bg-darkbg dark:text-darktext">
        <header className="admin-panel-header">
          {user ? <h1 className="text-primary text-5xl">{formatName(user.firstname)} {formatName(user.lastname)}</h1> : <h1 className="text-primary text-5xl">User Not Found </h1>}
        </header>
        {user && 
        <div className="flex gap-8">
          {/* User Info */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl">User Information</h2>
            <div className="flex flex-col gap-1">
              <p><strong>UserID:</strong> {user.userid}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>First Name:</strong> {user.firstname}</p>
              <p><strong>Last Name:</strong> {user.lastname}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age || "N/A"}</p>
              <p><strong>Denomination:</strong> {user.denomination || "N/A"}</p>
              <p><strong>Default Rates:</strong>{user.defaultrates}</p>
              <p><strong>Daily Rates Remaining:</strong> {user.rates}</p>
              <p><strong>Joined:</strong> {formatTimestamp(user.createdat)}</p>
              <p><strong>Last Active:</strong> {user.lastactive ? formatTimestamp(user.lastactive) : formatTimestamp(user.createdat)}</p>
              <p><strong>Suspended:</strong> {user.suspended ? <span className="text-red-600">User is Suspended</span> : "No"} </p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-xl">Actions</h2>
            <button onClick={() => resetRates()} className="neutral-btn">Reset Rates</button>
            <button onClick={() => setChangingRates(true)} className="neutral-btn">Change Default Rates</button>
            <button onClick={() => suspendAndUnsuspendUser()} className={`${!user.suspended ? 'delete-btn' : 'submit-btn'}`}>{!user.suspended ? "Suspend User" : "Unsuspend User"}</button>
          </div>

        </div>
        }

      </div>

      {user && changingRates && <ChangeRates user={user} setChangingRates={setChangingRates} setUserData={setUserData}  />}

    </div>
  )
}

export default AdminUserPage