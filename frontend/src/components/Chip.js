import React from 'react';
import styled, { css } from 'styled-components';

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
        <StyledChip
            width={width}
            onClick={onClick}
            clicked={clicked}
            filled={filled}
        >
            {content}
        </StyledChip>
    );
}

const baseStyles = css`
    user-select: none;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid var(--gray30);
    border-radius: 100px;
    height: 32px;
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: #919191;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const clickedStyles = css`
    border: 1px solid #913FF7;
    color: #913FF7;
`;

const filledStyles = css`
    background: #913FF7;
    color: white;
`;

const StyledChip = styled.div`
    ${baseStyles}
    width: ${({ width }) => width || 'auto'};

    ${({ clicked }) => clicked && clickedStyles}
    ${({ clicked, filled }) => clicked && filled && filledStyles}
`;

export default Chip;
