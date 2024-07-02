import React from 'react';
import './longButton.css';

const LongButton = ({ color, content, onClick, width, children}) => {
    const buttonStyles = {
        black: "blackButton",
        white: "whiteButton",
        purple: "purpleButton",
        inactive: "inactiveButton"
    };

    const buttonClass = buttonStyles[color] || "purpleButton";

    return (
        <div className={`long-btn ${buttonClass}`} onClick={onClick}
        style={{width: width}}>
            {children}
            {content}
        </div>
    );
}

export default LongButton;
