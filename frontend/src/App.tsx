
// App.tsx

// Packages

import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

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
import UpdatePassword from './pages/UpdatePassword';

// Components
import { Navbar } from './components/floating-dock';
import Loading from './components/Loading';


export default function App() {

  const { data:authUser, isLoading } = useQuery({ 
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
          throw new Error(error.message);
        } else {
          throw new Error(String(error));
        }
      }
    },
    retry: false
  });

  if (isLoading) {
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
          <Route path="/chat" element={ authUser ? <Chat /> : <Navigate to="/login" /> } />
          <Route path="/settings" element={ authUser ? <Settings /> : <Navigate to="/login" /> } />
          <Route path="/feedback" element={ <Feedback /> } />
          <Route path="/bugreport" element={ authUser ? <Feedback type="bugreport" /> : <Navigate to="/login" /> } />
          <Route path="/bible" element={ <Bible /> } />
          <Route path="/rates" element={ <Rates /> } />

          <Route path="/forgotpassword" element={ <ForgotPassword /> } />
          <Route path="/updatepassword/:recoveryToken" element={ <UpdatePassword /> } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Navbar />
    </div>
  )
}