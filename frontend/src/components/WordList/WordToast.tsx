import React from "react";
import { useNavigate } from "react-router-dom";
// Apis
import { addWord } from "../../apis/wordList.ts";
// Components
import LongButton from "../LongButton.js";
// Styles
import "./wordToast.styles.js";
import { WordToastS } from "./wordToast.styles.js";
import { CommonDivS } from "../../styles/DivS.styles.js";
// Assets
import { ReactComponent as IconSpeaker } from "../../assets/iconSpeaker.svg";

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

  const addWordToList = () => {
    addWord(
      word,
      "뜻" // 뜻은 API 연결 후, 임시
    );
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
              onClick={addWordToList}
              width={"calc(50%) - 10px"}
            />
          </WordToastS.BtnBox>
        </WordToastS.WhiteBg>
      </WordToastS.DarkBg>
    </div>
  );
};

export default WordToast;
