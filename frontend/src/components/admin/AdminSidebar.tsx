
import { Link } from 'react-router-dom';

import '../../styles/admin-styles.css';

import { IconLayoutDashboardFilled } from '@tabler/icons-react';
import { IconUsersGroup } from '@tabler/icons-react';

const AdminSidebar = () => {
  return (
    <div className='w-[15rem] h-screen bg-neutral-800 flex flex-col gap-8 px-2 py-2'>

      <h4 className="text-primary text-2xl font-bold text-center">Guided Gospel</h4>

      <Link to="/admin" className="admin-sidebar-item">
        <IconLayoutDashboardFilled />
        Dashboard
      </Link>

      <section className="flex flex-col gap-4">
        <Link to="/admin/users" className="admin-sidebar-item">
          <IconUsersGroup />
          Users
        </Link>
        <Link to="#" className="admin-sidebar-item">
          <IconLayoutDashboardFilled />
          Placeholder
        </Link>
        <Link to="#" className="admin-sidebar-item">
          <IconLayoutDashboardFilled />
          Placeholder
        </Link>
      </section>
    </div>
  )
}

export default AdminSidebar