import styled from "styled-components";

const DarkBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.8);
`;

const WhiteBg = styled.div`
  width: 100%;
  height: calc(23.438rem - 4.5rem);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 2rem 1.25rem 2.5rem 1.25rem;
  background-color: white;
`;

export const WordToastS = {
  DarkBg,
  WhiteBg,
};
