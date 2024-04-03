import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './detailPage.css'
import Modal from '../common/Modal';

const DetailPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const stages = ["자막없이 풀기", "쉐도잉하기", "받아쓰기", "다시 풀기"];

    //임시 스크립트
    const scripts =
        [{ eng: "Such a feeling is coming over me", kr: "번역번역번역번역번역번역번역번역번역번역번역번역" },
        { eng: "There is wonder in 'most everything I see", kr: "번역번번역번역번역번역번역번역번역번역번역번역번역번역역" },
        { eng: "Not a cloud in the sky", kr: "번번역번역번역번역번역번역번역번역번역번역번역번역역번역" },
        { eng: "Got the sun in my eyes", kr: "번역번역번역번역번역번역번역번역번역번역번역번역" },];

    const goToMain = () => {
        navigate("/");
    };

    return (
        <div className='detail-page'>
            <div className='steps-header'>

                {
                    stages.map((item, key) => (
                        <div className='step'>
                            <div className='step-num'>{key}</div>
                            <div className='step-content'>{item}</div>
                        </div>
                    ))
                }
            </div>

            <div className='video-wrapper'>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/vupwAFMXLkA?si=GwqqEEp1bybdevPT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
            <div className='return-btn' onClick={goToMain}>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1.5L1.5 7L7 12.5" stroke="white" stroke-width="2" />
                </svg>

            </div>

            {isModalOpen && <Modal onClose={closeModal} state="전"/>}
        </div>
    )
}

export default DetailPage;