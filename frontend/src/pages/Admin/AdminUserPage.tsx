import { useParams } from "react-router-dom"
import AdminSidebar from "../../components/admin/AdminSidebar"

const AdminUserPage = () => {
  const userid = useParams().userid;

  // TODO: Fetch User Data

  return (
    <div className="w-full min-h-screen flex">
      <AdminSidebar />
      
    </div>
  )
}

export default AdminUserPage