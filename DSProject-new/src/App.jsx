import { Routes, Route, Link } from 'react-router-dom';
import home from './assets/Buttons-house.png'
import buttonPlay from './assets/base.png'
import IconButton from './iconButton'
import './App.css'
import Play from './Play.jsx';
import Mix from './Mix.jsx';

function Home() {
  return (
    <>
      <h1>Cartoon Music Player</h1>
      <h2>Select what do you want to do: </h2>
      <nav className='btnCol'>
        <Link to="/play">
          <IconButton imgSrc={buttonPlay} Text="Play Button">
            Play
          </IconButton>
        </Link>
        <Link to="/mix">
          <IconButton imgSrc={buttonPlay} Text="Mix Button">
            Mix
          </IconButton>
        </Link>
      </nav>
      <div className="bg"></div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play" element={<Play />} />
      <Route path="/mix" element={<Mix />} />
    </Routes>
  );
}

export default App
