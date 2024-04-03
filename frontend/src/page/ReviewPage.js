import React from 'react'
import { useNavigate } from "react-router-dom";
import mainIllust from '../img/Illustration.png';
import './reviewPage.css'
import LongButton from '../components/LongButton'

const ReviewPage = () => {
    const navigate= useNavigate();

    const goToMain = () => {
        navigate("/");
      };


    return (
        <div className='login-page'>
            <div className='review-header'>
                현재까지<br/>총 10개의 영상을 공부했어요!
            </div>
            <div className='logo-wrapper'>
                <img src={mainIllust} className='logo-image'></img>
            </div>
            <div className='result-wrapper'>

                <LongButton
                content="내용을 70% 이상 이해했어요."
                colour= "white"
                >
                    <div className='label'>학습 전</div>
                </LongButton>

                <LongButton
                content="내용을 90% 이상 이해했어요."
                colour= "white"
                >
                <div className='label'>학습 후</div>
                </LongButton>

                <LongButton content="복습하기" colour="purple"/>
                <LongButton content="홈으로 가기" colour="black" onClick={goToMain}/>

            </div>
        </div>
    )
}

export default ReviewPage;