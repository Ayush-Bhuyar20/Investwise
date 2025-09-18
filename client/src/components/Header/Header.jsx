// src/components/Header/Header.jsx

// --- React and Library Imports ---
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // For navigating to different pages (like /login)
import { Link as ScrollLink } from 'react-scroll';     // For smooth scrolling on the same page
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

// --- Asset and Style Imports ---
import './Header.css';
import logoImage from '../../assets/logo.png';

// The component receives the 'user' object as a prop from App.jsx
function Header({ user }) {
  // State to track if the page has been scrolled
  const [isScrolled, setIsScrolled] = useState(false);
  // State to manage the mobile menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effect to add a scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle user sign-out
  const handleSignOut = () => {
    signOut(auth);
    setIsMenuOpen(false); // Close menu on sign out
  };

  // Function to close the mobile menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <div className="logo">
          <a href="#">
            <img src={logoImage} alt="InvestWise Logo" />
          </a>
        </div>
        
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {user ? (
            // --- VIEW FOR LOGGED-IN USERS ---
            <>
              <li><span className="user-name">Hi, {user.displayName.split(' ')[0]}</span></li>
              <li><button onClick={handleSignOut} className="header-cta">Sign Out</button></li>
            </>
          ) : (
            // --- VIEW FOR LOGGED-OUT USERS (GUESTS) ---
            <>
              <li><ScrollLink to="hero" smooth={true} duration={500} onClick={closeMenu}>Home</ScrollLink></li>
              <li><ScrollLink to="features" smooth={true} duration={500} offset={-50} onClick={closeMenu}>Features</ScrollLink></li>
              <li><ScrollLink to="assessment" smooth={true} duration={500} offset={-50} onClick={closeMenu}>Assessment</ScrollLink></li>
              <li><RouterLink to="/login" className="header-cta" onClick={closeMenu}>Sign In</RouterLink></li>
            </>
          )}
        </ul>

        <button 
          className="hamburger" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </nav>
    </header>
  );
}

export default Header;