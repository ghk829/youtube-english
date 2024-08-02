import React from "react";
import styled, { css } from "styled-components";

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

const LongButton = ({
  color = "purple",
  content,
  onClick,
  width,
  children,
}) => {
  const buttonStyles = {
    black: BlackButton,
    white: WhiteButton,
    purple: PurpleButton,
    inactive: InactiveButton,
    purpleLine: PurpleLineButton,
  };

  const ButtonComponent = buttonStyles[color];

  return (
    <ButtonComponent onClick={onClick} width={width}>
      {children}
      {content}
    </ButtonComponent>
  );
};

const buttonBaseStyles = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
  gap: 4px;

  width: calc(
    ${({ width }) => (width == "full" ? "100%" : width || "280px")} - 40px
  );
  height: 48px;

  border-radius: 8px;
  flex: none;
  cursor: pointer;
  order: 3;
  flex-grow: 0;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: var(--gray05);
`;

const BlackButton = styled.div`
  ${buttonBaseStyles}
  background-color: var(--gray90);
  color: var(--gray05);
`;

const WhiteButton = styled.div`
  ${buttonBaseStyles}
  background-color: var(--gray05);
  color: var(--gray90);
  border: 1px solid var(--gray30);
`;

const PurpleButton = styled.div`
  ${buttonBaseStyles}
  background-color: var(--purple60);
  color: var(--gray05);
`;

const InactiveButton = styled.div`
  ${buttonBaseStyles}
  background-color: var(--gray10);
  color: var(--gray40);
`;

const PurpleLineButton = styled.div`
  ${buttonBaseStyles}
  color: var(--purple60);
  border: 1px solid var(--purple60);
  background-color: var(--gray05);
`;

export default LongButton;
