import styled from "styled-components";
import { CommonDivS } from "../../styles/DivS.styles";

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
  display: flex;
  flex-direction: column;
  gap: 40px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 32px 20px 124px 20px;
  background-color: white;
`;

const WordBox = styled(CommonDivS.DivSpaceBetween)`
  gap: 8px;

  & .word {
    font-size: 24px;
    font-weight: bold;
    line-height: 24px;
  }

  & .pronunciation {
    font-size: 14px;
    color: #5f5f5f;
    line-height: 22px;
  }
`;

const SpeakerBg = styled(CommonDivS.DivCenter)`
  width: 40px;
  height: 40px;
  background-color: #f7f7f7;
  border-radius: 50%;
`;

const MeaningBox = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--gray80);
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
`;

const BtnBox = styled(CommonDivS.DivSpaceBetween)`
  min-width: 335px;
  width: calc(100% - 40px);
  gap: 16px;
  position: fixed;
  left: 0;
  bottom: 40px;
  padding: 0px 20px;
`;

export const WordToastS = {
  DarkBg,
  WhiteBg,
  WordBox,
  SpeakerBg,
  MeaningBox,
  BtnBox,
};
