import AdminSidebar from "../../components/admin/AdminSidebar";
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';


import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const AdminUsers = () => {

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);

  const { data:allUsers, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log("Fetching Users");
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();

        if (data.error) {
          return null;
        }

        if (!response.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error(String(error));
        }
      }
    },
    retry: false
  });

  useEffect(() => {
    if (allUsers) {
      setUsers(allUsers);
    }
  }, [allUsers]);

  const getSearchResults = async (value: string) => {
    try {
      const response = await fetch(`/api/admin/users/search/${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }   
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;

    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    }
  }

  const [searchValue, setSearchValue] = useState<string>(''); 
  const submitSearch = async () => {

    if (searchValue === '') {
      return;
    }
    setUsers(await getSearchResults(searchValue));
  }

  useEffect(() => {
    if (searchValue === '' && allUsers) {
      setUsers(allUsers);
    }
  }, [searchValue])


  return (
    <div className="w-full min-h-screen flex bg-white dark:bg-darkbg dark:text-dark">
      <AdminSidebar />
      

      <div className="w-full h-full flex flex-col p-4 gap-4">

        <header className="admin-panel-header">
          <h1 className="text-primary text-5xl">Users</h1>
          <div className="admin-panel-header-nav">
            <form action="" className="flex form-input-bar" onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}>
              <input type="text" placeholder="Search by First Name, Last Name, or Email..." className="border-none w-full focus:ring-0 rounded-2xl bg-transparent" onChange={(e) => {setSearchValue(e.target.value)}} />
              <button className="pr-2"><IconSearch /></button>
            </form>
          </div>
        </header>
        
        <div className="overflow-x-auto overflow-y-scroll">
          <div className="bg-neutral-800 dark:bg-darkaccent rounded-lg shadow-lg">
            <div className="grid grid-cols-8 text-white bg-zinc-600 py-3 px-4 rounded-t-lg">
              <div className="text-left text-lg font-semibold">First Name</div>
              <div className="text-left text-lg font-semibold">Last Name</div>
              <div className="text-left text-lg font-semibold">Email</div>
              <div className="text-left text-lg font-semibold">Age</div>
              <div className="text-left text-lg font-semibold">Denomination</div>
              <div className="text-left text-lg font-semibold">Rates</div>
              <div className="text-left text-lg font-semibold">Created At</div>
            </div>

            <div className="divide-y divide-gray-700">
              {users.map((user) => (
                <div key={user.userid} className="grid grid-cols-8 text-gray-200 py-2 px-4 hover:bg-zinc-500 transition-all duration-200 cursor-pointer" onClick={() => {
                  navigate(`/admin/users/${user.userid}`);
                }}>
                  <div className="truncate">{user.firstname}</div>
                  <div className="truncate">{user.lastname}</div>
                  <div className="truncate">{user.email}</div>
                  <div className="truncate">{user.age ?? 'N/A'}</div>
                  <div className="truncate">{user.denomination ?? 'N/A'}</div>
                  <div className="truncate">{user.rates}</div>
                  <div className="truncate">{new Date(user.createdat).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminUsers