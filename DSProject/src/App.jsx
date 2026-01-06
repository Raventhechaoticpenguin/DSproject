import { useState } from 'react'
import home from './assets/Buttons-house.png'
import buttonPlay from './assets/base.png'
import IconButton from './iconButton'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Cartoon Music Player</h1>
      <h2>Select what do you want to do: </h2>
      <nav className='btnCol'>
        <IconButton imgSrc={buttonPlay} Text="Play Button" onClick={() => {}}>
          Play
        </IconButton>
        <IconButton imgSrc={buttonPlay} Text="Play Button" onClick={() => {}}>
          Mix
        </IconButton>
          
        
      </nav>
      <div className="bg">
        
      </div>
      
      
    </>
  )
}

export default App
