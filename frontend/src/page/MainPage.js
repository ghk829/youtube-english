import React, { useState } from 'react'
import { useNavigate, } from "react-router-dom";
import './mainPage.css'
import Chip from '../components/Chip';

const MainPage = () => {
    const navigate = useNavigate();
    const [customUrl, setCustomUrl] = useState(''); 

    const goToLogin = () => {
        navigate("/login");
    };

    const goToDetail = (link) => {
        navigate('/detail', { state: { link } });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); 
        goToDetail(customUrl); 
    };

    const handleInputChange = (e) => {
        setCustomUrl(e.target.value); 
    };


    const username = "Messi"
    const buttonList = ["시사/교양", "영어 인터뷰", "동기부여"]

    //Title 은 youtube API로 가져와야함 
    const videoList = [{ link: "https://www.youtube.com/watch?v=MBRqu0YOH14", title: "Title1" },
    { link: "https://www.youtube.com/watch?v=U5L22eeGQUc", title: "Title2" }]


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
                        <Chip content={item} />))
                }
            </div>

            {/* 비디오 */}
            <div className='explore-videos'>
                {
                    videoList.map((item) => (
                        <div className='explore-video'>
                            <div className='explore-video-content' onClick={() => goToDetail(item.link)}>

                                <img
                                    src={`https://img.youtube.com/vi/${item.link.split('=')[1]}/0.jpg`}
                                    alt={item.title}
                                    width="250"
                                    height="165"
                                    style={{ borderRadius: "20px" }}
                                />
                            </div>
                            <div className='explore-video-title'>{item.title}</div>
                        </div>
                    ))
                }
            </div>
            <label>
                다른 링크로 테스트하기
            </label>

            <form onSubmit={handleFormSubmit}>
                <input type="text" name="custom-url" value={customUrl} onChange={handleInputChange}></input>
                <button type="submit">제출</button>
            </form>

            {/* 푸터 */}
            <footer className='bottom-navbar'>
                <button className='bottom-navbar-btn'>홈</button>
                <button className='bottom-navbar-btn'>학습 내용</button>
            </footer>
        </div>
    )

}

export default MainPage;