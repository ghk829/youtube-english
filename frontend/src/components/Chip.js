import React from 'react';
import './chip.css';

const Chip = ({ content, width }) => {
    return (
        <div className={`chip`}
        style={{width: width}}
        >
            {content}
        </div>
    );
}

export default Chip;
