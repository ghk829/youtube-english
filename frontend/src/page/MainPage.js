import React, { useEffect } from 'react'
import { useNavigate, } from "react-router-dom";
import './mainPage.css'
import Chip from '../components/Chip';

const MainPage = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    const goToDetail = () => {
        navigate("/detail");
    };

    const username = "Messi"
    const buttonList = ["시사/교양", "영어 인터뷰", "동기부여"]
    const videoList = [{ link: "", title: "Lonliness" }, { link: "", title: "Change You" }]

    
    return (
        <div className='main-page'>

            {/* 프로필  */}
            <header className='main-header'>
                <div className='profile'
                    onClick={goToLogin}></div>
                <div>반가워요, {username}님</div>
            </header>

            {/* 유저 통계 */}
            <nav>
                <div className='studied-wrapper'>
                    공부한 영상
                    <div>0</div>
                </div>

                <div className='studied-wrapper'>
                    학습 일수
                    <div>0</div>
                </div>
            </nav>

            {/* 비디오 컨텐츠 */}
            <div className='explore-detail-btn'>
                탐색하기
            </div>

            {/* 탐색 버튼 */}
            <div className='explore-btn-wrapper'>
                {
                    buttonList.map((item) => (
                        <Chip content={item} /> ))
                }
            </div>

            {/* 비디오 */}
            <div className='explore-videos'>
                {
                    videoList.map((item) => (
                        <div className='explore-video'>
                            <div className='explore-video-content' onClick={goToDetail}></div>
                            <div className='explore-video-title'>{item.title}</div>
                        </div>
                    ))
                }
            </div>

            {/* 푸터 */}
            <footer className='bottom-navbar'>
                <button className='bottom-navbar-btn'>홈</button>
                <button className='bottom-navbar-btn'>학습 내용</button>
            </footer>
        </div>
    )

}

export default MainPage;