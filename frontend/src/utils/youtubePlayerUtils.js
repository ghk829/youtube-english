// YouTube 플레이어 초기화 함수
export const initializePlayer = (url, videoRef, autoPlay, setPlayer, translations, onPlayerStateChange) => {
    const onPlayerReady = (event) => {
      if (autoPlay) {
        event.target.playVideo();  // 자동 재생 설정 시 비디오 재생
      }
      setPlayer(event.target);  // 플레이어 인스턴스 설정
    };
  
    // YouTube 비디오 ID 추출
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
  
    // YouTube 플레이어 생성
    new window.YT.Player(videoRef.current, {
      width: window.screen.width.toString(),  // 화면 너비에 맞게 너비 설정
      height: '240',
      videoId: videoId,  // 비디오 ID 설정
      playerVars: {
        showinfo: '0',  // 정보 표시 제거
        controls: '1',  // 컨트롤러 표시
        autohide: '1',  // 비디오 재생 중에 컨트롤러 숨기기
        enablejsapi: '1',  // JavaScript API 활성화
        origin: "https://youtube-english-nine.vercel.app"  // 허용된 오리진 설정
      },
      events: {
        'onReady': onPlayerReady,  // 플레이어 준비 이벤트
        'onStateChange': onPlayerStateChange,  // 플레이어 상태 변화 이벤트
      }
    });
  };
  
  // YouTube API 로딩 함수
  export const loadYouTubeAPI = (initializePlayer) => {
    if (window.YT && window.YT.Player) {
      initializePlayer();  // 이미 로드되어 있으면 플레이어 초기화
    } else {
      const tag = document.createElement('script');
      tag.src = '//www.youtube.com/iframe_api';  // YouTube API 스크립트 URL 설정
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);  // 스크립트 삽입
      window.onYouTubeIframeAPIReady = initializePlayer;  // API 준비시 플레이어 초기화
    }
  };
  
  // YouTube 플레이어 제거 함수
  export const destroyPlayer = (player) => {
    if (player && player.destroy) {
      player.destroy();  // 컴포넌트 언마운트시 플레이어 제거
    }
  };
  
  // 스크립트 변경 및 진행 상태 처리 함수
  export const handleScriptChange = (player, translations, activeScriptIndex, step, setStep, setActiveScriptIndex, setIsLast, scriptWrapperRef, refs, repeatCountRef, setProgress, setIsShadowing, stepRef) => {
    let intervalId;
    let progressIntervalId;
  
    if (player && step !== 1) {
      intervalId = setInterval(() => {
        const currentTime = player.getCurrentTime();
  
        const activeIndex = translations.findIndex((script, index) => {
          const nextScriptStart = index + 1 < translations.length ? parseFloat(translations[index + 1].start) : Number.MAX_SAFE_INTEGER;
          const currentScriptStart = parseFloat(script.start);
          return currentScriptStart <= currentTime && currentTime < nextScriptStart;
        });
  
        if (activeIndex !== activeScriptIndex) {
          setActiveScriptIndex(activeIndex);  // 활성화된 자막 인덱스 업데이트
  
          setIsLast(activeIndex === translations.length - 1);  // 마지막 자막 여부 업데이트
  
          if (activeIndex > 0) {
            setTimeout(() => {
              scriptWrapperRef.current.scrollTo({
                top: refs.current[activeIndex].offsetTop - scriptWrapperRef.current.offsetTop,
                behavior: 'smooth'
              });
            }, 10);
          }
  
          repeatCountRef.current = 1;  // 반복 횟수 초기화
          setProgress(100);  // 진행률 초기화
        }
  
        if (activeIndex !== -1 && repeatCountRef.current > 0) {
          const currentScript = translations[activeIndex];
          const scriptDur = parseFloat(currentScript.dur);
          const scriptEnd = parseFloat(currentScript.start) + scriptDur;
  
          if (step === 0 && (currentTime >= scriptEnd - 0.3 || (activeIndex === translations.length - 1 && currentTime + 5.5 >= scriptEnd))) {
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
                setStep(stepRef.current);  // 스텝 증가
              }
            }, 1000 * scriptDur * 1.5 - 2.5);
  
            const progressDecrement = 100 / (1000 * scriptDur * 1.5 / 80);
            progressIntervalId = setInterval(() => {
              setProgress((prevProgress) => Math.max(0, prevProgress - progressDecrement));
            }, 80);
          }
        }
      }, 200);
    }
  
    return () => clearInterval(intervalId);
  };
  
  // 비디오 상태 변경 처리 함수
  export const handlePlayerStateChange = (event, onEnd, stepRef, setStep) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      onEnd();
  
      if (stepRef.current === 1) {
        stepRef.current += 1;
        setStep(stepRef.current);
      }
    }
  };
  
  // 자막 위치로 비디오 돌리기 함수
  export const rewindVideoToScriptSegment = (player, isShadowing, setProgress, repeatCountRef, start) => {
    if (player && !isShadowing) {
      const startTimeSeconds = parseFloat(start);
      setProgress(100);
      player.seekTo(startTimeSeconds, true);
      repeatCountRef.current = 1;
    }
  };
  