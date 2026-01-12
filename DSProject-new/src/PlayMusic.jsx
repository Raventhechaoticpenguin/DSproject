import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './styling/PlayMusic.css';
import IImage from './assets/Buttons-house.png';
import TButton from './Buttons/thingButtons.jsx';
import BackImage from './assets/Grass-Buttons-arrow3.png';

// Importe os seus vídeos
import monsterVideo from './assets/videos/monsterVid.mp4';

const musicDatabase = {
    'monster': {
        title: 'Monster',
        video: monsterVideo
    }  
};

function PlayMusic() {
    const { musicId } = useParams();
    const music = musicDatabase[musicId];

    if (!music) {
        return (
        <>
         <nav className="play-nav-bar">

                <Link to="/Play">
                    <TButton imgSrc={BackImage} Text="Back to Play Button"></TButton>
                </Link>
                <Link to="/">
                    <TButton imgSrc={IImage} Text="Home Button"></TButton>
                </Link>
            </nav>
        <div>Música não encontrada!</div>
        </>
        );
    }

    return (
        <>
            <nav className="play-nav-bar">

                <Link to="/Play">
                    <TButton imgSrc={BackImage} Text="Back to Play Button"></TButton>
                </Link>
                <Link to="/">
                    <TButton imgSrc={IImage} Text="Home Button"></TButton>
                </Link>
            </nav>
            <div className="play-music-container">
                <h1>Playing: {music.title}</h1>
                <video controls autoPlay className="video-player">
                    <source src={music.video} type="video/mp4" />
                    O seu navegador não suporta a tag de vídeo.
                </video>
            </div>
        </>
    );
}

export default PlayMusic;