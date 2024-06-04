import React, { useState, useEffect } from 'react'
import { useNavigate, } from "react-router-dom";
import './mainPage.css'
import Chip from '../components/Chip';
import axios from 'axios'
import LongButton from '../components/LongButton'
import homeIcon from '../img/icon/homeIcon.svg'


const MainPage = () => {
    const navigate = useNavigate();
    const [customUrl, setCustomUrl] = useState('');
    const [selected, setSelected] = useState('시사/교양');
    const [autoPlay, setAutoplay] = useState(false);
    const [videoList, setVideoList] = useState([
        { url: "https://www.youtube.com/watch?v=y8Pomwve_OQ", title: null },
        { url: "https://www.youtube.com/shorts/bO1BcFk2TRA", title: null },
        { url: "http://www.youtube.com/watch?v=MBRqu0YOH14", title: null },
        { url: "http://www.youtube.com/watch?v=U5L22eeGQUc", title: null }
    ]);


    useEffect(() => {
        async function fetchTitles() {
          const promises = videoList.map((video) =>
            getTitle(video.url).then((titleData) => {
              return { ...video, title: titleData.title };
            })
          );
          const videosWithTitles = await Promise.all(promises);
          setVideoList(videosWithTitles);
        }
    
        fetchTitles();
      }, []);
    const goToLogin = () => {
        navigate("/login");
    };
    const goToDetail = (link) => {
        navigate('/detail', { state: { link, autoPlay } });
    };

    const username = "Messi"
    const buttonList = ["시사/교양", "영어 인터뷰", "동기부여"]

    const handleInputChange = (event) => {
        setCustomUrl(event.target.value);
    };

    const handleSubmit = (event) => {
        goToDetail(customUrl);

    };

    const getVideoId = (url) => {
        const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/)[1];
        return videoId;
    }

    const getTitle = async (url) =>{
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/title`, { videoUrl:url});
        return response.data;
    }


    return (
        <div className='main-page'>

            {/* 프로필  */}
            <header className='main-header'>
                <div className='profile'
                    onClick={goToLogin}>
 <object data={homeIcon}></object>
                </div>
                <div className='user-name'>반가워요, {username}님</div>
            </header>

            {/* 유저 통계 */}
            <nav>
                <div className='studied-wrapper'>
                    공부한 영상
                    <div className='studied-number'>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3.3275C3 2.87083 3.37083 2.5 3.8275 2.5H17.1725C17.6292 2.5 18 2.87083 18 3.3275V16.6725C17.9998 16.8919 17.9125 17.1022 17.7574 17.2574C17.6022 17.4125 17.3919 17.4998 17.1725 17.5H3.8275C3.60803 17.5 3.39756 17.4128 3.24237 17.2576C3.08718 17.1024 3 16.892 3 16.6725V3.3275ZM9.35167 7.0125C9.30151 6.97904 9.24322 6.95981 9.183 6.95685C9.12279 6.9539 9.06289 6.96733 9.00971 6.99572C8.95652 7.02411 8.91202 7.06639 8.88097 7.11807C8.84991 7.16974 8.83344 7.22888 8.83333 7.28917V12.7108C8.83344 12.7711 8.84991 12.8303 8.88097 12.8819C8.91202 12.9336 8.95652 12.9759 9.00971 13.0043C9.06289 13.0327 9.12279 13.0461 9.183 13.0431C9.24322 13.0402 9.30151 13.021 9.35167 12.9875L13.4175 10.2775C13.463 10.2469 13.5004 10.2056 13.5262 10.1572C13.552 10.1089 13.5655 10.0548 13.5655 10C13.5655 9.94515 13.552 9.89115 13.5262 9.84275C13.5004 9.79436 13.463 9.75306 13.4175 9.7225L9.35167 7.0125Z" fill="#913FF7" />
                        </svg>

                        10
                    </div>
                </div>

                <div className='studied-wrapper'>
                    학습 일수
                    <div className='studied-number'>
                        <svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.50044 18.1667C5.24807 18.1666 4.02461 17.7902 2.9887 17.0864C1.95279 16.3826 1.1522 15.3839 0.690733 14.2196C0.22927 13.0554 0.128218 11.7793 0.40068 10.5569C0.673142 9.33456 1.30655 8.22223 2.21878 7.36417C3.33711 6.31167 6.08378 4.41667 5.66711 0.25C10.6671 3.58333 13.1671 6.91667 8.16711 11.9167C9.00044 11.9167 10.2504 11.9167 12.3338 9.85833C12.5588 10.5025 12.7504 11.195 12.7504 11.9167C12.7504 13.5743 12.092 15.164 10.9199 16.3361C9.74776 17.5082 8.15805 18.1667 6.50044 18.1667Z" fill="#913FF7" />
                        </svg>


                        8
                    </div>
                </div>
            </nav>

            <div className='today-sentence-wrapper'>
                <h2>오늘의 문장🔮</h2>
                <h2>Good things don't come easy</h2>
                <LongButton>관련 영상 보러 가기</LongButton>
                

            </div>


            {/* 비디오 컨텐츠 */}
            <div className='explore-detail-btn' >
                미국 영어
            </div>
            {/* 탐색 버튼 */}
            <div className='explore-btn-wrapper'>
                {
                    buttonList.map((item) => (
                        <Chip content={item} onClick={() => setSelected(item)} clicked={item === selected} filled={true} />))
                }
            </div>

            {/* 비디오 */}
            <div className='explore-videos'>
                {
                    videoList.map((item, key) => (
                        <div className='explore-video'>
                            <div className='explore-video-content' onClick={() => goToDetail(item.url)}>

                                <img
                                    src={`https://img.youtube.com/vi/${getVideoId(item.url)}/0.jpg`}
                                    alt={item}
                                    width="250"
                                    height="165"
                                    style={{ borderRadius: "20px" }}
                                />
                            </div>
                            <div className='explore-video-title' >{item.title}</div>
                        </div>
                    ))
                }
            </div>

            {/* 폼 */}
            {/* <div>
                자동 재생 옵션
                <input type='checkbox' value={autoPlay}
                    onClick={() => setAutoplay(!autoPlay)}
                ></input>
            </div> */}
            <div className='form-wrapper'>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                }} style={{ marginTop: "10px" }}>
                    <div className='form-label'>공부하고 싶은 유튜브 영상 링크</div>
                    <input
                        className='form-input'
                        type="text"
                        id="youtubeLink"
                        value={customUrl}
                        placeholder='링크를 붙여 넣어주세요.'
                        onChange={handleInputChange}
                    />
                    <button
                        className='form-submit'
                        type="submit">제출</button>
                </form>
            </div>
            {/* 푸터 */}
            <footer className='bottom-navbar'>
                <button className='bottom-navbar-btn' style={{ color: '#913FF7' }}>

                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.75 5.69L17.75 10.19V18H15.75V12H9.75V18H7.75V10.19L12.75 5.69ZM12.75 3L2.75 12H5.75V20H11.75V14H13.75V20H19.75V12H22.75" fill="#913FF7" />
                        <path d="M7.75 10L12.75 5.5L17.75 10V18H15.75V12H9.75V18.5H7.75V10Z" fill="#913FF7" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.75 4.82732L18.25 9.77732V18.5H15.25V12.5H10.25V19H7.25V9.77732L12.75 4.82732ZM8.25 10.2227V18H9.25V11.5H16.25V17.5H17.25V10.2227L12.75 6.17268L8.25 10.2227Z" fill="#913FF7" />
                    </svg>

                    홈
                </button>

                <button className='bottom-navbar-btn'>

                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M22.25 12C22.25 17.5228 17.7728 22 12.25 22C6.72715 22 2.25 17.5228 2.25 12C2.25 6.47715 6.72715 2 12.25 2C17.7728 2 22.25 6.47715 22.25 12ZM12.25 20C16.6683 20 20.25 16.4183 20.25 12C20.25 7.58172 16.6683 4 12.25 4C7.83172 4 4.25 7.58172 4.25 12C4.25 16.4183 7.83172 20 12.25 20Z" fill="var(--gray30)" />
                        <path d="M11.25 11H13.25V17H11.25V11Z" fill="gray" />
                        <path d="M11.25 7H13.25V9H11.25V7Z" fill="gray" />
                    </svg>

                    학습 내용</button>
            </footer>
        </div>
    )

}

export default MainPage;