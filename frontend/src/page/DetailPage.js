import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './detailPage.css'
import Modal from '../components/Modal';
import VideoDetail from '../screen/VideoDetail';
import QuizDetail from '../screen/QuizDetail';

const DetailPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [detailType, setDetailType] = useState("video");

    const closeModal = () => {
        setIsModalOpen(false);
    };
const stages=    [
        { title: '자막없이 풀기', type: "video" },
        { title: '쉐도잉하기', type: "video" },
        { title: '받아쓰기', type: "quiz" },
        { title: '다시 풀기', type: "video"  }
      ]
    const goToMain = () => {
        navigate("/");
    };

    const goToReview = () => {
        navigate("/review");
    };

    return (
        <div className='detail-page'>
            <div className='steps-header'>

                {
                    stages.map((item, key) => (
                        <div className='step'>
                            <div className='step-num' onClick={()=>setDetailType(item.type)}>{key+1}</div>
                            <div className='step-content'>{item.title}</div>
                        </div>
                    ))
                }
            </div>

            {detailType==="quiz"?<QuizDetail/>:<VideoDetail/>}
            
            <div className='return-btn' onClick={goToMain}>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1.5L1.5 7L7 12.5" stroke="white" stroke-width="2" />
                </svg>

            </div>
            <button onClick={goToReview}>임시 리뷰하기 버튼</button>
            {isModalOpen && <Modal onClose={closeModal} state="전" />}
        </div>
    )
}

export default DetailPage;