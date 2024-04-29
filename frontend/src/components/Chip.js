import React, { useState } from 'react';
import './chip.css';

const Chip = ({ content, width, onClick, clicked, filled }) => {
    return (
        <div
            className={`chip ${clicked ? 'clicked' : ''} ${clicked&&filled? 'filled':''}`}
            style={{width: width}}
            onClick={onClick} 
        >
            {content}
        </div>
    );
}

export default Chip;
