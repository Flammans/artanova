import { useState } from 'react';
import { FaSearch, FaUser, FaSignOutAlt, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa';
import AnimatedLogo from './logo.tsx'

// Define the User type
interface User {
  name: string;
}

const Header: React.FC = () => {
  // User state: null means the user is not logged in
  const [user, setUser] = useState<User | null>({ name: 'John Doe' });
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false); // User submenu state

  const toggleSearch = (): void => setSearchOpen(!searchOpen);
  const toggleMobileMenu = (): void => setMobileMenuOpen(!mobileMenuOpen);
  const toggleUserMenu = (): void => setUserMenuOpen(!userMenuOpen);

  // Simulated login/logout functions
  const handleLogin = (): void => setUser({ name: 'John Doe' });
  const handleLogout = (): void => setUser(null);

  return (
    <header
      className="fixed w-full top-0 bg-gray-50 border-b border-gray-200 z-50"
      role="banner"
      aria-label="Main site header"
    >
      <div className="flex justify-between items-center py-2 px-4 md:py-4 md:px-6">
        {/* Logo and text next to it */}
        <div className="flex items-center">
          <AnimatedLogo width={80} height={80} />
          <div className="ml-3">
            {/* Text next to the logo */}
            <p className="text-sm md:text-base font-serif text-black leading-tight max-w-[50px]">
              Exhibition <br /> Curator <br /> Project
            </p>
          </div>
        </div>

        {/* Main navigation and action buttons */}
        <div className="flex items-center space-x-6">
          {/* Main menu */}
          <nav className="hidden md:flex space-x-4" aria-label="Main navigation">
            <a href="/" className="text-lg text-gray-700 hover:text-black" aria-label="Go to home page">Home</a>
          </nav>

          {/* User block */}
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="text-2xl text-gray-700 hover:text-black"
              aria-label="Open user menu"
            >
              <FaUser />
            </button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                <a href="/user" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Profile</a>
                <a href="/user/collections" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Collections</a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Login button */}
          {!user && (
            <button
              onClick={handleLogin}
              className="text-2xl text-gray-700 hover:text-black"
              aria-label="Login"
            >
              <FaSignInAlt />
            </button>
          )}

          {/* Search button */}
          <button
            onClick={toggleSearch}
            aria-label={searchOpen ? "Close search form" : "Open search form"}
          >
            {searchOpen ? <FaTimes className="text-2xl text-gray-700" /> : <FaSearch className="text-2xl text-gray-700" />}
          </button>

          {/* Mobile menu toggle button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden"
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl text-gray-700" /> : <FaBars className="text-2xl text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Search form */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-50 border-b border-gray-200 p-4">
          <form role="search" aria-label="Search form" className="w-full">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Search exhibitions, collections..."
            />
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav
          className="absolute top-full left-0 w-full bg-gray-50 border-b border-gray-200 p-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <a href="/" className="block text-lg text-gray-700 hover:text-black py-2" aria-label="Go to home page">Home</a>

          {/* Mobile user dropdown menu */}
          {user && (
            <div className="mt-4">
              <a href="/user" className="block text-lg text-gray-700 hover:text-black py-2">My Profile</a>
              <a href="/user/collections" className="block text-lg text-gray-700 hover:text-black py-2">My Collections</a>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-lg text-gray-700 hover:text-black py-2"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
