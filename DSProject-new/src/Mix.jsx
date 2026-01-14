import React from "react";
import { Link } from 'react-router-dom';
import MButton from './Buttons/musicsButton.jsx'
import './styling/musicsButton.css'
import MImage from './assets/Monster.png'   
import ESImage from './assets/ES.png'
import GWImage from './assets/GW.png'
import IImage from './assets/Buttons-house.png'
import TButton from './Buttons/thingButtons.jsx'

function Mix(){
    return (
    
    <>
            <nav className="play-nav-bar">
                <Link to="/">
                    <TButton imgSrc={IImage} Text="Home Button"></TButton>
                </Link>
            </nav>
            <div className="play-container">
                <h1>Choose a Music to Play:</h1>
                <div className="PlayButtons">
                    <Link to="/mixplay/monster">
                        <MButton imgSrc={MImage} Text="Play Button">Monster from Adventure Time Distant Lands</MButton>
                    </Link>
                    <Link to="/mixplay/everything-stays">
                        <MButton imgSrc={ESImage} Text="Play Button">Everything Stays from Adventure Time</MButton>
                    </Link>
                    <Link to="/mixplay/giant-woman">
                        <MButton imgSrc={GWImage} Text="Play Button">Giant Woman from Steven Universe</MButton>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Mix;