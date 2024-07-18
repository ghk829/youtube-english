import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import './css/detailPage.css'
import Modal from '../components/Modal';
import VideoDetail from '../screen/VideoDetail';
import arrowLeft from '../img/icon/arrowLeft.svg'

const DetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [step, setStep] = useState(0);
    const [subtitles, setSubtitles] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("login")==="true"||false);

    const stages = [
        { title: '쉐도잉하기', type: "title" },
        { title: '자막 없이 보기', type: "no_title" },
        { title: '자막이랑 보기', type: "title" }
    ]
    const goToMain = () => {
        navigate("/");
    };

    
    const closeModal = () => {
        setIsModalOpen(false);
        if(step===stages.length-1){
            
            const lastVisitDate = new Date(localStorage.getItem('lastVisitDate'));
            const today = new Date();
        
            if (lastVisitDate && today.getDate() !== lastVisitDate.getDate()) {
              const newVideo = parseInt(localStorage.getItem('currentDate')) + 1;
              localStorage.setItem('currentDate', newVideo.toString());
        
              localStorage.setItem('lastVisitDate', today.toISOString());
              localStorage.setItem('currentVideo', parseInt(localStorage.getItem('currentVideo')+1));

            }
        }
    };


    useEffect(() => {
        setYoutubeLink(location.state?.link.url)
        setSubtitles(location.state?.link.subtitles)
    }, [location.state]);

    const stringToJson = (str) => {
        console.log("JSON 전환 중...")
        console.log(str)

        const lines = str.split('\n').filter(line => line !== '');
        const json = lines.map((line) => ({ translatedText: line }));

        return json;
    }
    const translateSubtitle = async (data) => {

        console.log("번역 요청 중...  (/api/translator)")
        console.log(data)
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/translator`, { subtitle: data });
        const result = stringToJson(response.data);
        console.log("번역 완료")
        console.log(result)
        return result;
    }
    return (
        <div className='detail-page'>

            <header style={{ display: "flex", justifyContent: "center" }}>
                <div className='return-btn' onClick={goToMain}>
                    <object data={arrowLeft} onClick={goToMain} ></object>
                </div>
                <h2 style={{ maxWidth: "250px", textAlign: "center" }}>{location.state?.link.title.slice(0, 25)}...</h2></header>

                
            <div className='steps-header'>
                {stages.map((item, key) => (
                    <div className='step' key={key}>
                        <div
                            className='step-num'
                            style={{
                                backgroundColor: step >= key ? '#903FF6' : '#F0E6FD',
                                color: step >= key ? 'white' : '#E2CEFC'
                            }}
                        >
                            {key + 1}
                        </div>
                        {key < stages.length-1 && (
                            <div
                                className='step-bar'
                                style={{
                                    backgroundColor: step > key ? '#903FF6' : '#F0E6FD',
                                    position: 'relative',
                                    top: '-30%',
                                    left: `${(key+1 * 120) / stages.length}%`
                                }}
                            />
                        )}
                        <div
                            className='step-content'
                            style={{
                                color: step >= key ? '#333333' : '#ABABAB'
                            }}
                        >
                            {item.title}
                        </div>
                    </div>
                ))}
            </div>


            <div className='detail-type-wrapper'>
                {youtubeLink && <VideoDetail onEnd={closeModal} url={youtubeLink} translations={subtitles}
                    autoPlay={location.state?.autoPlay}
                    step={step} setStep={setStep} isModalOpen={setIsModalOpen} ></VideoDetail>
                }
            </div>
            {isModalOpen && <Modal onClose={closeModal} isLoggedIn={isLoggedIn}/>}
            {/* <button onClick={()=>fetchTransition(JSON.parse(localStorage.getItem('urlData') || '{"urls":[]}') , youtubeLink.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/)[1])}>자막 재요청하기</button> */}

        </div>
    )
}

export default DetailPage;