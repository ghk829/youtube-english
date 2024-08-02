import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/detailPage.css";
import Modal from "../components/Modal";
import VideoDetail from "../screen/VideoDetail";
import arrowLeft from "../img/icon/arrowLeft.svg";
import WordToast from "../components/WordList/WordToast.tsx";

const DetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [step, setStep] = useState(0);
  const [subtitles, setSubtitles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("login") === "true" || false
  );
  const [selectedWord, setSelectedWord] = useState("");

  // 각 단계의 타이틀과 타입을 정의한 배열
  const stages = [
    { title: "쉐도잉하기", type: "title" },
    { title: "자막 없이 보기", type: "no_title" },
    { title: "자막이랑 보기", type: "title" },
  ];

  // 메인 페이지로 이동하는 함수
  const goToMain = () => {
    navigate("/");
  };

  // 모달을 닫고, 마지막 단계일 경우 방문 날짜를 기록하는 함수
  const closeModal = () => {
    setIsModalOpen(false);
    if (step === stages.length - 1) {
      const lastVisitDate = new Date(localStorage.getItem("lastVisitDate"));
      const today = new Date();

      if (lastVisitDate && today.getDate() !== lastVisitDate.getDate()) {
        const newVideo = parseInt(localStorage.getItem("currentDate")) + 1;
        localStorage.setItem("currentDate", newVideo.toString());

        localStorage.setItem("lastVisitDate", today.toISOString());
        localStorage.setItem(
          "currentVideo",
          parseInt(localStorage.getItem("currentVideo") + 1)
        );
      }
    }
  };

  // location.state가 변경될 때마다 유튜브 링크와 자막을 설정하는 useEffect
  useEffect(() => {
    setYoutubeLink(location.state?.link.url);
    setSubtitles(location.state?.link.subtitles);
  }, [location.state]);

  return (
    <div className="detail-page">
      {/* 페이지 헤더 */}
      <header style={{ display: "flex", justifyContent: "center" }}>
        <div className="return-btn" onClick={goToMain}>
          <object data={arrowLeft} onClick={goToMain}></object>
        </div>
        <h2 style={{ maxWidth: "250px", textAlign: "center" }}>
          {location.state?.link.title.slice(0, 25)}...
        </h2>
      </header>

      {/* 진행 단계 표시 */}
      <div className="steps-header">
        {stages.map((item, key) => (
          <div className="step" key={key}>
            <div
              className="step-num"
              style={{
                backgroundColor: step >= key ? "#903FF6" : "#F0E6FD",
                color: step >= key ? "white" : "#E2CEFC",
              }}
            >
              {key + 1}
            </div>
            {key < stages.length - 1 && (
              <div
                className="step-bar"
                style={{
                  backgroundColor: step > key ? "#903FF6" : "#F0E6FD",
                  position: "relative",
                  top: "-30%",
                  left: `${(key + 1 * 120) / stages.length}%`,
                }}
              />
            )}
            <div
              className="step-content"
              style={{
                color: step >= key ? "#333333" : "#ABABAB",
              }}
            >
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* 비디오 디테일 wrapper */}
      <div className="detail-type-wrapper">
        {youtubeLink && (
          <VideoDetail
            onEnd={closeModal}
            url={youtubeLink}
            translations={subtitles}
            autoPlay={location.state?.autoPlay}
            step={step}
            setStep={setStep}
            isModalOpen={setIsModalOpen}
            setSelectedWord={setSelectedWord}
          ></VideoDetail>
        )}
      </div>

      {/* 모달 오픈 여부에 따라 모달 컴포넌트 렌더링 */}
      {isModalOpen && <Modal onClose={closeModal} isLoggedIn={isLoggedIn} />}

      {searchParams.get("modal") === "word-toast" && (
        <WordToast word={selectedWord} />
      )}
    </div>
  );
};

export default DetailPage;
