import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTransitions } from './TransitionContext';
import './styling/PlayMusic.css';
import './styling/musicsButton.css';
import IImage from './assets/Buttons-house.png';
import TButton from './Buttons/thingButtons.jsx';
import TTButton from './Buttons/transitionButton.jsx';
import buttonPlay from './assets/base.png'
import QButton from './assets/Buttons-question.png';
import BackImage from './assets/Grass-Buttons-arrow3.png';


import monsterVideo from './assets/videos/monsterVid.mp4';
import everythingStaysVideo from './assets/videos/ESVid.mp4';
import gwVideo from './assets/videos/GWVid.mp4';

const videoDatabase = {
    'monster': monsterVideo,
    'everything-stays': everythingStaysVideo,
    'giant-woman': gwVideo,
};

function MixPlay() {
    const { musicId } = useParams();
    const {
        selectSong,
        executeTransition,
        currentSong,
        showTransitions,
        availableTransitions,
        audioRef,
        syncTime,
    } = useTransitions();
    
    const videoRef = useRef(null);
    const [showHelp, setShowHelp] = useState(false);

    const openHelp = () => setShowHelp(true);
    const closeHelp = () => setShowHelp(false);
    const handleOverlayClick = () => closeHelp();
    const handleModalClick = (event) => event.stopPropagation();

    // Limpa o áudio quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = ''; // Limpa a fonte para parar o download
            }
        };
    }, [audioRef]);

    // Inicia a música selecionada quando o componente é montado
    useEffect(() => {
        selectSong(musicId);
    }, [musicId, selectSong]);

    // Sincroniza o vídeo com o áudio
    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;

        if (!video || !audio) return;

        const syncVideoToAudio = () => {
            if (Math.abs(video.currentTime - audio.currentTime) > 0.2) {
                video.currentTime = audio.currentTime;
            }
        };

        const syncAudioToVideo = () => {
            syncTime(video.currentTime);
        };

        // Sincroniza o vídeo com o áudio a cada segundo
        const intervalId = setInterval(syncVideoToAudio, 1000);
        
        // Adiciona listener para quando o utilizador manipula o vídeo
        video.addEventListener('seeking', syncAudioToVideo);

        return () => {
            clearInterval(intervalId);
            video.removeEventListener('seeking', syncAudioToVideo);
        };
    }, [currentSong, audioRef, syncTime]);

    // Força a recarga do vídeo quando a música muda
    useEffect(() => {
        if (videoRef.current && videoDatabase[currentSong]) {
            videoRef.current.src = videoDatabase[currentSong];
            const video = videoRef.current;
            const audio = audioRef.current;
            const handleLoadedMetadata = () => {
                if (audio) {
                    video.currentTime = audio.currentTime;
                    if (!audio.paused) {
                        video.play().catch(() => {}); // Inicia o vídeo após mudança de música
                    }
                }
            };

            video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
            video.load(); // Garante que o novo vídeo é carregado
        }
    }, [currentSong, audioRef]);

    // Garante que o vídeo e o áudio pausam/tocam em conjunto
    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;
        if (!video || !audio) return;

        const handleVideoPlay = () => audio.play();
        const handleVideoPause = () => audio.pause();

        video.addEventListener('play', handleVideoPlay);
        video.addEventListener('pause', handleVideoPause);

        return () => {
            video.removeEventListener('play', handleVideoPlay);
            video.removeEventListener('pause', handleVideoPause);
        };
    }, [currentSong, audioRef]);

    // Garante que o vídeo responde quando o áudio começa a tocar programaticamente
    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;
        if (!video || !audio) return;

        const handleAudioPlay = () => {
            if (video.paused) {
                video.play().catch(() => {});
            }
        };

        const handleAudioPause = () => {
            if (!video.paused) {
                video.pause();
            }
        };

        audio.addEventListener('play', handleAudioPlay);
        audio.addEventListener('pause', handleAudioPause);

        return () => {
            audio.removeEventListener('play', handleAudioPlay);
            audio.removeEventListener('pause', handleAudioPause);
        };
    }, [audioRef, currentSong]);


    const currentVideo = videoDatabase[currentSong] || null;

    return (
        <>
            <nav className="play-nav-bar">
                <Link to="/mix"><TButton imgSrc={BackImage} Text="Back to Play Button"></TButton></Link>
                <Link to="/">
                    <TButton imgSrc={IImage} Text="Home Button"></TButton>
                </Link>
                <TButton imgSrc={QButton} Text="Help Button" onClick={openHelp}></TButton>
            </nav>
            {showHelp && (
                <div className="help-modal-overlay" onClick={handleOverlayClick}>
                    <div className="help-modal" onClick={handleModalClick}>
                        <h2>Help</h2>
                        <p>This is a mixer between all the musics of the program.</p>
                        <p>Click on a transition to queue it and it will be applied when the options disappear.</p>
                        <p>Click anywhere outside this window to close it.</p>
                    </div>
                </div>
            )}
            <div className="play-container">
                {currentVideo && (
                    <video ref={videoRef} src={currentVideo} controls className="video-player" />
                )}
                {showTransitions && (
                    <div className="transition-options">
                        <h3>Choose Next Song:</h3>
                        <div className="transition-buttons">
                            {availableTransitions.map((transition, index) => (
                                <TTButton
                                    imgSrc={buttonPlay}
                                    key={`${transition.to}-${transition.startTime}-${index}`}
                                    Text={transition.label}
                                    onClick={() => executeTransition(transition.to, transition.startTime)}
                                >
                                    {transition.label}
                                </TTButton>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default MixPlay;
