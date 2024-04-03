import React from 'react';
import './longButton.css';

const LongButton = ({ colour, content, onClick, width, children}) => {
    const buttonStyles = {
        black: "blackButton",
        white: "whiteButton",
        purple: "purpleButton",
    };

    const buttonClass = buttonStyles[colour] || "purpleButton";

    return (
        <div className={`long-btn ${buttonClass}`} onClick={onClick}
        style={{width: width}}>
            {children}
            {content}
        </div>
    );
}

export default LongButton;
