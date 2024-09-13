import './App.css'
import Header from './components/Header'
import Footer from './components/Footer';
import Home from './screens/Home';
import NotFound from './screens/NotFound';
import { Route, Routes } from 'react-router-dom'
import SignUp from './screens/SignUp.tsx'
import SignIn from './screens/SignIn.tsx'

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header/>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<SignUp/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/explore-collections" element={<Home/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </div>

        <Footer/>
      </div>
    </>
  )
}

export default App
