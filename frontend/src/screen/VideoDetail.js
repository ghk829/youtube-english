import React, { useState, useEffect, useRef } from 'react';
import '../page/detailPage.css';

const VideoDetail = ({ scripts, translations, url, step, isModalOpen, autoPlay}) => {
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [displayedScripts, setDisplayedScripts] = useState([]);
  const [endScriptTime, setEndScriptTime] = useState(null);
  const [translatedJson, setTranslatedJson] = useState([])
  const [translatedScripts, setTranslatedScripts] = useState([]);
  const stepRef = useRef(step);
  const endScriptTimeRef = useRef(endScriptTime);
  const repeatCountRef = useRef(0); 
  const durRef = useRef(0);
  
  const [isLoading, setIsLoading] = useState(false);

  

  const stages = [
    { title: '자막없이 풀기', type: "video" },
    { title: '쉐도잉하기', type: "video" },
    { title: '받아쓰기', type: "quiz" },
    { title: '다시 풀기', type: "video" }
  ]

  
  const generateQuiz = async () => {

    if(translations.length>0)
      {
    try {
      console.log("번역 JSON parse중")
      setTranslatedJson(JSON.parse(translations).data);
    } catch (error) {
      console.error('번역 생성 중 오류:', error);
      alert('번역을 생성하는 데 실패했습니다.');
    } finally {
    }}
  };
  useEffect(() => {
    generateQuiz();
  }, [translations]);


  useEffect(() => {
    stepRef.current = step;
    endScriptTimeRef.current = endScriptTime;
  }, [step, endScriptTime]);
  
  useEffect(() => {
    const initializePlayer = () => {
      
      const onPlayerReady = (event) => {
        
        if(autoPlay)
{        event.target.playVideo();}
        setPlayer(event.target);
        event.target.addEventListener('onStateChange', function(){});
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
                  enablejsapi:'1',
                  origin:"https://youtube-english-nine.vercel.app"
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

    const mergeScriptsAndTranslations = () => {
      const merged = scripts.map(script => {
        const translation = translatedJson.find(t => t.sentence.includes(script.text));
        return {
          ...script,
          translatedText: translation ? translation.translated_sentence : ""
        };
      });
      let newMerged = [];
      let previous = null;
  
      for (let i = 0; i < merged.length; i++) {
        if (i !== merged.length - 1) {
          if (merged[i].translatedText === "" || merged[i].translatedText === merged[i + 1].translatedText) {
            previous = {
              ...merged[i],
              text: previous ? previous.text + " " + merged[i].text : merged[i].text + " " + merged[i + 1].text,
              translatedText: merged[i + 1].translatedText 
            };
          } else {
            if (previous) {
              newMerged.push(previous);
              previous = null;
            } else {
              newMerged.push(merged[i]);
            }
          }
        } else {
          // 마지막 요소는 항상 추가
          if (previous) {
            // 마지막 요소가 이전 요소와 합쳐져야 할 경우
            newMerged.push({
              ...previous,
              text: previous.text + " " + merged[i].text
            });
          } else {
            // 마지막 요소가 단독으로 추가될 경우
            newMerged.push(merged[i]);
          }
        }
      }
  
      setTranslatedScripts(newMerged);
    };
  
    if (scripts && translatedJson) {
      mergeScriptsAndTranslations();
    }
    if (scripts && translatedJson) {
      setIsLoading(true);
      mergeScriptsAndTranslations();
      console.log("번역완")
      console.log(translatedScripts)
      
      if(translatedScripts.length<8 && translatedScripts.length>2){
      setIsLoading(false);}
    }
  }, [scripts, translatedJson]);
  useEffect(() => {
    
    let intervalId;

    if (player && step === 1) {

      intervalId = setInterval(() => {
        const currentTime = player.getCurrentTime();
        const newScripts = scripts.filter(script => {
          const scriptTime = script.start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          return scriptTime <= currentTime && !displayedScripts.includes(script);
        });

        if (newScripts.length > 0) {
          setDisplayedScripts([...displayedScripts, ...newScripts]);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [player, scripts, displayedScripts, step]);

const onPlayerStateChange = (event) => {
  
  if (stepRef.current === 0 || stepRef.current === 3) {
    if (event.data === window.YT.PlayerState.ENDED) {
      isModalOpen(true);
    }
  }




  if (event.data === window.YT.PlayerState.PLAYING) {
    if(endScriptTimeRef.current && repeatCountRef.current > 0) {
      const checkEndTimeAndPause = () => {
        const currentTime = event.target.getCurrentTime();
        if (currentTime >= endScriptTimeRef.current-0.6) {
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
    durRef.current=dur;
    const endTimeSeconds = startTimeSeconds + durationSeconds;
    player.seekTo(startTimeSeconds, true);
    setEndScriptTime(endTimeSeconds);
    repeatCountRef.current = 2; 
  }
}
  
  return (
    <div className='video-detail'>
      {autoPlay?<div>Auto Playing</div>:<></>}
      <h3>STEP {step + 1}: {stages[step].title}</h3>
      <div className='video-wrapper'>
        <div ref={videoRef}></div>
      </div>

      
      {step === 1  && !isLoading ?<div className='scripts-wrapper'>
        {
          translatedScripts.map((item, key) => (
            <div className='script' key={key}
            onClick={() => rewindVideoToScriptSegment(item.start, item.dur)}
            style={{cursor: "pointer"}}

            >
              <div className='script-num'>{key + 1}/{translatedScripts.length}</div>
              <div className='script-content' style={{fontWeight:"bold"}}>{item.text}</div>
              <div className='script-translation'>{item.translatedText}</div> 

            </div>
          ))
        }
      </div>
        :
        <>{
          step===1 && isLoading ? <div>로딩중...</div>:<></>
        }
        </>}


    </div>
  );
}

export default VideoDetail;