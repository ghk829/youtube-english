import React, { useState, useEffect } from 'react';
import axios from 'axios'
import '../page/detailPage.css'

const VideoDetail = ({scripts}) => {

  

  useEffect(() => {
}, []); 

    return (
        <div className='video-detail'>
            <div className='video-wrapper' style={{width: "370px", height:"219px"}}>
            <iframe width="370" height="219" src="https://www.youtube.com/embed/MBRqu0YOH14?si=l1753_Z1cySEV5Ym" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>                <div style={{ fontWeight: "bold" }}>임시 영상</div>
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