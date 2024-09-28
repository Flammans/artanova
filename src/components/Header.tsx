import React, { useState } from 'react'
import { List, X, MagnifyingGlass, User, SignOut, UserCircle, Star } from 'phosphor-react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation, Link } from 'react-router-dom' // Added useLocation
import Logo from './Logo'
import { useAppDispatch, useAppSelector } from '../stores/hooks.ts'
import { clearUser } from '../stores/userSlice.ts'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('') // Search query state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation() // Get current location

  // Toggle mobile menu
  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen)

  // Toggle search input visibility
  const toggleSearch = (): void => setIsSearchOpen(!isSearchOpen)

  // Toggle user menu (either Sign In/Sign Up or User Profile)
  const toggleUserMenu = (): void => setIsUserMenuOpen(!isUserMenuOpen)

  // Handle logout
  const handleLogout = (): void => {
    dispatch(clearUser()) // Dispatch the clearUser action to remove user data from Redux and localStorage
    navigate('/login')
    setIsUserMenuOpen(false)
  }

  // Navigate to sign up or sign in page
  const goToSignUp = (): void => {
    setIsUserMenuOpen(false)
    navigate('/signup')
  }

  const goToSignIn = (): void => {
    setIsUserMenuOpen(false)
    navigate('/login')
  }

  // Handle smooth scroll to sections using React Router
  const handleScrollToSection = (sectionId: string): void => {
    navigate('/') // Ensure we are on the home page
    setTimeout(() => {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)
  }

  // Handle search input submission
  const handleSearchSubmit = () => {
    if (location.pathname !== '/') {
      // If not on the main page, navigate to the main page first
      navigate('/')
    }
    // Scroll to explore section after navigating or if already on the main page
    setTimeout(() => {
      const exploreSection = document.getElementById('explore-section')
      if (exploreSection) {
        exploreSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)

    // Pass the search query to the Explore component (via URL query or context)
    navigate(`/explore-collections?search=${searchQuery}`)
    setIsSearchOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-primary text-secondary p-4 flex justify-between items-center shadow-lg border-b-2 border-accent z-50">
      {/* Logo Component with adjustable size */}
      <Logo size={window.innerWidth < 768 ? 28 : 32}/>

      {/* Navigation (desktop) */}
      <nav className="hidden lg:flex lg:space-x-4 ml-auto mr-0">
        <ul className="flex space-x-4">
          <li>
            <button onClick={() => handleScrollToSection('explore-section')} className="hover:text-accent focus:text-accent">
              Explore
            </button>
          </li>
        </ul>
      </nav>

      {/* Search Button */}
      <button onClick={toggleSearch} aria-label="Open search" className="lg:ml-10 ml-auto focus:outline-none">
        <MagnifyingGlass size={32} className="hover:text-accent focus:text-accent"/>
      </button>

      {/* Search Input (appears when button is clicked) */}
      {isSearchOpen && (
        <motion.div
          className="absolute top-full left-0 w-full bg-primary text-secondary p-2 border-b-2 border-accent focus:outline-none z-20 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MagnifyingGlass size={24} className="text-white ml-2"/>
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-4 text-lg border-none bg-primary text-white focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()} // Handle search on Enter
          />
        </motion.div>
      )}

      {/* User Menu or Authentication Buttons */}
      <div className="relative ml-4">
        <div className="lg:flex items-center">
          <button onClick={toggleUserMenu} aria-label="Open user menu" className="flex items-center focus:outline-none">
            <UserCircle size={32} className="hover:text-accent focus:text-accent"/>
            <div className="hidden lg:flex items-center">{user.token && <span className="ml-2">{user.name}</span>}</div>
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
              {user.token ? (
                <>
                  <li className="flex items-center p-2 hover:text-accent">
                    <User size={20} className="mr-2"/>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li className="flex items-center p-2 hover:text-accent">
                    <Star size={20} className="mr-2"/>
                    <Link to="/collections">My Collections</Link>
                  </li>
                  <li className="flex items-center p-2 hover:text-accent">
                    <SignOut size={20} className="mr-2"/>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center p-2 hover:text-accent">
                    <User size={20} className="mr-2"/>
                    <button onClick={goToSignIn} className="focus:outline-none">Sign In</button>
                  </li>
                  <li className="flex items-center p-2 hover:text-accent">
                    <User size={20} className="mr-2"/>
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
        {isMenuOpen ? <X size={32}/> : <List size={32}/>}
      </button>

      {/* Mobile Navigation (inside the burger menu) */}
      <nav className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-primary`}>
        <ul className="flex flex-col space-y-4 p-4">
          <li>
            <button onClick={() => handleScrollToSection('explore-section')} className="hover:text-accent focus:text-accent">
              Explore
            </button>
          </li>

          {/* User options in mobile view */}
          {user.token && (
            <>
              <li className="flex items-center hover:text-accent">
                <User size={20} className="mr-2"/>
                <Link to="/profile">Profile</Link>
              </li>
              <li className="flex items-center hover:text-accent">
                <Star size={20} className="mr-2"/>
                <Link to="/collections">My Collections</Link>
              </li>
              <li className="flex items-center hover:text-accent">
                <SignOut size={20} className="mr-2"/>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
