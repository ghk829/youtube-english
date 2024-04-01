import React, {useEffect} from 'react'
import { useNavigate,  } from "react-router-dom";
import './mainPage.css'

const MainPage = () => {
    const navigate= useNavigate();

    const goToLogin = () => {
        navigate("/login");
      };

    const username = "Messi"
    const buttonList =["시사/교양", "영어 인터뷰", "동기부여"]
    const videoList = [{link:"", title:"Lonliness"}, {link:"", title:"Change You"}]
    return (
        <div className='main-page'>
            <header className='main-header'> 
            <div className='profile' 
            onClick={goToLogin}></div>
            <div>반가워요, {username}님</div>
            </header>

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

            <div className='explore-detail-btn'>
                탐색하기
            </div>

            <div className='explore-btn-wrapper'>
                {
                    buttonList.map((item)=>(
                        <button className='explore-btn'>{item}</button>
                    ))
                }
            </div>

            <div className='explore-videos'>
            {
                    videoList.map((item)=>(
                        <div className='explore-video'>
                            <div className='explore-video-content'></div>
                            <div className='explore-video-title'>{item.title}</div>
                            </div>
                    ))
                }
            </div>

            <footer className='bottom-navbar'>
                <button className='bottom-navbar-btn'>홈</button>
                <button className='bottom-navbar-btn'>복습하기</button>
                <button className='bottom-navbar-btn'>프로필</button>
            </footer>
        </div>
    )

}

export default MainPage;