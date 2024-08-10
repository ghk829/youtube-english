import React from "react";
import { ReactComponent as IconPrev } from "../../assets/iconPrev.svg";

const { default: styled } = require("styled-components");

const Header = ({ title }: { title: string }) => {
  return (
    <StHeaderWrapper>
      <IconPrev />
      <span>{title}</span>
      <div></div>
    </StHeaderWrapper>
  );
};

export default Header;

const StHeaderWrapper = styled.div`
  width: 100%;
  background-color: white;
  padding: 17.79px 0px;
  display: flex;
  justify-content: space-between;

  & span {
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
  }
`;
