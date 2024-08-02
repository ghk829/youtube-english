import React from "react";
import { useNavigate } from "react-router-dom";
import "./wordToast.styles.js";
import { WordToastS } from "./wordToast.styles.js";
import { ReactComponent as IconSpeaker } from "../../assets/iconSpeaker.svg";
import { CommonDivS } from "../../styles/DivS.styles.js";
import LongButton from "../LongButton.js";

interface WordToastProps {
  word: string;
}

const WordToast: React.FC<WordToastProps> = ({ word }) => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  const playPronunciation = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US"; // 언어 설정
    window.speechSynthesis.speak(utterance); // 발음 재생
  };

  return (
    <div>
      <WordToastS.DarkBg>
        <WordToastS.WhiteBg>
          <CommonDivS.DivSpaceBetween>
            <WordToastS.WordBox>
              <span className="word">{word}</span>
              <span className="pronunciation">[ 발음 ]</span>
            </WordToastS.WordBox>
            <WordToastS.SpeakerBg onClick={playPronunciation}>
              <IconSpeaker />
            </WordToastS.SpeakerBg>
          </CommonDivS.DivSpaceBetween>
          <span>한글 뜻</span>
          <WordToastS.BtnBox>
            <LongButton
              color={"purpleLine"}
              content={"닫기"}
              onClick={onClose}
              width={"calc(50% - 10px)"}
            />
            <LongButton
              content={"단어장에 추가하기"}
              width={"calc(50%) - 10px"}
            />
          </WordToastS.BtnBox>
        </WordToastS.WhiteBg>
      </WordToastS.DarkBg>
    </div>
  );
};

export default WordToast;
