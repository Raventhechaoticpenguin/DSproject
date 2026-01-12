function IconButton({imgSrc, Text, onClick, children}){

    return(
        <button className="img-btn" onClick={onClick}>
            <span className="img-btn-text">{children}</span>
            <img src={imgSrc} alt={Text} />
        </button>
    );
}

export default IconButton;