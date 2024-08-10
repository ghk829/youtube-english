import axios from "axios";
import { useEffect } from "react";

const QuickMenuDetail = () => {
  // 'category' 파라미터의 값을 추출
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  // 비디오 데이터를 가져와 초기화하는 함수
  const fetchVideoData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MOD || ""}/api/getvideo?category=${category}`
      );
      const sortedVideoList = response.data.sort((a, b) =>
        a.subcategory.localeCompare(b.subcategory)
      );

      // 데이터를 sessionStorage에 저장
      sessionStorage.setItem("videoList", JSON.stringify(sortedVideoList));
      sessionStorage.setItem("videoTimestamp", Date.now());
    } catch (error) {
      console.error("비디오 데이터를 가져오는 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  });

  return;
};

export default QuickMenuDetail;
