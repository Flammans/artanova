import React, { useState } from 'react'
import { Eye, EyeSlash, EnvelopeSimple, Lock, UserCircle, ArrowRight } from 'phosphor-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.tsx'
import { api } from '../utils/api.ts'
import { useAppDispatch } from '../stores/hooks.ts'
import { setUser } from '../stores/userSlice.ts'

// Regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SignUp: React.FC = () => {
  // State management for form fields and validation
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true)
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true) // New state for username validation
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const navigate = useNavigate()

  // Toggle password visibility
  const togglePasswordVisibility = (): void => setIsPasswordVisible(!isPasswordVisible)

  const dispatch = useAppDispatch()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate email
    const emailIsValid = emailRegex.test(email)
    setIsEmailValid(emailIsValid)

    // Validate username length (minimum 3 characters)
    const usernameIsValid = username.length >= 3
    setIsUsernameValid(usernameIsValid)

    // Validate password match
    const passwordsMatch = password === confirmPassword
    setIsPasswordMatch(passwordsMatch)

    // Submit form if all validations pass
    if (emailIsValid && usernameIsValid && passwordsMatch) {
      await api.post('/auth/join', {
        name: username,
        email,
        password,
      }).then(response => {
        const { id, token, name, email } = response.data

        // Dispatch action to store user data in Redux and localStorage
        dispatch(setUser({ id, name, email, token }))
        navigate('/')
      }).catch(error => {
        alert(error.response?.data?.message || error.message)
      })

      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dark to-primary p-4 pt-20">
      {/* Logo */}
      <Logo size={64}/>

      {/* Explanation text and link to Sign In */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-white">Create Your Account</h1>
        <p className="text-lg text-white mt-2 font-sans">
          Join us to explore and create your own art collections. Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-accent hover:underline cursor-pointer"
          >
            Sign in here
          </span>.
        </p>
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-secondary rounded-lg shadow-lg p-8"
      >
        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Sign up form">
          {/* Email Field */}
          <div className="flex flex-col space-y-1">
            <div className="relative flex items-center">
              <EnvelopeSimple size={24} className="absolute left-3 text-dark"/>
              <input
                id="email"
                type="email"
                placeholder="Email"
                aria-label="Email"
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 ${
                  isEmailValid ? 'border-gray-300 focus:ring-accent' : 'border-red-500 focus:ring-red-500'
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setIsEmailValid(emailRegex.test(email))}
              />
            </div>
            {!isEmailValid && <p className="text-red-500 text-sm pl-12">Invalid email format</p>}
          </div>

          {/* Username Field */}
          <div className="flex flex-col space-y-1">
            <div className="relative flex items-center">
              <UserCircle size={24} className="absolute left-3 text-dark"/>
              <input
                id="username"
                type="text"
                placeholder="Username"
                aria-label="Username"
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 ${
                  isUsernameValid ? 'border-gray-300 focus:ring-accent' : 'border-red-500 focus:ring-red-500'
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setIsUsernameValid(username.length >= 3)}
              />
            </div>
            {!isUsernameValid && <p className="text-red-500 text-sm pl-12">Username must be at least 3 characters</p>}
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-1">
            <div className="relative flex items-center">
              <Lock size={24} className="absolute left-3 text-dark"/>
              <input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Password"
                aria-label="Password"
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 focus:ring-accent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-dark focus:outline-none"
              >
                {isPasswordVisible ? <EyeSlash size={24}/> : <Eye size={24}/>}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col space-y-1">
            <div className="relative flex items-center">
              <Lock size={24} className="absolute left-3 text-dark"/>
              <input
                id="confirmPassword"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm Password"
                aria-label="Confirm Password"
                className={`w-full pl-12 pr-4 py-4 text-lg border rounded-lg font-sans bg-white text-dark focus:outline-none focus:ring-2 ${
                  isPasswordMatch ? 'border-gray-300 focus:ring-accent' : 'border-red-500 focus:ring-red-500'
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setIsPasswordMatch(password === confirmPassword)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                className="absolute right-3 text-dark focus:outline-none"
              >
                {isPasswordVisible ? <EyeSlash size={24}/> : <Eye size={24}/>}
              </button>
            </div>
            {!isPasswordMatch && <p className="text-red-500 text-sm pl-12">Passwords do not match</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="Submit registration form"
              className={`w-full py-4 bg-accent text-white rounded-lg font-serif flex items-center justify-center transition-transform transform ${
                isSubmitting ? 'scale-95' : 'hover:scale-105'
              } focus:outline-none`}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
              <ArrowRight size={24} className="ml-2"/>
            </button>
          </div>
        </form>

        {/* Motivational Text */}
        <p className="text-center text-dark mt-6 text-lg font-sans">
          Your journey to creativity starts here. Explore the world of art!
        </p>
      </motion.div>
    </div>
  )
}

export default SignUp
