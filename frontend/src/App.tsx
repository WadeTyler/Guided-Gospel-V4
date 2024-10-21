
// App.tsx

// Packages
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import { Navbar } from './components/floating-dock';


export default function App() {

  const { data:authUser } = useQuery({ 
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
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
    }
  });

  useEffect(() => {
    console.log(authUser);
  }, [authUser])


  return (
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={ authUser ? <Navigate to="/chat" /> : <Login />} />
          <Route path="/signup" element={ authUser ? <Navigate to="/chat" /> : <Signup />} />
          <Route path="/chat" element={ authUser ? <Chat /> : <Navigate to="/login" /> } />
          <Route path="/settings" element={ authUser ? <Settings /> : <Navigate to="/login" /> } />
        </Routes>
        <Navbar />    
      </Router>
  )
}