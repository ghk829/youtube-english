import React, { useState, useEffect, useRef } from 'react';
import '../page/detailPage.css';

const VideoDetail = ({ scripts, translations, url, step, isModalOpen, autoPlay }) => {
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [displayedScripts, setDisplayedScripts] = useState([]);
  const [endScriptTime, setEndScriptTime] = useState(null);
  const [translatedScripts, setTranslatedScripts] = useState([]);
  const stepRef = useRef(step);
  const endScriptTimeRef = useRef(endScriptTime);
  const repeatCountRef = useRef(0);
  const durRef = useRef(0);
  const translatedScriptsRef= useRef([]);

  const [isLoading, setIsLoading] = useState(false);



  const stages = [
    { title: '쉐도잉하기', type: "video" },
    { title: '받아쓰기', type: "quiz" },
    { title: '다시 풀기', type: "video" }
  ]

  useEffect(() => {
    stepRef.current = step;

    if (player) {
      player.seekTo(0, true);
      if(!autoPlay){
        player.pauseVideo();
      }

    }

    endScriptTimeRef.current = endScriptTime;
  }, [step, endScriptTime]);

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
          controls: '0',
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

    if (player && step === 1) {

      intervalId = setInterval(() => {
        const currentTime = player.getCurrentTime();
        const newScripts = translatedScriptsRef.current.filter(script => {
          const scriptTime = script.start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          return scriptTime <= currentTime && !displayedScripts.includes(script);
        });

        if (newScripts.length > 0) {
          setDisplayedScripts([...displayedScripts, ...newScripts]);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [player, scripts, translatedScriptsRef, displayedScripts, step]);

  const onPlayerStateChange = (event) => {

    if (stepRef.current === 0 || stepRef.current === 2) {
      if (event.data === window.YT.PlayerState.ENDED) {
        isModalOpen(true);
      }
    }

    if (event.data === window.YT.PlayerState.PLAYING) {
      if (endScriptTimeRef.current && repeatCountRef.current > 0) {
        const checkEndTimeAndPause = () => {
          const currentTime = event.target.getCurrentTime();
          if (currentTime >= endScriptTimeRef.current - 0.6) {
            event.target.pauseVideo();

            setTimeout(() => {
              if (event.target) {
                if (repeatCountRef.current > 0) {

                  if (repeatCountRef.current > 1) {
                    event.target.seekTo(endScriptTimeRef.current - parseFloat(endScriptTimeRef.current) - parseFloat(durRef), true);
                  }
                  event.target.playVideo();
                  repeatCountRef.current -= 1;
                  if (repeatCountRef.current <= 0) {

                    setEndScriptTime(null);
                  }
                } else {
                  event.target.playVideo();
                }
              }
            }, 4500);
            clearInterval(intervalId);
          }
        };

        const intervalId = setInterval(checkEndTimeAndPause, 1000);
      }
    }
  };

  const rewindVideoToScriptSegment = (start, dur) => {
    if (player) {
      player.playVideo();
      const startTimeSeconds = parseFloat(start);
      const durationSeconds = parseFloat(dur);
      durRef.current = dur;
      const endTimeSeconds = startTimeSeconds + durationSeconds;
      player.seekTo(startTimeSeconds, true);
      setEndScriptTime(endTimeSeconds);
      repeatCountRef.current = 2;
    }
  }

  return (
    <div className='video-detail'>
      {autoPlay ? <div>Auto Playing</div> : <></>}
      <h3>STEP {step + 1}: {stages[step].title}</h3>
      <div className='video-wrapper'>
        <div ref={videoRef}></div>
      </div>


      {step ===0 && translations.length>1? <div className='scripts-wrapper'>
        {
          translations.map((item, key) => (
            <div className='script' key={key}
              onClick={() => rewindVideoToScriptSegment(item.start, item.dur)}
              style={{ cursor: "pointer" }}

            >
              <div className='script-num'>{key + 1}/{translations.length}</div>
              <div className='script-content' style={{ fontWeight: "bold" }}>{item.text}</div>
              <div className='script-translation'>{item.translatedText}</div>

            </div>
          ))
        }
      </div>
        :
        <>{
          step === 0 && translations.length<1 ? <div>로딩중...</div> : <></>
        }
        </>}

    </div>
  );
}

export default VideoDetail;