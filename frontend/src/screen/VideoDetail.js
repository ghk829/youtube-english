import React, { useState, useEffect, useRef, } from 'react';
import '../page/css/detailPage.css';
import LongButton from '../components/LongButton'
import { useNavigate, } from "react-router-dom";
import arrowLeftWhite from '../img/icon/arrowLeftWhite.svg'
import arrowRightWhite from '../img/icon/arrowRightWhite.svg'

const VideoDetail = ({ translations, url, step, autoPlay, onEnd, isModalOpen }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const stepRef = useRef(step);
  const repeatCountRef = useRef(1);
  const [isStopped, setIsStopped] = useState(false);
  const [activeScriptIndex, setActiveScriptIndex] = useState(null);
  const [isShadowing, setIsShadowing] = useState(false);
  const [prevStart, setPrevStart] = useState(0)
  const [nextStart, setNextStart] = useState(0)
  const activeScriptIndexRef = React.useRef(null);
  const [progress, setProgress] = useState(100)
  const [currentProgressInterval, setCurrentProgressInterval] = useState(0);

  useEffect(() => {
    stepRef.current = step;

    if (player) {
      player.seekTo(0, true);
      if (!autoPlay) {
        player.pauseVideo();
      }
    }
  }, [step]);
  const goToLogin = () => {
    navigate("/login");
  };
  useEffect(() => {
    const initializePlayer = () => {

      const onPlayerReady = (event) => {

        if (autoPlay) { event.target.playVideo(); }


        setPlayer(event.target);
        event.target.addEventListener('onStateChange', function () { });
      };

      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      new window.YT.Player(videoRef.current, {
        width: '370',
        height: '219',
        videoId: videoId,
        playerVars: {
          showinfo: '0',
          controls: '1',
          autohide: '1',
          enablejsapi: '1',
          origin: "https://youtube-english-nine.vercel.app"
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = '//www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (window.YT && window.YT.Player) {
        if (videoRef.current && videoRef.current.destroy) {
          videoRef.current.destroy();
        }
      }
    };
  }, [url, step]);

  useEffect(() => {
    let intervalId;
    let progressIntervalId;

    if (player && step === 0) {
      intervalId = setInterval(() => {
        var currentTime = player.getCurrentTime();

        const activeIndex = translations.findIndex((script, index) => {
          const nextScriptStart = index + 1 < translations.length ? parseFloat(translations[index + 1].start) : Number.MAX_SAFE_INTEGER;
          let  prevScriptStart = 0;
          if (index > 0) {
            prevScriptStart = index -1 < translations.length ? parseFloat(translations[index - 1].start) : Number.MAX_SAFE_INTEGER;
          }
          const currentScriptStart = parseFloat(script.start);
          setNextStart(nextScriptStart+0.1)
          setPrevStart(prevScriptStart+0.1)
          return currentScriptStart <= currentTime && currentTime < nextScriptStart;
        });
        if (activeIndex !== activeScriptIndex) {
          setActiveScriptIndex(activeIndex);
          activeScriptIndexRef.current = activeIndex;
          repeatCountRef.current = 1;
          setProgress(100);
        }

        if (activeIndex !== -1 && repeatCountRef.current > 0) {
          const currentScript = translations[activeIndex];
          const scriptDur = parseFloat(currentScript.dur);
          const scriptEnd = parseFloat(currentScript.start) + scriptDur;

          if (currentTime >= scriptEnd - 0.3) {
            player.pauseVideo();
            setProgress(100);
            setIsStopped(true)
            setIsShadowing(true);
            repeatCountRef.current -= 1;

            setTimeout(() => {
              clearInterval(progressIntervalId);
              player.playVideo();
              setIsShadowing(false)
              setIsStopped(false)
              setProgress(0);
            }, 1000 * scriptDur * 1.5);
            const progressDecrement = 100 / (1000 * scriptDur * 1.5 / 80);
            progressIntervalId = setInterval(() => {
              setCurrentProgressInterval(progressIntervalId);
              setProgress((prevProgress) => Math.max(0, prevProgress - progressDecrement));
            }, 80);
          }
        }

      }, 200);
    }

    return () => clearInterval(intervalId);
  }, [player, translations, activeScriptIndex, step]);
  const onPlayerStateChange = (event) => {

    if (event.data === window.YT.PlayerState.ENDED) {
      onEnd();

      if (stepRef.current === 1) {

        isModalOpen(true);
      }

    }
  };

  const rewindVideoToScriptSegment = (start) => {
    if (player) {
      const startTimeSeconds = parseFloat(start);
      player.seekTo(startTimeSeconds, true);
      repeatCountRef.current = 1;
    }
  };
  return (
    <div className='video-detail'>
      {autoPlay ? <div>Auto Playing</div> : <></>}
      <div className='video-wrapper'>
        <div ref={videoRef}></div>
      </div>
      <div className='shadowing-guide'>
        {step === 0 && !isStopped ? <p> 1. 발음과 억양을 집중해서 들어보세요.</p> : <></>}
        {isShadowing && step === 0 && isStopped ? <p> 2. 10초 동안 영상을 똑같이 따라해 보세요.</p> : <></>}
        {step === 1 ? <p> 자막 없이 영상을 들어보세요.</p> : <></>}
      </div>
      {step === 0 && translations.length > 1 ? <div className='scripts-wrapper'>

        {

          translations.map((item, key) => (
            <>
              <div className={`script}`}
                key={key}
                style={{ cursor: "pointer" }}

              >
                <div className='script-content'>{key === activeScriptIndex ? item.text : <></>}</div>
                <div className='script-translation'>{key === activeScriptIndex ? item.translatedText : <></>}</div>

              </div>
            </>

          ))
        }

        {isStopped ? <div className='bar-wrapper'><div className='shadowing-bar' style={{ width: `${progress}%` }}></div></div> : <></>}

      </div>

        :
        <>{
          step === 0 && translations.length < 1 ? <div>로딩중...</div> : <></>
        }
        </>}
      <div className='video-bottom-nav'>
        {step === 1 ? <><LongButton onClick={() => isModalOpen(true)} width="298px">학습 종료하기</LongButton></> :


          <>
            <div className='script-btn script-prev-btn' onClick={() => {rewindVideoToScriptSegment(prevStart); setIsStopped(false);  player.playVideo(); clearInterval(currentProgressInterval);  setProgress(100); setActiveScriptIndex(Math.min(activeScriptIndex-1, 0))}}>
              <object data={arrowLeftWhite}></object>
            </div>
            <div className='script-btn script-next-btn' onClick={() => {rewindVideoToScriptSegment(nextStart); setIsStopped(false);  player.playVideo(); clearInterval(currentProgressInterval); setProgress(100);  setActiveScriptIndex(Math.max(activeScriptIndex+1, translations.length))}}>
              <object data={arrowRightWhite}></object>
            </div>
          </>}
      </div>
    </div>
  );
}

export default VideoDetail;