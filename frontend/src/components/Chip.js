import React, { useState } from 'react';
import './chip.css';

const Chip = ({ content, width, onClick, clicked }) => {
    return (
        <div
            className={`chip ${clicked ? 'clicked' : ''}`}
            style={{width: width}}
            onClick={onClick} 
        >
            {content}
        </div>
    );
}

export default Chip;
