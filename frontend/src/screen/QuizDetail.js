import React, { useState, useEffect } from 'react';
import '../page/detailPage.css';
import axios from 'axios';

const QuizDetail = ({ quizs_data, setStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [words, setWords] = useState([]);
  const [quizs, setQuizs] = useState([]);
  const [quizSentence, setQuizSentence] = useState("");
  const [quizTranslated, setQuizTranslated] = useState("");
  const [quizAns, setQuizAns] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const quizLimit = 5;

  const checkAnswer = (selectedWord) => {

    // message += `\n실제 정답: ${quizAns}`;
    setFeedback(selectedWord === quizAns);

    setTimeout(() => {
      setFeedback("");

      let nextQuizIndex = currentQuizIndex + 1;
      if (nextQuizIndex < quizs.length && nextQuizIndex < quizLimit) {
        setCurrentQuizIndex(nextQuizIndex);
        randQuiz(JSON.parse(quizs_data).data);
        setIsClicked(false)
      } else {
        alert("퀴즈가 완료되었습니다!");
        setStep();
      }
    }, 1000); // 1초 지연
  };



  const randQuiz = (quizData) => {
    if (quizData.length > 0) {
      let randIndex = Math.floor(Math.random() * quizData.length);
      console.log(quizData[randIndex]);
      const wordRegex = quizData[randIndex].word.split(' ').join('\\s*').trim();

      let sentenceReplaced = quizData[randIndex].sentence.replace(new RegExp(wordRegex, 'gi'), '______');

      setQuizSentence(sentenceReplaced);
      setQuizTranslated(quizData[randIndex].translated_sentence);
      setQuizAns(quizData[randIndex].word);

      let newWords = [];
      newWords.push(quizData[randIndex].word.trim());
      while (newWords.length != 5) {
        let randIndex = Math.floor(Math.random() * quizData.length);
        let word = quizData[randIndex].word;
        if (!newWords.includes(word.trim())) {
          newWords.push(word.trim());
        }
      }
      setWords([...newWords].sort(() => Math.random() - 0.5));
    }
  };



  const generateQuiz = async () => {
    setIsLoading(true);

    if (quizs_data.length > 0) {
      try {
        console.log("퀴즈 JSON parse중")
        setQuizs(JSON.parse(quizs_data).data);
        randQuiz(JSON.parse(quizs_data).data);
      } catch (error) {
        console.error('퀴즈 생성 중 오류:', error);
        alert('퀴즈를 생성하는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    generateQuiz();
  }, [quizs_data]);

  return (
    <div className='quiz-detail'>
      {isLoading ?

        <div>로딩 중...</div> :
        <>
          <div className='quiz-progress'>{currentQuizIndex + 1}/5</div>
          <div className='quiz-question' >{quizSentence}</div>

          <div className='quiz-question-translated'>{quizTranslated}</div>
          <div className='quiz-btns'>
            {
              words.map((item, index) => (
                <button key={index} className='quiz-btn' onClick={() =>{ checkAnswer(item);     setIsClicked(true);}} 
                style={{
                  backgroundColor: isClicked?"#C7C7C7": "white",
                  color: isClicked?"#ABABAB": "#1C1C1C"
                }}
                >
                  {item}
                </button>
              ))
            }
          </div>
          {isClicked ?

            <div>
              {
                feedback ?
                  <div className='feedback'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#23BB72" />
                    </svg>

                    정답이에요!</div> :
                  <div className='feedback'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.92984 17.0698C1.97473 16.1474 1.21291 15.0439 0.688821 13.8239C0.164731 12.6038 -0.111131 11.2916 -0.122669 9.96385C-0.134207 8.63605 0.11881 7.31926 0.621618 6.09029C1.12443 4.86133 1.86696 3.74481 2.80589 2.80589C3.74481 1.86696 4.86133 1.12443 6.09029 0.621618C7.31926 0.11881 8.63605 -0.134207 9.96385 -0.122669C11.2916 -0.111131 12.6038 0.164731 13.8239 0.688821C15.0439 1.21291 16.1474 1.97473 17.0698 2.92984C18.8914 4.81586 19.8994 7.34188 19.8766 9.96385C19.8538 12.5858 18.8021 15.0939 16.948 16.948C15.0939 18.8021 12.5858 19.8538 9.96385 19.8766C7.34188 19.8994 4.81586 18.8914 2.92984 17.0698ZM8.99984 4.99984V10.9998H10.9998V4.99984H8.99984ZM8.99984 12.9998V14.9998H10.9998V12.9998H8.99984Z" fill="#FF7070" />
                    </svg>

                    틀렸어요 :&#40; </div>
              }
            </div> :

            <div style={{height: "56px"}}> </div>
          }
        </>
      }
    </div>
  )
}

export default QuizDetail;
