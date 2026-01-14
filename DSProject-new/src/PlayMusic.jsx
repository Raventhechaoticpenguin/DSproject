import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './styling/PlayMusic.css';
import IImage from './assets/Buttons-house.png';
import TButton from './Buttons/thingButtons.jsx';
import BackImage from './assets/Grass-Buttons-arrow3.png';
import Star1 from './assets/Buttons-star1.png';
import Star2 from './assets/Buttons-star2.png';
import Star3 from './assets/Buttons-star3.png';
import { useAudio } from './AudioContext';
import QButton from './assets/Buttons-question.png';

import monsterVideo from './assets/videos/monsterVid.mp4';
import everythingStaysVideo from './assets/videos/ESVid.mp4';
import gwVideo from './assets/videos/GWVid.mp4';

const musicDatabase = {
    'monster': {
        title: 'Monster',
        video: monsterVideo
    },
    'everything-stays': {
        title: 'Everything Stays',
        video: everythingStaysVideo
    },
    'giant-woman': {
        title: 'Giant Woman',
        video: gwVideo
    }
};

function PlayMusic() {
    const { musicId } = useParams();
    const music = musicDatabase[musicId];
    const videoRef = useRef(null);
    const [showHelp, setShowHelp] = useState(false);

    // Agora obtemos as funções de controlo direto do áudio
    const { selectMusic, setAudioMode, play, pause, syncTime } = useAudio();

    // Efeito para selecionar a música ao montar e pausar ao desmontar
    useEffect(() => {
        if (musicId) {
            selectMusic(musicId);
        }
        // A função de cleanup garante que o áudio para quando sai da página
        return () => {
            if (pause) {
                pause();
            }
        };
    }, [musicId, selectMusic, pause]);

    const handlePlay = () => {
        play();
    };

    const handlePause = () => {
        pause();
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            syncTime(videoRef.current.currentTime);
        }
    };

    const openHelp = () => setShowHelp(true);
    const closeHelp = () => setShowHelp(false);
    const handleOverlayClick = () => closeHelp();
    const handleModalClick = (event) => event.stopPropagation();

    if (!music) {
        return (
            <>
                <nav className="play-nav-bar">
                    <Link to="/Play"><TButton imgSrc={BackImage} Text="Back to Play Button"></TButton></Link>
                    <Link to="/"><TButton imgSrc={IImage} Text="Home Button"></TButton></Link>
                </nav>
                <div>Música não encontrada!</div>
            </>
        );
    }

    return (
        <>
            <nav className="play-nav-bar">
                <Link to="/Play"><TButton imgSrc={BackImage} Text="Back to Play Button"></TButton></Link>
                <Link to="/"><TButton imgSrc={IImage} Text="Home Button"></TButton></Link>
                <TButton imgSrc={QButton} Text="Help Button" onClick={openHelp}></TButton>
            </nav>
            {showHelp && (
                <div className="help-modal-overlay" onClick={handleOverlayClick}>
                    <div className="help-modal" onClick={handleModalClick}>
                        <h2>Help</h2>
                        <p>Use the star buttons to toggle the different audio modes.</p>
                        <p>  Star1 is for audio with everything</p>
                        <p>  Star 2 is for just the music</p>
                        <p>  Star3 is for just the foley sounds</p>
                        <p>Click anywhere outside this window to close it.</p>
                    </div>
                </div>
            )}
            <div className="play-music-container">
                <h1>Playing the music: {music.title}</h1>
                <div className="player-wrapper">
                    <div className="controls-container">
                        <TButton imgSrc={Star1} Text="All" onClick={() => setAudioMode('all')}></TButton>
                        <TButton imgSrc={Star2} Text="Music" onClick={() => setAudioMode('music')}></TButton>
                        <TButton imgSrc={Star3} Text="Foley" onClick={() => setAudioMode('foley')}></TButton>
                    </div>
                    <video 
                        ref={videoRef} 
                        muted 
                        controls 
                        className="video-player"
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onTimeUpdate={handleTimeUpdate}
                        onSeeked={handleTimeUpdate} // Garante a sincronia após o utilizador arrastar a barra
                    >
                        <source src={music.video} type="video/mp4" />
                        O seu navegador não suporta a tag de vídeo.
                    </video>
                </div>
            </div>
        </>
    );
}

export default PlayMusic;