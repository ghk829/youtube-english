import React, { useState } from 'react';
import './chip.css';

/**
 * Chip
 *
 * - content: Chip에 표시될 내용
 * - width: Chip의 너비
 * - onClick: Chip 클릭 시 호출될 함수
 * - clicked: Chip의 클릭 상태
 * - filled: Chip이 클릭되고 채워졌는지 여부
 */

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
