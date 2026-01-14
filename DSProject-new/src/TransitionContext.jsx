import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import monsterAllAudio from './assets/audios/MonsterJustMusic.wav';
import everythingStaysAllAudio from './assets/audios/ESMusic.wav';
import gwAllAudio from './assets/audios/GWCantada.wav';

const audioDatabase = {
    'monster': monsterAllAudio,
    'everything-stays': everythingStaysAllAudio,
    'giant-woman': gwAllAudio,
};

// Estrutura de transições: songId -> tempo para transição -> array de opções
const transitions = {
    'monster': {
        30: [ // Aos 15s de 'monster'
            { to: 'everything-stays', startTime: 22, label: 'Everything Stays 2' },
            { to: 'giant-woman', startTime: 23, label: 'Giant Woman 2' },
        ],
        45: [
            {to: 'giant-woman', startTime: 1, label: 'Giant Woman 1'},
        ],
        84: [
            {to: 'everything-stays', startTime: 1, label: 'Everything Stays 1'},
        ]
    },
    'everything-stays': {
        22: [ // Aos 30s de 'everything-stays'
            { to: 'giant-woman', startTime: 36, label: 'Giant Woman 3' },
            { to: 'monster', startTime: 70, label: 'Monster 4' },
        ],
        
    },
    'giant-woman': {
        22: [ // Aos 25s de 'giant-woman'
            { to: 'monster', startTime: 30, label: 'Monster 2' },
            { to: 'monster', startTime: 45, label: 'Monster 3' },
            { to: 'everything-stays', startTime: 1, label: 'Everything Stays 1' },
        ],
        35: [
            { to: 'monster', startTime: 14, label: 'Monster 1' },
            { to: 'monster', startTime: 84, label: 'Monster 5' },

        ]
    }
};

const TransitionContext = createContext();
 
export const useTransitions = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [currentSong, setCurrentSong] = useState(null);
    const [availableTransitions, setAvailableTransitions] = useState([]);
    const [showTransitions, setShowTransitions] = useState(false);
    const [queuedTransition, setQueuedTransition] = useState(null);

    useEffect(() => {
        const audio = audioRef.current;

        const timeUpdateHandler = () => {
            if (!currentSong || !transitions[currentSong]) return;

            const currentTime = Math.floor(audio.currentTime);
            const transitionPoints = transitions[currentSong];

            // Verifica se estamos perto de um ponto de transição
            for (const timeStr in transitionPoints) {
                const transitionTime = parseInt(timeStr, 10);
                if (currentTime >= transitionTime - 5 && currentTime < transitionTime) {
                    if (!showTransitions) {
                        setAvailableTransitions(transitionPoints[timeStr]);
                        setShowTransitions(true);
                    }
                    return; // Sai para não esconder as transições prematuramente
                }
            }

            // Se passamos do tempo de transição, esconde as opções
            if (showTransitions) {
                setShowTransitions(false);
                setAvailableTransitions([]);
            }
        };

        audio.addEventListener('timeupdate', timeUpdateHandler);
        return () => audio.removeEventListener('timeupdate', timeUpdateHandler);
    }, [currentSong, showTransitions]);

    const playSongAt = useCallback((songId, startTime = 0) => {
        if (!audioDatabase[songId]) return;

        setCurrentSong(songId);
        const audio = audioRef.current;
        audio.src = audioDatabase[songId];

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audio.currentTime = startTime;
            }).catch(error => {
                console.error('Erro ao tentar tocar o áudio:', error);
                audio.oncanplay = () => {
                    audio.currentTime = startTime;
                    audio.oncanplay = null;
                };
            });
        }
    }, []);

    const selectSong = useCallback((songId) => {
        setQueuedTransition(null);
        playSongAt(songId, 0);
        setShowTransitions(false);
        setAvailableTransitions([]);
    }, [playSongAt]);

    const executeTransition = useCallback((to, startTime) => {
        if (audioDatabase[to]) {
            setQueuedTransition({ to, startTime });
        }
    }, []);

    useEffect(() => {
        if (!showTransitions && queuedTransition) {
            playSongAt(queuedTransition.to, queuedTransition.startTime);
            setQueuedTransition(null);
        }
    }, [showTransitions, queuedTransition, playSongAt]);
    
    const play = () => audioRef.current.play();
    const pause = () => audioRef.current.pause();
    const syncTime = (time) => {
        if (Math.abs(audioRef.current.currentTime - time) > 0.2) {
            audioRef.current.currentTime = time;
        }
    };

    const value = {
        selectSong,
        executeTransition,
        play,
        pause,
        syncTime,
        currentSong,
        showTransitions,
        availableTransitions,
        audioRef, // Expondo a ref para o vídeo poder sincronizar
    };

    return (
        <TransitionContext.Provider value={value}>
            {children}
        </TransitionContext.Provider>
    );
};
