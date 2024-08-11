const { default: styled } = require("styled-components");

const Wrapper = styled.div`
  gap: 24px;
`;

const ChipContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-top: 24px;
  margin-bottom: 34px;
`;

export const QMDetailS = { Wrapper, ChipContainer };
