import React, { useState, useEffect } from 'react';
import '../page/detailPage.css';
import axios from 'axios';

const QuizDetail = ({ scripts, setStep }) => {
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
    alert(message);

    let nextQuizIndex = currentQuizIndex + 1;
    if(nextQuizIndex < quizs.length && nextQuizIndex < quizLimit) {
      setCurrentQuizIndex(nextQuizIndex);
      setQuizData(nextQuizIndex);
    } else {
      alert("퀴즈가 완료되었습니다!");
      setStep();
    }
  };

  const setQuizData = (index) => {
    let quiz = quizs[index];
    let translated = quiz.translated_sentence.replace(new RegExp(quiz.translated_word.split(' ').join('\\s*'), 'gi'), '______');
    setQuizSentence(quiz.sentence);
    setQuizTranslated(translated); 
    setQuizAns(quiz.translated_word);

    let newWords = [quiz.translated_word];
    while (newWords.length < 4) {
      let randIndex = Math.floor(Math.random() * quizs.length);
      let word = quizs[randIndex].translated_word;
      if (!newWords.includes(word)) {
        newWords.push(word);
      }
    }
    setWords(newWords.sort(() => Math.random() - 0.5));
  };

  const randQuiz = () => {
    console.log(quizs)
    if (quizs.length > 0) {
      let randIndex = Math.floor(Math.random() * quizs.length);
      console.log(quizs[randIndex])
      const wordRegex = quizs[randIndex].translated_word.split(' ').join('\\s*');

      let translated = quizs[randIndex].translated_sentence.replace(new RegExp(wordRegex, 'gi'), '______');

      setQuizSentence(quizs[randIndex].sentence);
      setQuizTranslated(translated); 
      setQuizAns(quizs[randIndex].translated_word);

      let newWords = [];
      newWords.push(quizAns)
      while (newWords.length < 4) {
        let randIndex = Math.floor(Math.random() * quizs.length);
        let word = quizs[randIndex].translated_word;
        if (!newWords.includes(word)) {
          newWords.push(word);
        }
      }
      setWords([quizAns, ...newWords].sort(() => Math.random() - 0.5));
    }
  };

  const generateQuiz = async () => {
    if (!scripts || scripts.length === 0) {
      alert('먼저 자막을 가져와주세요.');
      return;
    }

    setIsLoading(true);

    try {
      let wholescript = scripts.join('');
      // const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/quizFromSubtitle`, { subtitles: wholescript });
      // const quiz_json = response.data;
      const quiz_json = {
        "data": [
          { "word": "안녕하세요", "translated_word": "hello", "sentence": "안녕하세요. 만나서 반가워요.", "translated_sentence": "Hello. Nice to meet you." },
          { "word": "사랑", "translated_word": "love", "sentence": "사랑은 아름다운 감정이에요.", "translated_sentence": "Love is a beautiful emotion." },
          { "word": "감사합니다", "translated_word": "thank you", "sentence": "감사합니다. 정말 고마워요.", "translated_sentence": "Thank you. I really appreciate it." },
          { "word": "우정", "translated_word": "friendship", "sentence": "우정은 소중한 것이에요.", "translated_sentence": "Friendship is precious." },
          { "word": "가족", "translated_word": "family", "sentence": "가족과 함께하는 시간은 소중해요.", "translated_sentence": "Time spent with family is precious." },
          { "word": "행복", "translated_word": "happiness", "sentence": "행복을 찾는 것이 어려운 일이 아니에요.", "translated_sentence": "Finding happiness is not an easy task." },]
      }

      setQuizs(quiz_json.data)
      console.log(quiz_json.data)

    } catch (error) {
      console.error('퀴즈 생성 중 오류:', error);
      alert('퀴즈를 생성하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateQuiz();
    randQuiz();
  }, [scripts]);

  return (
    <div className='quiz-detail'>
      {isLoading ?

        <div>로딩 중...</div> :
        <>
          <div className='quiz-progress'>{currentQuizIndex + 1}/5</div>
          <div className='quiz-question' >{quizTranslated}</div>
          <div className='quiz-question-empty' >
          </div>

          <div className='quiz-question-translated'>{quizSentence}</div>
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
