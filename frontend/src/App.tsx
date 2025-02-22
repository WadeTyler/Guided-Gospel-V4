
// App.tsx

// Packages

import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Feedback from './pages/Feedback';
import Bible from './pages/Bible';
import Rates from './pages/Rates';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserPage from './pages/admin/AdminUserPage';

// Components
import { Navbar } from './components/floating-dock';
import Loading from './components/Loading';
import { useEffect } from 'react';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminBugReports from './pages/admin/AdminBugReports';


export default function App() {

  const queryClient = useQueryClient();

  const { data:authUser, isLoading } = useQuery<User | null>({ 
    queryKey: ['authUser'],
    queryFn: async () => {
      console.log("Fetching User");
      try {
        const response = await fetch('/api/user');
        const data = await response.json();

        if (data.error) {
          return null;
        }

        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data);
        return data;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          throw new Error(String(error));
        }
      }
    },
    retry: false
  });

  const { data:authAdmin, isLoading:loadingAdmin } = useQuery({ 
    queryKey: ['authAdmin'],
    queryFn: async () => {
      console.log("Fetching user Priveleges");
      try {
        const response = await fetch('/api/admin');
        const data = await response.json();

        if (data.error) {
          return null;
        }

        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data);
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
    queryClient.invalidateQueries({ queryKey: ['authAdmin'] });
  }, [authUser]);

  if (isLoading || loadingAdmin) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <Loading size='lg' cn="w-48 h-48 text-primary" />
      </div>
      
    )
  }

  return (
    <div className="">
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={ authUser ? <Navigate to="/chat" /> : <Login />} />
          <Route path="/signup" element={ authUser ? <Navigate to="/chat" /> : <Signup />} />
          <Route path="/logout" element={ authUser ? <Logout /> : <Navigate to="/" /> } />
          <Route path="/forgotpassword" element={ <ForgotPassword /> } />
          <Route path="/chat" element={ authUser ? <Chat /> : <Navigate to="/login" /> } />
          <Route path="/settings" element={ authUser ? <Settings /> : <Navigate to="/login" /> } />
          <Route path="/feedback" element={ <Feedback /> } />
          <Route path="/bugreport" element={ authUser ? <Feedback type="bugreport" /> : <Navigate to="/login" /> } />
          <Route path="/bible" element={ <Bible /> } />
          <Route path="/rates" element={ <Rates /> } />


          {/* Admin Routes */}
          <Route path="/admin" element={ authAdmin ? <AdminDashboard /> : <Navigate to="/login" /> } />
          <Route path="/admin/users" element={ authAdmin ? <AdminUsers /> : <Navigate to="/login" /> } />
          <Route path="/admin/users/:userid" element={ authAdmin ? <AdminUserPage /> : <Navigate to="/login" /> } />
          <Route path="/admin/feedback" element={ authAdmin ? <AdminFeedback /> : <Navigate to="/login" /> } />
          <Route path="/admin/bugreports" element={ authAdmin ? <AdminBugReports /> : <Navigate to="/login" /> } />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Navbar />
    </div>
  )
}