import React, { useState, useEffect, useRef, } from 'react';
import '../page/css/detailPage.css';
import LongButton from '../components/LongButton'
import { useNavigate, } from "react-router-dom";

const VideoDetail = ({ translations, url, step, autoPlay, onEnd, isModalOpen, setStep }) => {
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
  const [rewinded, setRewinded] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const refs = useRef([]);
  const scriptWrapperRef = useRef(null);


  //스텝 변경시
  useEffect(() => {
    stepRef.current = step;

    //비디오 맨 처음으로 돌아가기
    if (player) {
      player.seekTo(0, true);

      //AutoPlay 가 아닐 경우 멈춤 (디폴트)
      if (!autoPlay) {
        player.pauseVideo();
      }
    }
  }, [step]);


  useEffect(() => {
    const initializePlayer = () => {

      //비디오가 준비 되었을 경우
      const onPlayerReady = (event) => {

        //오토 플레이라면 자동 재생
        if (autoPlay) { event.target.playVideo(); }

        setPlayer(event.target);
        event.target.addEventListener('onStateChange', function () { });
      };

      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      new window.YT.Player(videoRef.current, {
        width: window.screen.width.toString(),
        height: '240',
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

    //비디오 초기화
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

    if (player && step !== 1) {
      intervalId = setInterval(() => {
        var currentTime = player.getCurrentTime();

        const activeIndex = translations.findIndex((script, index) => {
          const nextScriptStart = index + 1 < translations.length ? parseFloat(translations[index + 1].start) : Number.MAX_SAFE_INTEGER;
          let prevScriptStart = 0;
          if (index > 0) {
            prevScriptStart = index - 1 < translations.length ? parseFloat(translations[index - 1].start) : Number.MAX_SAFE_INTEGER;
          }
          const currentScriptStart = parseFloat(script.start);
          setNextStart(nextScriptStart + 0.1)
          setPrevStart(prevScriptStart + 0.1)
          return currentScriptStart <= currentTime && currentTime < nextScriptStart;
        });
        if (activeIndex !== activeScriptIndex) {
          setActiveScriptIndex(activeIndex);

          if(activeIndex===translations.length-1){
            setIsLast(true);
          }
          else{
            setIsLast(false);
          }
          if (activeIndex > 0) {
            
            setTimeout(() => {
              scriptWrapperRef.current.scrollTo({
                top: refs.current[activeIndex].offsetTop - scriptWrapperRef.current.offsetTop,
                behavior: 'smooth'
              })
            }, 10);
          }

          activeScriptIndexRef.current = activeIndex;
          repeatCountRef.current = 1;
          setProgress(100);
        }

        if (activeIndex !== -1 && repeatCountRef.current > 0) {
          const currentScript = translations[activeIndex];

          const scriptDur = parseFloat(currentScript.dur);
          const scriptEnd = parseFloat(currentScript.start) + scriptDur;


          if (step === 0) {

            if ((currentTime >= scriptEnd - 0.3 || (activeIndex === translations.length - 1 && currentTime + 5.5 >= scriptEnd))) {
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


                if (activeIndex === translations.length - 1) {
                  stepRef.current = stepRef.current + 1;
                  setStep(stepRef.current);
                }
              }, 1000 * scriptDur * 1.5 - 2.5);


              const progressDecrement = 100 / (1000 * scriptDur * 1.5 / 80);
              progressIntervalId = setInterval(() => {
                setProgress((prevProgress) => Math.max(0, prevProgress - progressDecrement));
              }, 80);

            }
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
        stepRef.current = stepRef.current + 1;

        setStep(stepRef.current)
      }

      if (stepRef.current === 2) {


      }

    };



  }

  //start 시점 복귀 함수 
  //start는 youtube API 에서 받은 response의 자막.start 그대로 사용
  const rewindVideoToScriptSegment = (start) => {
    if (player && !isShadowing) {
      const startTimeSeconds = parseFloat(start);
      setProgress(100);
      setRewinded(true);
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

      {step !== 1 ? <div className='bar-wrapper'><div className='shadowing-bar' style={{ width: `${progress}%` }}></div></div>
        : <></>}
      {step === 1 ?
        <div className='shadowing-guide'> <p> 자막 없이 영상을 들어보세요.</p>
        </div> : <></>}

      {step !== 1 && translations.length > 1 ? <div className='scripts-wrapper' ref={scriptWrapperRef}>

        {

          translations.map((item, key) => (
            <>
              <div className={`script`}
                onClick={() => rewindVideoToScriptSegment(item.start)}
                key={key}
                style={{ cursor: "pointer" }}

              >

                <div className='script-num-wrapper'>
                  <div className='script-num'
                    style={{
                      backgroundColor: activeScriptIndex === key ? '#903FF6' : '#ABABAB',
                      color: "white"
                    }}

                  >{key + 1}</div>
                </div>
                <ul style={{ margin: 0, padding: 0 }}>
                  <li className='script-content'
                    ref={(el) => (refs.current[key] = el)}
                    style={{ backgroundColor: key === activeScriptIndex ? "#F0E6FD" : "" }}
                  >

                    <div className='script-text'>{item.text}</div>

                    {step === 2 && key === activeScriptIndex ? <div className='script-translation'>{item.ko}</div> : <></>}
                  </li>
                </ul>

              </div>
            </>

          ))
        }

      </div>

        :
        <>{
          step === 0 && translations.length < 1 ? <div>로딩중...</div> : <></>
        }
        </>}
      <div className='video-bottom-nav'>
        {step === 2 && !isLast ? <><LongButton color="inactive" width="298px">학습 종료하기</LongButton></> :

          <></>
          // <div className='script-btn-wrapper'>
          //   <div className='script-btn script-prev-btn' onClick={() => {rewindVideoToScriptSegment(prevStart); setIsStopped(false);  player.playVideo(); clearInterval(currentProgressInterval);  setProgress(100); setActiveScriptIndex(Math.min(activeScriptIndex-1, 0))}}>
          //     <object data={arrowLeftWhite}></object>
          //   </div>
          //   <div></div>
          //   <div className='script-btn script-next-btn' onClick={() => {rewindVideoToScriptSegment(nextStart); setIsStopped(false);  player.playVideo(); clearInterval(currentProgressInterval); setProgress(100);  setActiveScriptIndex(Math.max(activeScriptIndex+1, translations.length))}}>
          //     <object data={arrowRightWhite}></object>
          //   </div>
          // </div>
        }

        {step === 2 && isLast ? <><LongButton color="purple" onClick={() => isModalOpen(true)} width="298px">학습 종료하기</LongButton></> :
          <></>}
      </div>
    </div>
  );
}

export default VideoDetail;