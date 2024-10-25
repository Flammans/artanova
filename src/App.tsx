import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './screens/Home'
import NotFound from './screens/NotFound'
import SignUp from './screens/SignUp'
import SignIn from './screens/SignIn'
import Profile from './screens/Profile'
import Collections from './screens/Collections'
import CollectionDetails from './screens/CollectionDetails'
import {Route, Routes, Navigate} from 'react-router-dom'
import {useAppSelector} from './stores/hooks'
import ToastContainer from './components/ToastContainer'
import {useRef} from 'react'

// Protected Route component for authorized users
const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({element}) => {
  const isAuthenticated = useAppSelector((state) => state.user.token)
  return isAuthenticated ? element : <Navigate to="/login"/>
}

// Redirect to home if authenticated
const RedirectIfAuthenticated: React.FC<{ element: JSX.Element }> = ({element}) => {
  const isAuthenticated = useAppSelector((state) => state.user.token)
  return isAuthenticated ? <Navigate to="/"/> : element
}

function App() {
  const toastRef = useRef<{ addToast: (message: string, type: 'success' | 'error') => void } | null>(null)

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header/>

        <div className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<RedirectIfAuthenticated element={<SignIn/>}/>}/>
            <Route path="/signup" element={<RedirectIfAuthenticated element={<SignUp/>}/>}/>

            {/* Protected routes */}
            <Route path="/profile" element={<ProtectedRoute element={<Profile/>}/>}/>
            <Route path="/collections" element={<ProtectedRoute element={<Collections/>}/>}/>
            <Route path="/collections/:uuid" element={<CollectionDetails/>}/>

            {/* Catch-all for not found */}
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </div>

        <Footer/>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer ref={toastRef}/>
    </>
  )
}

export default App
