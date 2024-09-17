import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { clearUser } from '../stores/userSlice'
import LogoutButton from '../components/LogoutButton.tsx'

// SVG animated icon component
const UserAnimatedIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 250 250"
    className="w-64 h-64"
    fill="none"
    stroke="#d4af37"
    strokeWidth="8"
  >
    <motion.circle
      cx="125"
      cy="125"
      r="115"
      stroke="currentColor"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="125"
      cy="90"
      r="35"
      stroke="currentColor"
      fill="currentColor"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    />
    <motion.path
      d="M40 200 C 80 150, 170 150, 210 200"
      stroke="currentColor"
      fill="transparent"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.8, ease: 'easeInOut', delay: 1 }}
    />
  </svg>
)

const Profile: React.FC = () => {
  const user = useAppSelector((state) => state.user) // Get user data from Redux
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Handle user logout
  const handleLogout = () => {
    dispatch(clearUser()) // Clear user data in Redux
    navigate('/login') // Redirect to login page
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-dark to-primarytext-secondary">
      {/* Animated SVG User Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="mb-8"
      >
        <UserAnimatedIcon/>
      </motion.div>

      {/* Display the user's name */}
      <motion.h2
        className="text-3xl font-serif font-semibold"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
      >
        {user.name}
      </motion.h2>

      {/* Logout button with animation */}
      <motion.div
        className="mt-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
      >
        <LogoutButton onClick={handleLogout}/>
      </motion.div>
    </div>
  )
}

export default Profile
