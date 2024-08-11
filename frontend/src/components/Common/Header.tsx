import React from "react";
import { useNavigate } from "react-router-dom";
// Assets
import { ReactComponent as IconPrev } from "../../assets/iconPrev.svg";

const { default: styled } = require("styled-components");

const Header = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <StHeaderWrapper>
      <IconPrev onClick={() => navigate(-1)} />
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
