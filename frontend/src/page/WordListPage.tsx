import React, { useEffect, useState } from "react";
import { getWords, Word } from "../apis/wordList.ts";
import { WordListS } from "./css/wordListPage.styles.ts";

const WordListPage = () => {
  const [wordList, setWordList] = useState<Word[]>();
  const [isScheduled, setIsScheduled] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      const res: Word[] = await getWords();
      if (Array.isArray(res)) {
        setWordList(res);
      } else {
        console.error("API 응답이 배열이 아닙니다:", res);
      }
    };

    fetchWords();
  }, []);

  const handleToggle = () => {
    setIsScheduled(!isScheduled);
  };

  return (
    <WordListS.Wrapper>
      <WordListS.ToggleContainer>
        <WordListS.ToggleButton active={isScheduled} onClick={handleToggle}>
          학습 예정 단어
        </WordListS.ToggleButton>
        <WordListS.ToggleButton active={!isScheduled} onClick={handleToggle}>
          학습 완료 단어
        </WordListS.ToggleButton>
      </WordListS.ToggleContainer>
      {isScheduled ? (
        <WordListS.ListContainer>
          {wordList &&
            wordList.map((word) => (
              <WordListS.ListItem key={word._id}>
                <span className="word">{word.word}</span>
                <span className="meaning">{word.meaning}</span>
              </WordListS.ListItem>
            ))}
        </WordListS.ListContainer>
      ) : (
        <></>
      )}
    </WordListS.Wrapper>
  );
};

export default WordListPage;
