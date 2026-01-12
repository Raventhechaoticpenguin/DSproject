import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// --- ATENÇÃO ---
// A estrutura de ficheiros foi mapeada de acordo com o que descreveu.
// Adicionei um placeholder para a faixa de "só voz".
import monsterMusicAudio from './assets/audios/MonsterJustMusic.wav';
import monsterFoleyAudio from './assets/audios/MonsterJustSound.wav';
import monsterAllAudio from './assets/audios/MonsterWEverything.wav';
import everythingStaysMusicAudio from './assets/audios/ESMusic.wav';
import everythingStaysFoleyAudio from './assets/audios/ambienteES.wav';
import everythingStaysAllAudio from './assets/audios/tudoES.wav';

const audioDatabase = {
    'monster': {
        all: monsterAllAudio,
        music: monsterMusicAudio,
        foley: monsterFoleyAudio,
    },
    'everything-stays': {
        all: everythingStaysAllAudio,
        music: everythingStaysMusicAudio,
        foley: everythingStaysFoleyAudio,
    }
};

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [currentMusicId, setCurrentMusicId] = useState(null);
    const audioRef = useRef(new Audio());
    const currentTrackSources = useRef(null);

    // Carrega as fontes de áudio para a música selecionada
    useEffect(() => {
        if (currentMusicId && audioDatabase[currentMusicId]) {
            currentTrackSources.current = audioDatabase[currentMusicId];
            // Carrega a faixa 'all' por defeito, mas não toca
            audioRef.current.src = currentTrackSources.current.all;
        } else {
            currentTrackSources.current = null;
            audioRef.current.src = '';
        }
    }, [currentMusicId]);

    const selectMusic = (musicId) => {
        if (musicId !== currentMusicId) {
            setCurrentMusicId(musicId);
        }
    };

    const setAudioMode = (mode) => {
        if (!currentTrackSources.current || !currentTrackSources.current[mode]) {
            console.warn(`Modo de áudio "${mode}" não encontrado.`);
            return;
        }

        const wasPlaying = !audioRef.current.paused;
        const currentTime = audioRef.current.currentTime;

        audioRef.current.src = currentTrackSources.current[mode];
        
        // Garante que a sincronização de tempo acontece depois de o novo áudio ser carregado
        audioRef.current.addEventListener('loadedmetadata', () => {
            audioRef.current.currentTime = currentTime;
            if (wasPlaying) {
                audioRef.current.play().catch(e => console.error("Erro ao tocar áudio após mudança de modo:", e));
            }
        }, { once: true }); // O listener é removido após ser executado uma vez
    };

    const play = () => audioRef.current.play().catch(e => console.error("Erro ao tocar áudio:", e));
    const pause = () => audioRef.current.pause();
    const syncTime = (time) => {
        // Sincroniza o tempo do áudio com o do vídeo
        if (Math.abs(audioRef.current.currentTime - time) > 0.2) { // Evita saltos desnecessários
            audioRef.current.currentTime = time;
        }
    };

    const value = {
        selectMusic,
        setAudioMode,
        play,
        pause,
        syncTime,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    return useContext(AudioContext);
};
