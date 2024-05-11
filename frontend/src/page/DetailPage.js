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
    const [translatedScripts, setTranslatedScripts] = useState([""])
    const [rawTranslatedScripts, setRawTranslatedScripts] = useState([""])
    const [mergedScripts, setMergedScripts] = useState("")
    const [youtubeLink, setYoutubeLink] = useState("");
    const [isInData, setIsInData] = useState(false);


    const [step, setStep] = useState(0);
    const [understand, setUnderstand] = useState(0);
    const [understand_after, setUnderstand_after] = useState(0);

    const [isFetching, setIsFetching] = useState(false);

    const [quizs, setQuizs] = useState([]);

    const closeModal = () => {
        setIsModalOpen(false);
        if (step < 2) {
            setStep(step + 1)
        }
        else {
            goToReview();
        }
    };

    const stages = [
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
        setYoutubeLink(location.state?.link)
        if (!isFetching) {

            fetchSubtitles();

        }
    }, [location.state]);


    const fetchSubtitles = async () => {
        setIsFetching(true);

        const videoIdMatch = location.state?.link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/);
        if (!videoIdMatch) {
            alert('유효한 YouTube URL이 아닙니다.');
            setIsFetching(false);
            return;
        }

        const videoId = videoIdMatch[1];
        let existingData = JSON.parse(localStorage.getItem('urlData') || '{"urls":[]}');
        let isInData = false;

        const existingUrlIndex = existingData.urls.findIndex(item => item.videoId === videoId);

       
        if (existingUrlIndex !== -1) {
            setIsInData(true)
            
            console.log(existingData.urls[existingUrlIndex].data)

            setTranslatedScripts(existingData.urls[existingUrlIndex].data.translatedScripts)
            setQuizs(existingData.urls[existingUrlIndex].data.quizs)
        }
        else{

            if (!isInData) {
                try {
                    console.log("자막 요청 링크:", location.state?.link);
                    console.log("자막 요청 중... (/api/subtitles)");
    
                    const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/subtitles`, { videoUrl: location.state?.link });
                    let textArray = response.data.slice(0, 14);
    
                    textArray = mergeTexts(textArray);
                    setScripts(textArray);
                    const mergedTexts = mergeAllTexts(textArray);
                    setMergedScripts(mergedTexts);
    
                   const newScript = await translateSubtitle(mergedTexts);
                    console.log(newScript)
                    const newTranslatedScripts = await mergeJsonArrays(textArray, newScript);
                    setTranslatedScripts(newTranslatedScripts);
    
    
                    if (newTranslatedScripts.length > 1 && !quizs.data) {

                        try {
                            let wholescript = mergedTexts;
                            console.log("퀴즈 요청용 데이터");
                            console.log(wholescript)
                
                            if (!quizs.data) {
                                console.log("퀴즈 요청 중... (/api/quizFromSubtitle) ")
                                const response2 = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/quizFromSubtitle`, { subtitles: wholescript });
                
                                setQuizs(response2.data)
                                console.log("퀴즈 데이터")
                                console.log(response2.data);
                            }
                        }
                        catch (error) {
                            console.error('Error fetching quizs:', error);
                        }
                        
                       existingData.urls.push({
                        videoId: videoId,
                        data: {
                            translatedScripts: newTranslatedScripts,
                            quizs: quizs
                        }
                    });
    
                    if (existingData.urls.length > 4) {
                        existingData.urls.shift();
                    }
    
                    localStorage.setItem('urlData', JSON.stringify(existingData));
                    }
    
                } catch (error) {
                    console.error('자막을 가져오는 중 오류 발생:', error);
                    alert('자막이 없는 영상입니다. 다른 영상을 선택해 주세요.');
                }
            }
        }


        setIsFetching(false);
        
        setIsInData(false)
    };



    const mergeTexts = (data) => {
        const result = [];

        for (let i = 0; i < data.length; i += 2) {
            const chunk = data.slice(i, i + 2);
            const start = chunk[0].start;
            const dur = chunk.reduce((acc, curr) => acc + parseFloat(curr.dur), 0).toFixed(1);
            const text = chunk.map(item => item.text).join(' ');

            result.push({ start, dur, text });
        }

        return result;
    }
    function mergeAllTexts(data) {
        return data.map(item => item.text + '\n').join('');
    }
    const mergeJsonArrays = async (originalJson, newJson) => {
        console.log("JSON 결합 중...")
        const maxLength = Math.max(originalJson.length, newJson.length);

        const mergedArray = [];

        for (let i = 0; i < maxLength; i++) {
            const originalItem = originalJson[i];
            const additionalItem = newJson[i];

            if (originalItem && additionalItem) {
                mergedArray.push({ ...originalItem, ...additionalItem });
            } else if (originalItem) {
                mergedArray.push(originalItem);
            } else if (additionalItem) {
                mergedArray.push(additionalItem);
            }

        }
console.log(mergedArray)
        return mergedArray;


    }
    const stringToJson = (str) => {
        console.log("JSON 전환 중...")
        console.log(str)

        const lines = str.split('\n').filter(line => line !== '');
        const json = lines.map((line) => ({ translatedText: line }));

        return json;
    }
    const translateSubtitle = async (data) => {

        console.log("번역 요청 중...  (/api/translator)")
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/translator`, { subtitle: data });
        const result = stringToJson(response.data);
        setRawTranslatedScripts(result);
        return result;
    }
    return (
        <div className='detail-page'>
            <div className='steps-header'>
                {
                    stages.map((item, key) => (
                        <div className='step'>

                            <div
                                className='step-num'
                                onClick={() => { setStep(key) }}
                                style={{
                                    backgroundColor: step >= key ? '#903FF6' : '#F0E6FD',
                                    color: step >= key ? 'white' : '#E2CEFC'
                                }}
                                key={key}
                            >
                                {key + 1}
                            </div>
                            <div className='step-content'

                                style={{
                                    color: step >= key ? '#333333' : '#ABABAB'
                                }}
                            >{item.title}</div>
                            <div className='step-bar'

                                style={{
                                    backgroundColor: step - 1 >= key ? '#903FF6' : '#F0E6FD',
                                    display: key === 2 ? 'none' : ''
                                }}
                            ></div>
                        </div>
                    ))
                }
            </div>

            <div className='detail-type-wrapper'>
                {step === 1 ?
                    <QuizDetail quizs_data={quizs}
                        setStep={() => setStep(step + 1)} /> :
                    (youtubeLink && <VideoDetail scripts={scripts} url={youtubeLink} translations={translatedScripts}
                        autoPlay={location.state?.autoPlay}
                        step={step} isModalOpen={setIsModalOpen} />)
                }
            </div>
            <div className='return-btn' onClick={goToMain} style={{ zIndex: "10" }}>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1.5L1.5 7L7 12.5" stroke="white" strokeWidth="2" />
                </svg>

            </div>
            {isModalOpen && <Modal onClose={closeModal} step={step} onSelect={(index) => {
                if (step === 0) {
                    setUnderstand(index);
                } else if (step === 2) {
                    setUnderstand_after(index);
                }
            }} />}
        </div>
    )
}

export default DetailPage;