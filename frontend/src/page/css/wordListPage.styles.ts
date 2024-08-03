const { default: styled } = require("styled-components");

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 24px;
`;

const ToggleContainer = styled.div`
  display: flex;
  border-radius: 20px;
  padding: 4px;
  height: 40px;
  overflow: hidden;
  background: #f7f7f7;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 7px 39.75px;
  border: none;
  border-radius: 40px;
  box-shadow: ${(props) =>
    props.active ? "0px 1px 2px rgba(0, 0, 0, 0.15)" : ""};
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;
  color: ${(props) => (props.active ? "black" : "gray")}; /* 텍스트 색상 */

  &:hover {
    background: ${(props) => (props.active ? "white" : "#e0e0e0")};
  }

  ${(props) =>
    props.active &&
    `
    background: white; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  `}
`;

const ListContainer = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 17px;
  margin: 0;
  padding: 0;
  height: 22px;
  padding: 15px 0px;
  border-bottom: 1px solid var(--gray10);

  & span {
    width: 100%;
    font-size: 14px;
  }

  & .word {
    font-weight: bold;
    line-height: 18px;
  }

  & .meaning {
    line-height: 22px;
  }
`;

export const WordListS = {
  Wrapper,
  ToggleContainer,
  ToggleButton,
  ListContainer,
  ListItem,
};
