import React from 'react'
import '../screen/detailPage.css'

const VideoDetail = () => {
    const scripts =
        [{ eng: "Such a feeling is coming over me", kr: "번역번역번역번역번역번역번역번역번역번역번역번역" },
        { eng: "There is wonder in 'most everything I see", kr: "번역번번역번역번역번역번역번역번역번역번역번역번역번역역" },
        { eng: "Not a cloud in the sky", kr: "번번역번역번역번역번역번역번역번역번역번역번역번역역번역" },
        { eng: "Got the sun in my eyes", kr: "번역번역번역번역번역번역번역번역번역번역번역번역" },];

    return (
        <div className='video-detail'>
            <div className='video-wrapper'>
                <iframe width="370" height="239" src="https://www.youtube.com/embed/vupwAFMXLkA?si=GwqqEEp1bybdevPT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <div style={{ fontWeight: "bold" }}>임시 영상</div>
            </div>

            <div className='scripts-wrapper'>
                {
                    scripts.map((item, key) => (
                        <div className='script'>
                            <div className='script-num'>{key + 1}/{scripts.length}</div>
                            <div className='script-content'>{item.eng}</div>
                            <div className='script-content-translated'>{item.kr}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default VideoDetail;