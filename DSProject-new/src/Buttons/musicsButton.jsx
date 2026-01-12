import "../styling/musicsButton.css"

function MusicButton({imgSrc, Text, onClick, children}){

    return(
        <button className="music-btn" onClick={onClick}>
            <img src={imgSrc} alt={Text} />
            <span className="music-btn-text">{children}</span>
        </button>
    );
}

export default MusicButton;