import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
// Components
import Header from "../components/Common/Header.tsx";
import VideoThumbnail from "../components/Common/VideoThumbnail.tsx";
import Chip from "../components/Chip.js";
// Types
import { IVideoData } from "./types/common.types.ts";
// Styles
import { QMDetailS } from "./css/quickMenuDetail.styles.ts";

const QuickMenuDetail: React.FC = () => {
  // 'category' 파라미터의 값을 추출
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [clickedChip, setClickedChip] = useState<string | null>(null);
  const [videoList, setVideoList] = useState<IVideoData[]>([]);

  // 비디오 데이터를 가져와 초기화하는 함수
  const fetchVideoData = async () => {
    try {
      const baseUrl = process.env.REACT_APP_MOD || "";
      const categoryParam = category ? `category=${category}` : "";
      const subcategoryParam = clickedChip ? `subcategory=${clickedChip}` : "";

      const response = await axios.get<IVideoData[]>(
        `${baseUrl}/api/getvideo?${categoryParam}${
          subcategoryParam ? `&${subcategoryParam}` : ""
        }`
      );

      const sortedVideoList: IVideoData[] = response.data.sort((a, b) =>
        a.subcategory.localeCompare(b.subcategory)
      );

      setVideoList(sortedVideoList);
      setSubcategories([
        ...new Set(sortedVideoList.map((item) => item.subcategory)),
      ]);
      // 데이터를 sessionStorage에 저장
      sessionStorage.setItem("videoList", JSON.stringify(sortedVideoList));
      sessionStorage.setItem("videoTimestamp", String(Date.now()));
    } catch (error) {
      console.error("비디오 데이터를 가져오는 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    setClickedChip(subcategories[0]);
  }, [subcategories]);

  useEffect(() => {
    fetchVideoData();
  }, [category, clickedChip]);

  return (
    <QMDetailS.Wrapper>
      <Header title={`${category} 영어`} />
      {/* subcategory 칩 */}
      <QMDetailS.ChipContainer>
        {subcategories.map((subcategory) => (
          <Chip
            key={subcategory}
            content={subcategory}
            width="auto"
            onClick={() => setClickedChip(subcategory)}
            clicked={clickedChip === subcategory}
            filled={clickedChip === subcategory}
          />
        ))}
      </QMDetailS.ChipContainer>
      {/* 영상 리스트 */}
      <div>
        {videoList.map((video) => (
          <VideoThumbnail
            key={video._id}
            title={video.title}
            videoId={video.videoid}
          />
        ))}
      </div>
    </QMDetailS.Wrapper>
  );
};

export default QuickMenuDetail;
