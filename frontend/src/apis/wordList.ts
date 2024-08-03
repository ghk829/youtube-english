import axios from "axios";

// 단어장에 단어를 추가하는 함수
export const addWord = async (word, meaning) => {
  const name = localStorage.getItem("name");
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_MOD || ""}/api/addword`,
      {
        name,
        word,
        meaning,
      }
    );
    console.log(res);
  } catch (error) {
    console.error("단어를 추가하는 중 에러 발생:", error);
  }
};

export interface Word {
  _id: string;
  name: string;
  word: string;
  meaning: string;
}

// 내가 저장한 단어를 불러오는 함수
export const getWords = async (): Promise<Word[]> => {
  // 반환 타입을 명시
  const name = localStorage.getItem("name");
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_MOD || ""}/api/getwords?name=${name}`
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("단어를 불러오는 중 에러 발생:", error);
    return [];
  }
};
