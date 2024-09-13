import React, { useState } from 'react';
import { Eye, EyeSlash, EnvelopeSimple, Lock, ArrowRight } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.tsx'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = (): void => setIsPasswordVisible(!isPasswordVisible);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate email
    const emailIsValid = emailRegex.test(email);
    setIsEmailValid(emailIsValid);

    if (emailIsValid && password) {
      // Simulate sign-in process
      setTimeout(() => {
        setIsSubmitting(false);
        // Redirect to dashboard or homepage after successful sign-in
        navigate('/');
      }, 2000);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-dark to-primary p-4 pt-20">
      {/* Logo */}
      <Logo size={64} />

      {/* Explanation text and link to Sign Up */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif text-white">Sign In to Your Account</h1>
        <p className="text-lg text-white mt-2 font-sans">
          Access your art collections and explore more. Don't have an account yet?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-accent hover:underline cursor-pointer"
          >
            Sign up here
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
        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Sign in form">
          {/* Email Field */}
          <div className="flex flex-col space-y-1">
            <div className="relative flex items-center">
              <EnvelopeSimple size={24} className="absolute left-3 text-dark" />
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

          {/* Password Field */}
          <div className="flex flex-col space-y-1">
            <div className="relative flex items-center">
              <Lock size={24} className="absolute left-3 text-dark" />
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
                {isPasswordVisible ? <EyeSlash size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="Submit sign-in form"
              className={`w-full py-4 bg-accent text-white rounded-lg font-serif flex items-center justify-center transition-transform transform ${
                isSubmitting ? 'scale-95' : 'hover:scale-105'
              } focus:outline-none`}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={24} className="ml-2" />
            </button>
          </div>
        </form>

        {/* Motivational Text */}
        <p className="text-center text-dark mt-6 text-lg font-sans">
          Unlock the world of art and creativity. Discover more every day!
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
