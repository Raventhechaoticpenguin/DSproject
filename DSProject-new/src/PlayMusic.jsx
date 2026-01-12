import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './styling/PlayMusic.css';
import IImage from './assets/Buttons-house.png';
import TButton from './Buttons/thingButtons.jsx';
import BackImage from './assets/Grass-Buttons-arrow3.png';
import Star1 from './assets/Buttons-star1.png';
import Star2 from './assets/Buttons-star2.png';
import Star3 from './assets/Buttons-star3.png';
import PlayPauseButton from './assets/base.png'; // Placeholder para o botão de play/pause
import { useAudio } from './AudioContext';

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
    const videoRef = useRef(null);

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
            </nav>
            <div className="play-music-container">
                <h1>Playing: {music.title}</h1>
                <div className="player-wrapper">
                    <div className="controls-container">
                        <TButton imgSrc={Star1} Text="All" onClick={() => setAudioMode('all')}></TButton>
                        <TButton imgSrc={Star2} Text="Music" onClick={() => setAudioMode('music')}></TButton>
                        <TButton imgSrc={Star3} Text="Foley" onClick={() => setAudioMode('foley')}></TButton>
                    </div>
                    <video 
                        ref={videoRef} 
                        muted 
                        controls // <-- CONTROLOS NATIVOS RESTAURADOS
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