import React from 'react';
import './longButton.css';

/**
 * LongButton 
 *
 * 속성:
 * - color: 버튼의 색상 (black, white, purple, inactive, purpleLine 중 하나)
 * - content: 버튼에 표시될 내용
 * - onClick: 버튼 클릭 시 호출될 함수
 * - width: 버튼의 너비
 * - children: 버튼의 자식 요소
 */

const LongButton = ({ color, content, onClick, width, children}) => {
    const buttonStyles = {
        black: "blackButton",
        white: "whiteButton",
        purple: "purpleButton",
        inactive: "inactiveButton",
        purpleLine: "purpleLineButton"
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
