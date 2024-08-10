import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./css/mainPage.css";
import axios from "axios";
import videoPlayer from "../img/icon/videoPlayer.svg";
import fire from "../img/icon/purpleFire.svg";
import Chip from "../components/Chip";
import person from "../img/icon/person.svg";
import IconAccentEarth from "../assets/iconAccentEarth.svg";
import IconInspire from "../assets/iconInspire.svg";
import IconCeleb from "../assets/iconCeleb.svg";

const quickMenuIcons = [IconAccentEarth, IconInspire, IconCeleb];

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentDate, setCurrentDate] = useState(0);
  const [videoList, setVideoList] = useState([]);
  const [pic, setPic] = useState("");
  const [profileName, setProfileName] = useState("");
  const [visibleVideos, setVisibleVideos] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [todayVideo, setTodayVideo] = useState();

  // 메타 태그 생성 함수
  const makeDescriptionMeta = () => {
    const meta = document.createElement("meta");
    meta.setAttribute("apple-mobile-web-app-capable", "yes");
    meta.setAttribute("referrer", "no-referrer");
    meta.setAttribute(
      "viewport",
      "minimum-scale=1.0, width=device-width, maximum-scale=1, user-scalable=no"
    );
    document.getElementsByTagName("head")[0].appendChild(meta);
  };

  useEffect(() => {
    makeDescriptionMeta();
  }, []);

  // 프로필 설정 함수
  const setProfile = () => {
    if (!location.state?.user?.name && !localStorage.getItem("name")) {
      const tempName = `User${Math.floor(Math.random() * 100000 + 5000)}`;
      localStorage.setItem("name", tempName);
      localStorage.setItem("login", "false");
      setProfileName(tempName);
    } else if (location.state?.user?.name) {
      localStorage.setItem("name", location.state?.user.name);
      setProfileName(location.state?.user.name);
      setPic(location.state?.user.picture || null);
      localStorage.setItem("login", "true");
    } else {
      setProfileName(localStorage.getItem("name"));
    }
  };

  // 비디오 데이터를 가져와 초기화하는 함수
  const fetchVideoData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MOD || ""}/api/getallvideo`
      );
      const sortedVideoList = response.data.sort((a, b) =>
        a.subcategory.localeCompare(b.subcategory)
      );
      setVideoList(sortedVideoList);

      const todayVideo = sortedVideoList.find((item) =>
        item.title.includes("Good Things")
      );
      setTodayVideo(todayVideo);

      // 데이터를 sessionStorage에 저장
      sessionStorage.setItem("videoList", JSON.stringify(sortedVideoList));
      sessionStorage.setItem("videoTimestamp", Date.now());
    } catch (error) {
      console.error("비디오 데이터를 가져오는 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    setProfile();

    // sessionStorage에서 현재 날짜와 비디오 초기화
    setCurrentDate(sessionStorage.getItem("currentDate") || 0);
    setCurrentVideo(sessionStorage.getItem("currentVideo") || 0);

    const videoListCache = sessionStorage.getItem("videoList");
    const cachedVideoList = JSON.parse(videoListCache || "[]");
    setVideoList(cachedVideoList);
    const todayVideo = cachedVideoList.find((item) =>
      item.title.includes("Good Things")
    );
    setTodayVideo(todayVideo);

    const fetchAndUpdateVideos = () => {
      fetchVideoData(() => {
        // 새로 가져온 비디오 리스트를 캐시된 비디오 리스트와 비교
        const newVideoList = sessionStorage.getItem("videoList");
        const isEqual =
          JSON.stringify(newVideoList) === JSON.stringify(cachedVideoList);

        if (!isEqual) {
          sessionStorage.setItem("videoList", JSON.stringify(newVideoList));
          sessionStorage.setItem("videoTimestamp", Date.now());
          setVideoList(newVideoList);

          // todayVideo를 새로 가져온 리스트에서 설정
          const todayVideo = newVideoList.find((item) =>
            item.title.includes("Good Things")
          );
          setTodayVideo(todayVideo);
        }
      });
    };

    fetchAndUpdateVideos();
  }, [location.state]);

  // 비디오 상세 페이지로 이동하는 함수
  const goToDetail = (link) => {
    if (link) {
      navigate("/detail", { state: { link } });
    }
  };

  // YouTube URL에서 비디오 ID를 추출하는 함수
  const getVideoId = (url) => {
    const videoId = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/
    )[1];
    return videoId;
  };

  // 칩 클릭 이벤트를 처리하고 비디오를 필터하는 함수
  const handleChipClick = (category, subcategory) => {
    setVisibleVideos({
      ...visibleVideos,
      [category]:
        groupByCategory(videoList)[category].subcategories[subcategory],
    });

    setSelectedSubcategories({
      ...selectedSubcategories,
      [category]: subcategory,
    });
  };

  // 비디오를 카테고리와 서브카테고리로 그룹화하는 함수
  const groupByCategory = (videoList) => {
    return videoList.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          subcategories: {},
          items: [],
        };
      }
      acc[item.category].items.push(item);
      if (!acc[item.category].subcategories[item.subcategory]) {
        acc[item.category].subcategories[item.subcategory] = [];
      }
      acc[item.category].subcategories[item.subcategory].push(item);
      acc[item.category].subcategories[item.subcategory].sort();
      return acc;
    }, {});
  };

  // 메모이제이션된 그룹화된 비디오 리스트
  const groupedVideoList = useMemo(
    () => groupByCategory(videoList),
    [videoList]
  );

  return (
    <div className="main-page">
      {/* 프로필 섹션 */}
      <header className="main-header">
        <div className="profile">
          {pic ? (
            <img
              src={pic || null}
              style={{ borderRadius: "999px" }}
              alt="Profile"
            />
          ) : (
            <object data={person}></object>
          )}
        </div>
        <div className="user-name">반가워요, {profileName}님</div>
      </header>

      {/* 사용자 통계 섹션 */}
      {localStorage.getItem("login") == "true" && (
        <nav>
          <div className="studied-wrapper">
            공부한 영상
            <div className="studied-number">
              <object data={videoPlayer}></object>
              {currentVideo}
            </div>
          </div>

          <div className="studied-wrapper">
            학습 일수
            <div className="studied-number">
              <object data={fire}></object>
              {currentDate}
            </div>
          </div>
        </nav>
      )}

      {/* 카테고리별 퀵메뉴 섹션 */}
      <div className="quick-menu-wrapper">
        {[
          { title: "억양별 영어", category: "미국" },
          { title: "동기부여 영어", category: "스타트업" },
          { title: "셀러브리티 영어", category: "셀러브리티 영어" },
        ].map((item, index) => {
          return (
            <Link to={`/video?catogory=${item.category}`}>
              <div key={index} className="quick-menu-container">
                <img src={quickMenuIcons[index]} alt={item.title} />
                <span>{item.title}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 오늘의 문장 섹션 (20240809 업데이트 후 제거) */}
      {/* <div className="today-sentence-wrapper">
        <h2>오늘의 문장🔮</h2>
        <div className="today-sentence">Good things don't come easy</div>
        <LongButton width={"240px"} onClick={() => goToDetail(todayVideo)}>
          관련 영상 보러 가기
        </LongButton>
      </div> */}

      {/* 비디오 탐색 섹션 */}
      <div className="explore-videos">
        {/* 비디오 카테고리들을 매핑 */}
        {Object.keys(groupedVideoList).map((category, key) => (
          <div key={key} className="category-container">
            <div className="video-category">{category}</div>

            {/* 각 카테고리 내 서브카테고리들을 매핑 */}
            <div className="subcategory-container">
              {Object.keys(groupedVideoList[category].subcategories)
                .filter((subcategory) => subcategory !== "none")
                .map((subcategory, index) => (
                  <div key={index}>
                    {/* 각 서브카테고리에 대한 칩 컴포넌트 렌더링 */}
                    <Chip
                      content={subcategory}
                      onClick={() => handleChipClick(category, subcategory)}
                      clicked={
                        selectedSubcategories[category] === subcategory ||
                        (selectedSubcategories[category] === undefined &&
                          index === 0)
                      }
                      filled={
                        selectedSubcategories[category] === subcategory ||
                        (selectedSubcategories[category] === undefined &&
                          index === 0)
                      }
                    />
                  </div>
                ))}
            </div>

            {/* 선택된 서브카테고리 또는 첫 번째 서브카테고리 기본으로 비디오 리스트 렌더링 */}
            <div className="explore-video-list">
              {visibleVideos[category]
                ? visibleVideos[category].map((item, index) => (
                    <div key={index} className="explore-video">
                      <div
                        className="explore-video-content"
                        onClick={() => goToDetail(item)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${getVideoId(
                            item.url
                          )}/0.jpg`}
                          alt={item}
                          width="250"
                          height="165"
                          style={{ borderRadius: "20px" }}
                        />
                      </div>
                      <div className="explore-video-title">{item.title}</div>
                    </div>
                  ))
                : groupedVideoList[category].subcategories[
                    Object.keys(groupedVideoList[category].subcategories)[0]
                  ].map((item, index) => (
                    <div key={index} className="explore-video">
                      <div
                        className="explore-video-content"
                        onClick={() => goToDetail(item)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${getVideoId(
                            item.url
                          )}/0.jpg`}
                          alt={item}
                          width="250"
                          height="165"
                          style={{ borderRadius: "20px" }}
                        />
                      </div>
                      <div className="explore-video-title">{item.title}</div>
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
