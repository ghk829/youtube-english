import React, { useState, useEffect } from 'react';
import '../page/detailPage.css'

const VideoDetail = ({ scripts, url }) => {



  useEffect(() => {
  }, []);

  return (
    <div className='video-detail'>
      <div className='video-wrapper' style={{ width: "370px", height: "219px" }}>
        <iframe
          width="370"
          height="219"
          style={{}}
          src={`https://www.youtube.com/embed/${url.split('=')[1]}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="unsafe-url"
          allowFullScreen>
        </iframe>

      </div>

      <div className='scripts-wrapper'>
        {
          scripts.map((item, key) => (
            <div className='script'>
              <div className='script-num'>{key + 1}/{scripts.length}</div>
              <div className='script-content'>{item}</div>
              {/* <div className='script-content-translated'>{item.kr}</div> */}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default VideoDetail;