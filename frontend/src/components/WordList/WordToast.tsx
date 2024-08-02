import React from "react";
import { useNavigate } from "react-router-dom";
import "./wordToast.styles.js";
import { WordToastS } from "./wordToast.styles.js";

interface WordToastProps {
  word: string;
}

const WordToast: React.FC<WordToastProps> = ({ word }) => {
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };

  return (
    <div>
      <WordToastS.DarkBg>
        <WordToastS.WhiteBg>
          <div className="word-container"></div>
        </WordToastS.WhiteBg>
      </WordToastS.DarkBg>
    </div>
  );
};

export default WordToast;
