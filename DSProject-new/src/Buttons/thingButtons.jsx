function ThingButton({imgSrc, Text, onClick, children}){

    return(
        <button className="thing-btn" onClick={onClick}>
            <img className="thing-img" src={imgSrc} alt={Text} />
        </button>
    );
}

export default ThingButton;