import React, { useState } from 'react';
import { List, X, MagnifyingGlass, User, SignOut, UserCircle, Star } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default to not authenticated

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Toggle mobile menu
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

  // Toggle search input visibility
  const toggleSearch = (): void => setIsSearchOpen(!isSearchOpen);

  // Toggle user menu (either Sign In/Sign Up or User Profile)
  const toggleUserMenu = (): void => setIsUserMenuOpen(!isUserMenuOpen);

  // Handle logout
  const handleLogout = (): void => {
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
  };

  // Navigate to sign up or sign in page
  const goToSignUp = (): void => {
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const goToSignIn = (): void => {
    setIsUserMenuOpen(false);
    navigate('/signin');
  };

  // Handle smooth scroll to sections using React Router
  const handleScrollToSection = (sectionId: string): void => {
    navigate('/'); // Ensure we are on the home page
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0); // Delay to allow navigation to complete
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary text-secondary p-4 flex justify-between items-center shadow-lg border-b-2 border-accent z-50">
      {/* Logo Component with adjustable size */}
      <Logo size={window.innerWidth < 768 ? 28 : 32} />

      {/* Navigation (desktop) */}
      <nav className="hidden lg:flex lg:space-x-4 ml-auto mr-0">
        <ul className="flex space-x-4">
          <li>
            <button onClick={() => handleScrollToSection('explore-section')} className="hover:text-accent focus:text-accent">
              Explore
            </button>
          </li>
          <li>
            <button onClick={() => handleScrollToSection('about-section')} className="hover:text-accent focus:text-accent">
              About
            </button>
          </li>
        </ul>
      </nav>

      {/* Search Button */}
      <button onClick={toggleSearch} aria-label="Open search" className="lg:ml-10 ml-auto focus:outline-none">
        <MagnifyingGlass size={32} className="hover:text-accent focus:text-accent" />
      </button>

      {/* Search Input (appears when button is clicked) */}
      {isSearchOpen && (
        <motion.input
          type="text"
          placeholder="Search..."
          className="absolute top-full left-0 w-full bg-primary text-secondary p-2 border-b-2 border-accent focus:outline-none z-20 min-h-24 pl-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* User Menu or Authentication Buttons */}
      <div className="relative ml-4">
        <div className="hidden lg:flex items-center">
          <button onClick={toggleUserMenu} aria-label="Open user menu" className="flex items-center focus:outline-none">
            <UserCircle size={32} className="hover:text-accent focus:text-accent" />
            {isAuthenticated && <span className="ml-2">Viktor Khasenko</span>}
          </button>
        </div>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-primary text-secondary shadow-lg rounded-lg border border-accent z-50"
          >
            <ul className="flex flex-col p-2">
              {isAuthenticated ? (
                <>
                  <li className="flex items-center p-2 hover:text-accent">
                    <User size={20} className="mr-2" />
                    <a href="/profile">Profile</a>
                  </li>
                  <li className="flex items-center p-2 hover:text-accent">
                    <Star size={20} className="mr-2" />
                    <a href="/collections">My Collections</a>
                  </li>
                  <li className="flex items-center p-2 hover:text-accent">
                    <SignOut size={20} className="mr-2" />
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center p-2 hover:text-accent">
                    <User size={20} className="mr-2" />
                    <button onClick={goToSignIn} className="focus:outline-none">Sign In</button>
                  </li>
                  <li className="flex items-center p-2 hover:text-accent">
                    <User size={20} className="mr-2" />
                    <button onClick={goToSignUp} className="focus:outline-none">Sign Up</button>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} aria-label="Toggle menu" className="ml-4 focus:outline-none lg:hidden">
        {isMenuOpen ? <X size={32} /> : <List size={32} />}
      </button>

      {/* Mobile Navigation (inside the burger menu) */}
      <nav className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-primary`}>
        <ul className="flex flex-col space-y-4 p-4">
          <li>
            <button onClick={() => handleScrollToSection('explore-section')} className="hover:text-accent focus:text-accent">
              Explore
            </button>
          </li>
          <li>
            <button onClick={() => handleScrollToSection('about-section')} className="hover:text-accent focus:text-accent">
              About
            </button>
          </li>
          <li>
            <button onClick={() => handleScrollToSection('contact-section')} className="hover:text-accent focus:text-accent">
              Contact
            </button>
          </li>

          {/* User options in mobile view */}
          {isAuthenticated && (
            <>
              <li className="flex items-center hover:text-accent">
                <User size={20} className="mr-2" />
                <a href="/profile">Profile</a>
              </li>
              <li className="flex items-center hover:text-accent">
                <Star size={20} className="mr-2" />
                <a href="/collections">My Collections</a>
              </li>
              <li className="flex items-center hover:text-accent">
                <SignOut size={20} className="mr-2" />
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
