import React, { useState, useEffect } from "react";
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
  sentence: string;
}

const WordToast: React.FC<WordToastProps> = ({ word, sentence }) => {
  const navigate = useNavigate();
  const [meaning, setMeaning] = useState<string[]>([]); // 뜻을 저장할 상태
  const [pronunciation, setPronunciation] = useState<string | null>(null); // 발음 기호를 저장할 상태

  const onClose = () => {
    navigate(-1);
  };

  const playPronunciation = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US"; // 언어 설정
    window.speechSynthesis.speak(utterance); // 발음 재생
  };

  // 단어의 뜻을 가져오는 함수 (GPT API 사용)
  const fetchMeaning = async () => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_GPT_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              {
                role: "user",
                content: `sentence: ${sentence}\wword: ${word}\nWhat's the meaning of the word?`,
              },
            ],
            max_tokens: 50,
          }),
        }
      );

      const data = await response.json();
      if (data && data.choices && data.choices.length > 0) {
        const meanings = data.choices[0].text.trim().split("\n");
        setMeaning(meanings);
      } else {
        setMeaning([]);
      }
    } catch (error) {
      console.error("Error fetching meaning:", error);
    }
  };

  // 발음 기호를 가져오는 함수
  const fetchPronunciation = async () => {
    try {
      const response = await fetch(
        `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${process.env.REACT_APP_MW_API}`
      );
      const data = await response.json();
      if (data.length > 0 && data[0].hwi && data[0].hwi.prs) {
        setPronunciation(data[0].hwi.prs[0].ipa); // 첫 번째 발음 기호를 가져옴
      }
    } catch (error) {
      console.error("Error fetching pronunciation:", error);
    }
  };

  const addWordToList = () => {
    const name = localStorage.getItem("name");
    if (name) {
      if (meaning) {
        addWord(word, meaning, sentence);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchMeaning();
    fetchPronunciation();
  }, [word]);

  return (
    <div>
      <WordToastS.DarkBg>
        <WordToastS.WhiteBg>
          <CommonDivS.DivSpaceBetween>
            <WordToastS.WordBox>
              <span className="word">{word}</span>
              <span className="pronunciation">
                {pronunciation
                  ? `[ ${pronunciation} ]`
                  : "[ 발음 기호 가져오는 중...]"}
              </span>
            </WordToastS.WordBox>
            <WordToastS.SpeakerBg onClick={playPronunciation}>
              <IconSpeaker />
            </WordToastS.SpeakerBg>
          </CommonDivS.DivSpaceBetween>
          <WordToastS.MeaningBox>
            {meaning && meaning.length > 0
              ? meaning.map((item, index) => {
                  return (
                    <span key={index}>
                      {index + 1}. {item}
                    </span>
                  );
                })
              : "뜻을 가져오는 중..."}
          </WordToastS.MeaningBox>
          <WordToastS.BtnBox>
            <LongButton
              color={"purpleLine"}
              content={"닫기"}
              onClick={onClose}
              width={"calc(50% - 10px)"}
            ></LongButton>
            <LongButton
              content={"단어장에 추가하기"}
              onClick={addWordToList}
              width={"calc(50% - 10px)"}
            />
          </WordToastS.BtnBox>
        </WordToastS.WhiteBg>
      </WordToastS.DarkBg>
    </div>
  );
};

export default WordToast;
