import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header.tsx'
import Slider from './components/slider.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Slider/>
    </>
  )
}

export default App
