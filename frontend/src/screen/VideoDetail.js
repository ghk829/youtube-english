import React, { useState, useEffect, useRef } from "react";
import "../page/css/detailPage.css";
import LongButton from "../components/LongButton";
import { useNavigate } from "react-router-dom";
import SubtitleBlock from "../components/WordList/SubtitleBlock.tsx";
import ReactGA from "react-ga4";

const VideoDetail = ({
  translations,
  url,
  step,
  autoPlay,
  onEnd,
  isModalOpen,
  setStep,
  setSelectedWord,
}) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const stepRef = useRef(step);
  const [activeScriptIndex, setActiveScriptIndex] = useState(null);
  const [isShadowing, setIsShadowing] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isLast, setIsLast] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isFirstStart, setIsFirstStart] = useState(true); // 비디오가 처음 시작되었는지 여부 추적 (GA)

  const scriptWrapperRef = useRef(null);
  const repeatCountRef = useRef(1);

  const refs = useRef([]); // 자막 항목을 참조하기 위한 배열 useRef

  // 창 크기 변경 이벤트 처리
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      if (player) {
        player.setSize(window.innerWidth, 240); // 화면 너비에 맞게 설정
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [player]);

  // YouTube 플레이어 초기화 및 관리
  useEffect(() => {
    const initializePlayer = () => {
      const onPlayerReady = (event) => {
        if (autoPlay) {
          event.target.playVideo(); // 자동 재생이 설정되어 있으면 비디오 재생
        }
        setPlayer(event.target); // 플레이어 인스턴스 설정
      };

      // YouTube 비디오 ID 추출
      const videoIdMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      // YouTube 플레이어 생성
      new window.YT.Player(videoRef.current, {
        width: window.innerWidth.toString(), // 화면 너비에 맞게 너비 설정
        height: "240",
        videoId: videoId, // 비디오 ID 설정
        playerVars: {
          showinfo: "0", // 정보 표시 제거
          controls: "1", // 컨트롤러 표시
          autohide: "1", // 비디오 재생 중에 컨트롤러 숨기기
          enablejsapi: "1", // JavaScript API 활성화
          origin: "https://youtube-english-nine.vercel.app", // 허용된 오리진 설정
        },
        events: {
          onReady: onPlayerReady, // 플레이어 준비 이벤트
          onStateChange: onPlayerStateChange, // 플레이어 상태 변화 이벤트
        },
      });
    };

    // YouTube API 스크립트 로딩
    if (window.YT && window.YT.Player) {
      initializePlayer(); // 이미 로드되어 있으면 플레이어 초기화
    } else {
      const tag = document.createElement("script");
      tag.src = "//www.youtube.com/iframe_api"; // YouTube API 스크립트 URL 설정
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); // 스크립트 삽입
      window.onYouTubeIframeAPIReady = initializePlayer; // API 준비시 플레이어 초기화
    }

    return () => {
      if (player && player.destroy) {
        player.destroy(); // 컴포넌트 언마운트시 플레이어 제거
      }
    };
  }, [url, autoPlay]);

  // 스크립트 변경 및 진행 상태 처리
  useEffect(() => {
    let intervalId;
    let progressIntervalId;

    if (player && step !== 1) {
      intervalId = setInterval(() => {
        const currentTime = player.getCurrentTime();

        const activeIndex = translations.findIndex((script, index) => {
          const nextScriptStart =
            index + 1 < translations.length
              ? parseFloat(translations[index + 1].start)
              : Number.MAX_SAFE_INTEGER;
          const currentScriptStart = parseFloat(script.start);
          return (
            currentScriptStart <= currentTime && currentTime < nextScriptStart
          );
        });

        if (activeIndex !== activeScriptIndex) {
          setActiveScriptIndex(activeIndex); // 활성화된 자막 인덱스 업데이트

          setIsLast(activeIndex === translations.length - 1); // 마지막 자막 여부 업데이트

          if (activeIndex > 0) {
            setTimeout(() => {
              scriptWrapperRef.current.scrollTo({
                top:
                  refs.current[activeIndex].offsetTop -
                  scriptWrapperRef.current.offsetTop,
                behavior: "smooth",
              });
            }, 10);
          }

          repeatCountRef.current = 1; // 반복 횟수 초기화
          setProgress(100); // 진행률 초기화
        }

        if (activeIndex !== -1 && repeatCountRef.current > 0) {
          const currentScript = translations[activeIndex];
          const scriptDur = parseFloat(currentScript.dur);
          const scriptEnd = parseFloat(currentScript.start) + scriptDur;

          if (
            step === 0 &&
            (currentTime >= scriptEnd - 0.3 ||
              (activeIndex === translations.length - 1 &&
                currentTime + 5.5 >= scriptEnd))
          ) {
            player.pauseVideo();
            setProgress(100);
            setIsShadowing(true);
            repeatCountRef.current -= 1;

            setTimeout(() => {
              clearInterval(progressIntervalId);
              player.playVideo();
              setIsShadowing(false);
              setProgress(0);

              if (activeIndex === translations.length - 1) {
                stepRef.current = stepRef.current + 1;
                setStep(stepRef.current); // 스텝 증가
              }
            }, 1000 * scriptDur * 1.5 - 2.5);

            const progressDecrement = 100 / ((1000 * scriptDur * 1.5) / 80);
            progressIntervalId = setInterval(() => {
              setProgress((prevProgress) =>
                Math.max(0, prevProgress - progressDecrement)
              );
            }, 80);
          }
        }
      }, 200);
    }

    return () => clearInterval(intervalId);
  }, [player, translations, activeScriptIndex, step, setStep]);

  // 비디오 상태 변경 처리
  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      if (isFirstStart) {
        ReactGA.event({
          action: "first-video-start",
          label: "first-video-start",
        });
        setIsFirstStart(false);
      }
    }
    if (event.data === window.YT.PlayerState.ENDED) {
      if (stepRef.current === 0) {
        ReactGA.event({
          action: "first-video-end",
          label: "first-video-end",
        });
      }
      onEnd();

      if (stepRef.current === 1) {
        stepRef.current += 1;
        setStep(stepRef.current);
      }
    }
  };

  // 자막 위치로 비디오 돌리기
  const rewindVideoToScriptSegment = (start) => {
    if (player && !isShadowing) {
      const startTimeSeconds = parseFloat(start);
      setProgress(100);
      player.seekTo(startTimeSeconds, true);
      repeatCountRef.current = 1;
    }
  };

  // 단어 클릭 => 단어 모달 열기
  const handleWordClick = (word) => {
    setSelectedWord(word);
    openWordToast();
  };

  // 단어 학습 토스트 열기
  const openWordToast = () => {
    navigate("?modal=word-toast");
  };

  return (
    <div className="video-detail">
      {/* 자동 재생 중인 경우 메시지 표시 */}
      {autoPlay ? <div>자동 재생 중</div> : null}

      <div className="video-wrapper">
        <div ref={videoRef}></div> {/* 비디오 플레이어 요소 */}
      </div>

      {/* 첫 번째 단계가 아닌 경우 진행 바 표시 */}
      {step !== 1 && (
        <div className="bar-wrapper">
          <div
            className="shadowing-bar"
            style={{ width: `${progress}%` }}
          ></div>{" "}
          {/* 섀도잉 진행률 */}
        </div>
      )}

      {/* 첫 번째 단계인 경우 가이드 메시지 표시 */}
      {step === 1 && (
        <div className="shadowing-guide">
          <p>자막 없이 영상을 들어보세요.</p>
        </div>
      )}

      {/* 스크립트 표시 */}
      {step !== 1 && translations.length > 1 && (
        <div className="scripts-wrapper" ref={scriptWrapperRef}>
          {/* 각 자막 항목 매핑 */}
          {translations.map((item, key) => (
            <div
              className={`script`}
              key={key}
              onClick={() => rewindVideoToScriptSegment(item.start)}
              style={{ cursor: "pointer" }}
            >
              <div className="script-num-wrapper">
                {/* 자막 번호 표시 */}
                <div
                  className="script-num"
                  style={{
                    backgroundColor:
                      activeScriptIndex === key ? "#903FF6" : "#ABABAB",
                    color: "white",
                  }}
                >
                  {key + 1}
                </div>
              </div>
              <ul style={{ margin: 0, padding: 0 }}>
                <li
                  className="script-content"
                  ref={(el) => (refs.current[key] = el)}
                  style={{
                    backgroundColor: key === activeScriptIndex ? "#F0E6FD" : "",
                  }}
                >
                  {/* 자막 텍스트 표시 */}
                  <SubtitleBlock
                    text={item.text}
                    onWordClick={handleWordClick}
                  />
                  {/* 두 번째 단계이고 활성화된 자막인 경우 번역 텍스트 표시 */}
                  {step === 2 && key === activeScriptIndex && (
                    <div className="script-translation">{item.ko}</div>
                  )}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 로딩 중 메시지 */}
      {step === 0 && translations.length < 1 && <div>로딩중...</div>}

      <div className="video-bottom-nav">
        {/* 두 번째 단계이고 마지막 자막이 아닌 경우 종료 버튼 표시 */}
        {step === 2 && !isLast && (
          <LongButton color="inactive" width="298px">
            학습 종료하기
          </LongButton>
        )}

        {/* 두 번째 단계이고 마지막 자막인 경우 모달 열기 버튼 표시 */}
        {step === 2 && isLast && (
          <LongButton
            color="purple"
            onClick={() => isModalOpen(true)}
            width="298px"
          >
            학습 종료하기
          </LongButton>
        )}
      </div>
    </div>
  );
};
export default VideoDetail;
