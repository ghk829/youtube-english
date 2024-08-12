import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as IconHome } from "../../assets/iconHome.svg";
import { ReactComponent as IconWordFill } from "../../assets/iconFilledWord.svg";
import { ReactComponent as IconWord } from "../../assets/iconWord.svg";
import { CommonDivS } from "../../styles/DivS.styles";

const BottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathWithHome = ["/", "/video"];

  // 각 아이콘의 색상 결정
  const homeColor = pathWithHome.includes(location.pathname)
    ? "var(--purple60)"
    : "#EDEDED";
  const wordColor = (color) => {
    return location.pathname === "/word-list" ? "var(--purple60)" : color;
  };

  return (
    <BgWhite>
      <IconBox onClick={() => navigate("/")}>
        <IconHome fill={homeColor} />
        <StyledSpan color={homeColor}>홈</StyledSpan>
      </IconBox>
      <IconBox onClick={() => navigate("/word-list")}>
        {location.pathname === "/word-list" ? (
          <IconWordFill fill={"var(--purple60)"} />
        ) : (
          <IconWord fill={"var(--gray40)"} />
        )}
        <StyledSpan color={wordColor("var(--gray40)")}>단어장</StyledSpan>
      </IconBox>
    </BgWhite>
  );
};

export default BottomBar;

const BgWhite = styled(CommonDivS.DivSpaceBetween)`
  background-color: white;
  width: calc(100% - 155px);
  position: fixed;
  bottom: 0;
  left: 0;
  height: calc(64px - 23px);
  padding: 13px 77.75px 10px 77.5px;
  border-top: 1px solid var(--gray05);
`;

const IconBox = styled.div`
  height: 44px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const StyledSpan = styled.span`
  color: ${(props) => props.color};
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
`;
