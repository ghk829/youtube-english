import React, { useState, useEffect } from 'react';
import '../page/detailPage.css'
import axios from 'axios'

const QuizDetail = ({ scripts }) => {
  const [selected, setSelected] = useState('');
  const [lastHalf, setLastHalf] = useState([]);
  const [firstHalf, setFirstHalf] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [selectedWords, setSelectedWords] = useState([{}]);

  useEffect(() => {
    generateQuiz();
  }, []);

  useEffect(() => {
    if (selectedWords.length === (lastHalf.length+1)&&(lastHalf.length!==0)) {
      const selectedWordsString = selectedWords.map(selectedWord => selectedWord.word).join(' ');
      const lastHalfString = ' ' +lastHalf.join(' ');

      if (selectedWordsString === lastHalfString) {
        alert('맞았습니다!');
        console.log(selectedWordsString)
        console.log(lastHalfString)
      } else {
        alert('틀렸습니다!');
        console.log(selectedWordsString)
        console.log(lastHalfString)
      }
    }
  }, [selectedWords, lastHalf]);


  const handleSelectWord = (word) => {

    const index = selectedWords.findIndex(selectedWord => selectedWord.word === word);
    if (index > -1) {
      const newSelectedWords = selectedWords.slice();
      newSelectedWords.splice(index, 1);
      setSelectedWords(newSelectedWords);
    } else {
      setSelectedWords([...selectedWords, { word, selected: true }]);
    }
    console.log(selectedWords)
  };


const generateQuiz = () => {
  const sentence = scripts[Math.floor(Math.random() * scripts.length)];
  setSelected(sentence);

  const words = sentence.split(' ');
  const halfIndex = Math.floor(words.length / 2+1);
  const firstHalf = words.slice(0, halfIndex);
  setFirstHalf(firstHalf.join(' '));


  const lastHalf = words.slice(halfIndex);
  setLastHalf(lastHalf);

  const shuffled = shuffleArray([...lastHalf]);
  setShuffled(shuffled);
};
const shuffleArray = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
// const generateQuiz = async () => {
//     if (!scripts) {
//       alert('먼저 자막을 가져와주세요.');
//       return;
//     }
//     try {
//       let wholescript =""
//       for (let i=0; i<scripts.length; i++){
//         wholescript += scripts[i];
//       }
//       const response = await axios.post('/quizFromSubtitle', { subtitles: wholescript });
//       const quiz_json = response.data;

//       setQuiz();
//     } catch (error) {
//       console.error('Error generating quiz:', error);
//       alert('퀴즈를 생성하는 데 실패했습니다.');
//     }
//   };


return (
  <div className='quiz-detail'>
    <div className='quiz-progress'>1/5</div>
    <div className='quiz-question'>{firstHalf}</div>
    <div className='quiz-question-empty'>
{selectedWords.map(selectedWord => selectedWord.word).join(' ')}
    </div>

    <div className='quiz-question-translated'>번역번역번역번역</div>
    <div className='quiz-btns'>
      {
        shuffled.map((item) => (
          <div className='quiz-btn' onClick={() => handleSelectWord(item)}>
            {item}
          </div>
        ))
      }
    </div>
  </div>
)
}

export default QuizDetail;