import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import './css/mainPage.css'
import axios from 'axios'
import LongButton from '../components/LongButton'
import videoPlayer from '../img/icon/videoPlayer.svg'
import fire from '../img/icon/purpleFire.svg'
import Chip from '../components/Chip'

const MainPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [customUrl, setCustomUrl] = useState('');
    const [currentVideo, setCurrentVideo] = useState(0);
    const [currentDate, setCurrentDate] = useState(0);
    // const [autoPlay, setAutoplay] = useState(false);
    const [videoList, setVideoList] = useState([
    ]);
    const [pic, setPic] = useState("");
    const [profileName, setProfileName] = useState("");
    const [visibleVideos, setVisibleVideos] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState({});
    const [todayVideo, setTodayVideo] = useState();

    const makeDescriptionMeta = () => {
        const meta = document.createElement('meta');
        meta.setAttribute('apple-mobile-web-app-capable', 'yes');
        meta.setAttribute('referrer', 'no-referrer');
        meta.setAttribute('viewport', "minimum-scale=1.0, width=device-width, maximum-scale=1, user-scalable=no");
        document.getElementsByTagName('head')[0].appendChild(meta);
    }


    useEffect(() => {

        if (!location.state?.user.name && !localStorage.getItem("name")) {
            const tempName = `User${Math.floor(Math.random() * 100000 + 5000)}`;
            localStorage.setItem("name", tempName);
            localStorage.setItem("login", false);
            setProfileName(tempName)

        }
        else if (location.state?.user.name) {
            localStorage.setItem("name", location.state?.user.name);
            setProfileName(location.state?.user.name);
            setPic(location.state?.user.picture);
            localStorage.setItem("login", true);
        }
        else {
            setProfileName(localStorage.getItem("name"));
        }

        makeDescriptionMeta();

        const videoTest = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_MOD || ""}/api/getallvideo`);
                const sortedVideoList = response.data.sort((a, b) => a.subcategory.localeCompare(b.subcategory));
                setVideoList(sortedVideoList);

                const todayVideo = sortedVideoList.find(item => item.title.includes('Good Things'));
                setTodayVideo(todayVideo);
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };

        videoTest();

        if (localStorage.getItem('currentDate')) {
            setCurrentDate(localStorage.getItem('currentDate'));
        }
        else {
            localStorage.setItem('currentDate', 0);
        }

        if (localStorage.getItem('currentVideo')) {
            setCurrentVideo(localStorage.getItem('currentVideo'));
        }
        else {
            localStorage.setItem('currentVideo', 0);
        }

    }, []);
    const goToLogin = () => {
        navigate("/login");
    };
    const goToDetail = (link) => {
        if (link) { navigate('/detail', { state: { link } }); }
    };

    const goToAdmin = () => {
        navigate("/video-add");
    };
    const getVideoId = (url) => {
        const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/)[1];
        return videoId;
    }


    const handleChipClick = (category, subcategory) => {
        setVisibleVideos({
            ...visibleVideos,
            [category]: groupByCategory(videoList)[category].subcategories[subcategory]
        });

        setSelectedSubcategories({
            ...selectedSubcategories,
            [category]: subcategory
        });

    };

    const groupByCategory = (videoList) => {
        return videoList.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {
                    subcategories: {},
                    items: [],
                };
            }
            acc[item.category].items.push(item);
            if (!acc[item.category].subcategories[item.subcategory]) {
                acc[item.category].subcategories[item.subcategory] = [];
            }
            acc[item.category].subcategories[item.subcategory].push(item);
            acc[item.category].subcategories[item.subcategory].sort();
            return acc;
        }, {});
    };

    return (
        <div className='main-page'>

            {/* 프로필  */}
            <header className='main-header'>
                <div className='profile'>
                    <img src={pic} style={{ borderRadius: "999px" }}></img>
                </div>
                <div className='user-name'>반가워요, {profileName}님</div>
            </header>

            {/* 유저 통계 */}
            <nav>
                <div className='studied-wrapper' >
                    공부한 영상
                    <div className='studied-number'>
                        <object data={videoPlayer}></object>
                        {currentVideo}
                    </div>
                </div>

                <div className='studied-wrapper'>
                    학습 일수
                    <div className='studied-number'>
                        <object data={fire}></object>


                        {currentDate}
                    </div>
                </div>
            </nav>

            <div className='today-sentence-wrapper'>
                <h2>오늘의 문장🔮</h2>
                <div className='today-sentence'>Good things don't come easy</div>


                <LongButton width={"240px"} onClick={() => goToDetail(todayVideo)}>관련 영상 보러 가기</LongButton>


            </div>


            {/* 비디오 */}

            <div className="explore-videos">
                {Object.keys(groupByCategory(videoList)).map((category, key) => (
                    <div key={key} className="category-container">
                        <div className="video-category">{category}</div>
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "16px" }}>
                            {Object.keys(groupByCategory(videoList)[category].subcategories).filter(subcategory => subcategory !== 'none').map((subcategory, index) => (
                                <div key={index}>
                                    <Chip
                                        content={subcategory}
                                        onClick={() => handleChipClick(category, subcategory)}
                                        clicked={selectedSubcategories[category] === subcategory || (selectedSubcategories[category] === undefined && index === 0)}
                                        filled={selectedSubcategories[category] === subcategory || (selectedSubcategories[category] === undefined && index === 0)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="explore-video-list">
                            {visibleVideos[category] ? visibleVideos[category].map((item, index) => (
                                <div key={index} className="explore-video">
                                    <div className="explore-video-content" onClick={() => goToDetail(item)}>
                                        <img
                                            src={`https://img.youtube.com/vi/${getVideoId(item.url)}/0.jpg`}
                                            alt={item}
                                            width="250"
                                            height="165"
                                            style={{ borderRadius: "20px" }}
                                        />
                                    </div>
                                    <div className="explore-video-title">{item.title}</div>
                                </div>
                            )) : groupByCategory(videoList)[category].subcategories[Object.keys(groupByCategory(videoList)[category].subcategories)[0]].map((item, index) => (
                                <div key={index} className="explore-video">
                                    <div className="explore-video-content" onClick={() => goToDetail(item)}>
                                        <img
                                            src={`https://img.youtube.com/vi/${getVideoId(item.url)}/0.jpg`}
                                            alt={item}
                                            width="250"
                                            height="165"
                                            style={{ borderRadius: "20px" }}
                                        />
                                    </div>
                                    <div className="explore-video-title">{item.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>



            {/* 푸터 */}
            {/* <footer className='bottom-navbar'>
                <button className='bottom-navbar-btn' style={{ color: '#913FF7' }}>


                    <object data={homeIcon}></object>
                    <span>홈</span>

                </button>

                <button className='bottom-navbar-btn' onClick={() => goToLogin()}>
                    <object data={personOutlinedIcon}></object>
                    <span>마이페이지</span>
                </button>
            </footer> */}
        </div>
    )



}

export default MainPage;