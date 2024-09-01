import React, { useEffect, useState } from "react";
// Api
import { getWords, Word } from "../apis/wordList.ts";
// Component
import LongButton from "../components/LongButton.js";
import { WordToastS } from "../components/WordList/wordToast.styles.js";
// Style
import { WordListS } from "./css/wordListPage.styles.ts";
// Asset
import { ReactComponent as IconSpeaker } from "../assets/iconSpeaker.svg";

const WordListPage = () => {
  const [wordList, setWordList] = useState<Word[]>();
  const [isScheduled, setIsScheduled] = useState(true);

  // 발음 기호를 가져오는 함수
  const playPronunciation = async (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US"; // 언어 설정
    window.speechSynthesis.speak(utterance); // 발음 재생
  };

  useEffect(() => {
    const fetchWords = async () => {
      const res: Word[] = await getWords(isScheduled ? 0 : 1);
      if (Array.isArray(res)) {
        setWordList(res);
      } else {
        console.error("API 응답이 배열이 아닙니다:", res);
      }
    };

    fetchWords();
  }, [isScheduled]);

  const handleToggle = () => {
    setIsScheduled(!isScheduled);
  };

  return (
    <WordListS.Wrapper>
      <WordListS.ToggleContainer>
        <WordListS.ToggleButton active={isScheduled} onClick={handleToggle}>
          학습 전
        </WordListS.ToggleButton>
        <WordListS.ToggleButton active={!isScheduled} onClick={handleToggle}>
          학습 후
        </WordListS.ToggleButton>
      </WordListS.ToggleContainer>
      <WordListS.WordListWrapper>
        <WordListS.EditContainer>
          <WordListS.TotalCount>
            총 {wordList && wordList.length}개
          </WordListS.TotalCount>
        </WordListS.EditContainer>
        <LongButton content={"영단어 학습하기"} width={"100%"} />
        <WordListS.ListContainer>
          {wordList &&
            wordList.map((word) => (
              <WordListS.ListItem key={word._id}>
                <div className="word-box">
                  <span className="word">{word.word}</span>
                  <span className="meaning">{word.meaning}</span>
                </div>
                <WordToastS.SpeakerBg
                  onClick={() => playPronunciation(word.word)}
                >
                  <IconSpeaker />
                </WordToastS.SpeakerBg>
              </WordListS.ListItem>
            ))}
        </WordListS.ListContainer>
      </WordListS.WordListWrapper>
    </WordListS.Wrapper>
  );
};

export default WordListPage;
