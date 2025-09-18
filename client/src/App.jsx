// src/App.jsx
import { useState, useEffect } from 'react';
// 1. Import useNavigate and useLocation from react-router-dom
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Header from './components/Header/Header.jsx';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import HomePage from './HomePage.jsx';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. Initialize the navigate function and get the current location
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 3. NEW: This useEffect handles redirection
  useEffect(() => {
    // If we have a user and they are on the login page, redirect them to the homepage
    if (currentUser && location.pathname === '/login') {
      navigate('/');
    }
  }, [currentUser, navigate, location]);


  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated spinner component
  }

  return (
    <div className="app">
      <Header user={currentUser} />
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;