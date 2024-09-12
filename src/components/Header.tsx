import React, { useState } from 'react';
import { List, X, MagnifyingGlass, User, SignOut, UserCircle, Star } from 'phosphor-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle search input visibility
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  // Toggle user menu
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  // Handle logout (you can replace this with real logout logic)
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary text-secondary p-4 flex justify-between items-center shadow-lg border-b-2 border-accent z-50">
      {/* Logo Component with adjustable size */}
      <Logo size={window.innerWidth < 768 ? 28 : 32} />

      {/* Navigation (desktop and mobile) */}
      <nav className="hidden lg:flex lg:space-x-4 ml-auto mr-0">
        <ul className="flex space-x-4">
          <li><a href="#explore" className="hover:text-accent focus:text-accent" tabIndex={0}>Explore</a></li>
          <li><a href="#about" className="hover:text-accent focus:text-accent" tabIndex={0}>About</a></li>
          <li><a href="#contact" className="hover:text-accent focus:text-accent" tabIndex={0}>Contact</a></li>
        </ul>
      </nav>

      {/* Search Button */}
      <button
        onClick={toggleSearch}
        aria-label="Open search"
        className="lg:ml-10 ml-auto focus:outline-none"
      >
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

      {/* User Menu */}
      {isAuthenticated ? (
        <div className="relative ml-4">
          <div className="hidden lg:flex items-center">
            <button
              onClick={toggleUserMenu}
              aria-label="Open user menu"
              className="flex items-center focus:outline-none"
            >
              <UserCircle size={32} className="hover:text-accent focus:text-accent" />
              <span className="ml-2">Viktor Khasenko</span>
            </button>
          </div>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-primary text-secondary shadow-lg rounded-lg border border-accent z-50"
            >
              <ul className="flex flex-col p-2">
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
              </ul>
            </motion.div>
          )}
        </div>
      ) : (
        <button className="ml-4 flex items-center focus:outline-none">
          <User size={32} className="mr-2 hover:text-accent focus:text-accent" />
          <span>Login</span>
        </button>
      )}

      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} aria-label="Toggle menu" className="ml-4 focus:outline-none lg:hidden">
        {isMenuOpen ? <X size={32} /> : <List size={32} />}
      </button>

      {/* Mobile Navigation (inside the burger menu) */}
      <nav className={`lg:hidden ${isMenuOpen ? "block" : "hidden"} absolute top-full left-0 w-full bg-primary`}>
        <ul className="flex flex-col space-y-4 p-4">
          <li><a href="#explore" className="hover:text-accent focus:text-accent" tabIndex={0}>Explore</a></li>
          <li><a href="#about" className="hover:text-accent focus:text-accent" tabIndex={0}>About</a></li>
          <li><a href="#contact" className="hover:text-accent focus:text-accent" tabIndex={0}>Contact</a></li>
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
