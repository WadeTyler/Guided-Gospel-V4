
import { Link } from 'react-router-dom';

import '../../styles/admin-styles.css';

import { IconLayoutDashboardFilled, IconBatteryAutomotiveFilled, IconUsersGroup, IconBugFilled, IconFlag } from '@tabler/icons-react';

const AdminSidebar = () => {
  return (
    <div className='max-w-[15rem] w-[15rem] h-screen bg-neutral-800 flex flex-col gap-8 px-2 py-2'>

      <h4 className="text-primary text-2xl font-bold">Guided Gospel</h4>

      <Link to="/admin" className="admin-sidebar-item">
        <IconLayoutDashboardFilled />
        Dashboard
      </Link>

      <section className="flex flex-col gap-4">
        <Link to="/admin/users" className="admin-sidebar-item">
          <IconUsersGroup />
          Users
        </Link>
        <Link to="/admin/feedback" className="admin-sidebar-item">
          <IconBatteryAutomotiveFilled />
          Feedback
        </Link>
        <Link to="/admin/bugreports" className="admin-sidebar-item">
          <IconBugFilled />
          Bug Reports
        </Link>
        <Link to="/admin/postreports" className="admin-sidebar-item">
          <IconFlag />
          Post Reports
        </Link>
      </section>
    </div>
  )
}

export default AdminSidebar