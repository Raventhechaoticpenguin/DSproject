import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import monsterAllAudio from './assets/audios/MonsterWEverything.wav';
import everythingStaysAllAudio from './assets/audios/tudoES.wav';
import gwAllAudio from './assets/audios/GWAll.wav';

const audioDatabase = {
    'monster': monsterAllAudio,
    'everything-stays': everythingStaysAllAudio,
    'giant-woman': gwAllAudio,
};

// Estrutura de transições: songId -> tempo para transição -> array de opções
const transitions = {
    'monster': {
        15: [ // Aos 15s de 'monster'
            { to: 'everything-stays', startTime: 20, label: 'Everything Stays' },
        ]
    },
    'everything-stays': {
        30: [ // Aos 30s de 'everything-stays'
            { to: 'giant-woman', startTime: 10, label: 'Giant Woman' },
        ]
    },
    'giant-woman': {
        25: [ // Aos 25s de 'giant-woman'
            { to: 'monster', startTime: 5, label: 'Monster' },
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

    const selectSong = useCallback((songId) => {
        if (audioDatabase[songId]) {
            setCurrentSong(songId);
            const audio = audioRef.current;
            audio.src = audioDatabase[songId];
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // A reprodução começou com sucesso, agora podemos definir o tempo.
                    // Isto pode causar um pequeno salto, mas é mais fiável.
                    audio.currentTime = 0;
                }).catch(error => {
                    console.error("Erro ao tentar tocar o áudio:", error);
                    // Se a reprodução automática falhar, esperamos pelo evento canplay.
                    audio.oncanplay = () => {
                        audio.currentTime = 0;
                        audio.oncanplay = null; // Limpa o handler
                    };
                });
            }
        }
    }, []);

    const executeTransition = useCallback((to, startTime) => {
        if (audioDatabase[to]) {
            setCurrentSong(to);
            const audio = audioRef.current;
            audio.src = audioDatabase[to];
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audio.currentTime = startTime;
                }).catch(error => {
                    console.error("Erro ao tentar tocar o áudio na transição:", error);
                    audio.oncanplay = () => {
                        audio.currentTime = startTime;
                        audio.oncanplay = null; // Limpa o handler
                    };
                });
            }

            setShowTransitions(false);
            setAvailableTransitions([]);
        }
    }, []);
    
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
