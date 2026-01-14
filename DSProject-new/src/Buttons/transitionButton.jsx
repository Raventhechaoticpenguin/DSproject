function TransitionButton({ imgSrc, Text, onClick, children }) {
    const label = children || Text;

    return (
        <button className="trans-btn" onClick={onClick}>
            <span className="trans-btn-text">{label}</span>
            <img className="trans-img" src={imgSrc} alt={label} />
        </button>
    );
}

export default TransitionButton;