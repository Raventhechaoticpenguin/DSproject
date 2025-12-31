import { useState } from 'react'
import home from './assets/Buttons-house.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <img src={home} alt="Home"/>
      </nav>
      <div className="bg">
        
      </div>
      <h1>Cartoon Music Player</h1>
      
    </>
  )
}

export default App
