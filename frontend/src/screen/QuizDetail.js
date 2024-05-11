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
  const quizLimit = 5;

  const checkAnswer = (selectedWord) => {
    let message = selectedWord === quizAns ? "정답입니다!" : "틀렸습니다.";
    message += `\n실제 정답: ${quizAns}`;
    setFeedback(message); 
  
    setTimeout(() => {
      setFeedback(""); 
  
      let nextQuizIndex = currentQuizIndex + 1;
      if (nextQuizIndex < quizs.length && nextQuizIndex < quizLimit) {
        setCurrentQuizIndex(nextQuizIndex);
        randQuiz(JSON.parse(quizs_data).data);
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

    if(quizs_data.length>0)
      {
    try {
      console.log("퀴즈 JSON parse중")
      setQuizs(JSON.parse(quizs_data).data);
      randQuiz(JSON.parse(quizs_data).data);
    } catch (error) {
      console.error('퀴즈 생성 중 오류:', error);
      alert('퀴즈를 생성하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }}
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
                <button key={index} className='quiz-btn' onClick={() => checkAnswer(item)}>
                  {item}
                </button>
              ))
            }
          </div>
          <div className='feedback'>{feedback}</div>
        </>
      }
    </div>
  )
}

export default QuizDetail;
