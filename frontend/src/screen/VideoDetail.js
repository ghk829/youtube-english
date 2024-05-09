import React, { useState, useEffect, useRef } from 'react';
import '../page/detailPage.css';

const VideoDetail = ({ scripts, translations, url, step, isModalOpen, autoPlay }) => {
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
  const translatedScriptsRef= useRef([]);

  const [isLoading, setIsLoading] = useState(false);



  const stages = [
    { title: '자막없이 풀기', type: "video" },
    { title: '쉐도잉하기', type: "video" },
    { title: '받아쓰기', type: "quiz" },
    { title: '다시 풀기', type: "video" }
  ]


  const generateQuiz = async () => {

    if (translations.length > 0) {
      try {
        console.log("번역 JSON parse중")
        setTranslatedJson(JSON.parse(translations).data);
      } catch (error) {
        console.error('번역 생성 중 오류:', error);
        alert('번역을 생성하는 데 실패했습니다.');
      } finally {
      }
    }
  };
  useEffect(() => {
    generateQuiz();
  }, [translations]);


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
    const findTranslation = (script, translatedJson) => {
      if(script)
      {
        const usedTranslations = new Set();

        const toUniqueWords = (sentence) => {
        return [...new Set(sentence.split(/\s+/))];
      };

      const originalWords = toUniqueWords(script.text);

      for (let t of translatedJson) {
        
      if (usedTranslations.has(t.sentence)) {
        continue;
      }
        const translatedWords = toUniqueWords(t.sentence);
        const commonWordsCount = originalWords.filter(word => translatedWords.includes(word)).length;

        if (commonWordsCount >= 5) {
          usedTranslations.add(t.sentence);

          return t;
        }
      }
}
      return null;
    };

    const mergeScriptsAndTranslations = () => {
      console.log(" 자막 내역")
      console.log(scripts)

      console.log(" json 내역")
      console.log(translatedJson)

      if(scripts){
      const merged = scripts.map(script => {
        const translation = findTranslation(script, translatedJson);
        return {
          ...script,
          translatedText: translation ? translation.translated_sentence : "없음"
        };
      });
      let newMerged = [];
      let previous = null;

      for (let i = 0; i < merged.length; i++) {
        if (i !== merged.length - 1) {
          if (merged[i].translatedText === "없음" || merged[i].translatedText === merged[i + 1].translatedText) {
            previous = {
              ...merged[i],
              text: previous ? previous.text + " " + merged[i].text : merged[i].text + " " + merged[i + 1].text,
              translatedText: merged[i + 1].translatedText,
              start: previous ? previous.start : merged[i].start
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
          if (previous) {
            newMerged.push({
              ...previous,
              text: previous.text + " " + merged[i].text
            });
          } else {
            newMerged.push(merged[i]);
          }
        }
      }

      console.log(" translated script")
      console.log(newMerged)
      
      setTranslatedScripts(newMerged);
      translatedScriptsRef.current=newMerged;
    }
    };


    if (scripts && translatedJson.length>0) {
      setIsLoading(true);
      mergeScriptsAndTranslations();
      console.log("번역 패치 완료")
      console.log(translatedScriptsRef.current)

      if ( translatedScriptsRef.current.length > 1) {
        setIsLoading(false);
      }
    }
  }, [scripts, translatedJson]);
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

    if (stepRef.current === 0 || stepRef.current === 3) {
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


      {step === 1 && !isLoading ? <div className='scripts-wrapper'>
        {
          displayedScripts.map((item, key) => (
            <div className='script' key={key}
              onClick={() => rewindVideoToScriptSegment(item.start, item.dur)}
              style={{ cursor: "pointer" }}

            >
              <div className='script-num'>{key + 1}/{translatedScripts.length}</div>
              <div className='script-content' style={{ fontWeight: "bold" }}>{item.text}</div>
              <div className='script-translation'>{item.translatedText}</div>

            </div>
          ))
        }
      </div>
        :
        <>{
          step === 1 && isLoading ? <div>로딩중...</div> : <></>
        }
        </>}


    </div>
  );
}

export default VideoDetail;