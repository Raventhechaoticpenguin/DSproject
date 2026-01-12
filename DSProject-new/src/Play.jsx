import React from "react";
import { Link } from 'react-router-dom';
import MButton from './Buttons/musicsButton.jsx'
import './styling/musicsButton.css'
import MImage from './assets/Monster.png'   
import ESImage from './assets/ES.png'
import IImage from './assets/Buttons-house.png'
import TButton from './Buttons/thingButtons.jsx'

function Play(){
    return(
        <>
            <nav className="play-nav-bar">
                <Link to="/">
                    <TButton imgSrc={IImage} Text="Home Button"></TButton>
                </Link>
            </nav>
            <div className="play-container">
                <h1>Choose a Music to Play:</h1>
                <div className="PlayButtons">
                    <MButton imgSrc={MImage} Text="Play Button">Monster from Adventure Time Distant Lands</MButton>
                    <MButton imgSrc={ESImage} Text="Play Button">Everything Stays from Adventure Time</MButton>
                </div>
            </div>
        </>
    );
    
}

export default Play;