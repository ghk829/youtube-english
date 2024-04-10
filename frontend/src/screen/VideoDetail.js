import React, { useState, useEffect, useRef } from 'react';
import '../page/detailPage.css';

const VideoDetail = ({ scripts, url, step, isModalOpen }) => {
  const videoRef = useRef(null);

  const stages = [
    { title: '자막없이 풀기', type: "video" },
    { title: '쉐도잉하기', type: "video" },
    { title: '받아쓰기', type: "quiz" },
    { title: '다시 풀기', type: "video" }
]


useEffect(() => {
  const initializePlayer = () => {
    new window.YT.Player(videoRef.current, {
      width: '370',
      height: '219',
      videoId: url.split('=')[1],
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };

  if (window.YT && window.YT.Player) {
    initializePlayer();
  } else {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
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

const onPlayerStateChange = (event) => {
  if (step === 0 || step === 3) {
    if (event.data === window.YT.PlayerState.ENDED) {
      isModalOpen(true);
    }
  }
};


  return (
    <div className='video-detail'>
      <h3>STEP {step+1}: {stages[step].title}</h3>
      <div className='video-wrapper'>
        <div ref={videoRef}></div> 
      </div>
      {step===1? <div className='scripts-wrapper'>
        {
          scripts.map((item, key) => (
            <div className='script' key={key}>
              <div className='script-num'>{key + 1}/{scripts.length}</div>
              <div className='script-content'>{item}</div>
            </div>
          ))
        }
      </div>
      :
      <></>}
     
    </div>
  );
}

export default VideoDetail;
