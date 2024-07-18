import React from 'react'

import { useNavigate, useLocation } from "react-router-dom";
import mainIllust from '../img/Illustration.png';
import './css/reviewPage.css'
import LongButton from '../frontend/src/components/LongButton'

const ReviewPage = () => {
    const buttons = ["0%", "30%", "50%", "70%", "90% 이상"];
    const navigate= useNavigate();

    const goToMain = () => {
        navigate("/");
      };


      const goToDetail = () => {
        navigate(-1);
      };

      const location = useLocation();
      const und = location.state?.understand;
      const und_after = location.state?.understand_after;

      const und_text = `내용을 ${buttons[und]} 이해했어요.`
      const und_after_text = `내용을 ${buttons[und_after]} 이해했어요.`

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
                content= {und_text}
                color= "white"
                >
                    <div className='label'>학습 전</div>
                </LongButton>

                <LongButton
                content={und_after_text}
                color= "white"
                >
                <div className='label'>학습 후</div>
                </LongButton>

                <LongButton content="복습하기" color="purple" onClick={goToDetail}/>
                <LongButton content="홈으로 가기" color="black" onClick={goToMain}/>

            </div>
        </div>
    )
}

export default ReviewPage;