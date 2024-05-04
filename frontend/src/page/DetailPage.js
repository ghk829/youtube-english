import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import './detailPage.css'
import Modal from '../components/Modal';
import VideoDetail from '../screen/VideoDetail';
import QuizDetail from '../screen/QuizDetail';

const DetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scripts, setScripts] = useState([""])
    const [youtubeLink, setYoutubeLink] = useState("");

    const [step, setStep] = useState(0);
    const [understand, setUnderstand] = useState(0);
    const [understand_after, setUnderstand_after] = useState(0);

    const [quizs, setQuizs] = useState([]);

    const closeModal = () => {
        setIsModalOpen(false);
        if(step<3)
        {
            setStep(step + 1)
        }
        else{
            goToReview();
        }
    };

    const stages = [
        { title: '자막없이 풀기', type: "video" },
        { title: '쉐도잉하기', type: "video" },
        { title: '받아쓰기', type: "quiz" },
        { title: '다시 풀기', type: "video" }
    ]
    const goToMain = () => {
        navigate("/");
    };

    const goToReview = () => {
        navigate("/review", { state: { understand, understand_after } });
    };

    useEffect(() => {
        if(scripts.length<2)
        {fetchSubtitles();}
    }, []);

    useEffect(()=>{
        if (scripts.length > 1 && scripts[0] !== "" && !quizs.data) {
            fetchQuiz();
        }
    }, [scripts]);

    const fetchSubtitles = async () => {
        const selected = location.state?.link;
        if (!selected) {
            alert('YouTube URL이 없습니다.');
            return;
        }
        setYoutubeLink(selected);
        try {
            console.log("자막 요청 링크")
            console.log(location.state?.link )
            console.log("자막 요청 중...  (/api/subtitles)")
            const response = await axios.post(`${process.env.REACT_APP_MOD||""}/api/subtitles`, { videoUrl: location.state?.link });
            // let textArray = response.data.map(x => x.text);
            let textArray = response.data;
            console.log("자막 Response")
            console.log(response.data)

            setScripts(textArray);

        } catch (error) {
            console.error('Error fetching subtitles:', error);
            alert('자막이 없는 영상입니다. 다른 영상을 선택해 주세요.');
        }
    };

const fetchQuiz = async()=>{
    let maxText = Math.min(15, scripts.length)
    let wholescript = scripts.slice(1, maxText).map(x => x.text).join('');
    console.log("퀴즈 요청용 데이터");
    console.log(wholescript)
    console.log("퀴즈 요청 중... (/api/quizFromSubtitle) ")
    const response2 = await axios.post(`${process.env.REACT_APP_MOD||""}/api/quizFromSubtitle`, { subtitles: wholescript});
    setQuizs(response2.data)
    console.log("퀴즈 데이터")
    console.log(response2.data);
}

    return (
        <div className='detail-page'>
            <div className='steps-header'>

                {
                    stages.map((item, key) => (
                        <div className='step'>
                            <div className='step-num' onClick={() => { setStep(key) }}>{key + 1}</div>
                            <div className='step-content'>{item.title}</div>
                        </div>
                    ))
                }
            </div>

            <div className='detail-type-wrapper'>
                {step === 2 ? 
                <QuizDetail quizs_data={quizs} 
                setStep = {()=>setStep(step + 1)} /> :
                    (youtubeLink && <VideoDetail scripts={scripts} url={youtubeLink}
                        step={step} isModalOpen={setIsModalOpen} />)
                }
            </div>
            <div className='return-btn' onClick={goToMain}>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1.5L1.5 7L7 12.5" stroke="white" strokeWidth="2" />
                </svg>

            </div>
            {isModalOpen && <Modal onClose={closeModal} step={step} onSelect={(index) => {
                if (step === 0) {
                    setUnderstand(index);
                } else if (step === 3) {
                    setUnderstand_after(index);
                }
            }} />}
        </div>
    )
}

export default DetailPage;