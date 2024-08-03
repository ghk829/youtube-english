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
