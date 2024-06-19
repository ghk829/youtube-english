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
    const [translatedScripts, setTranslatedScripts] = useState([""])
    const [youtubeLink, setYoutubeLink] = useState("");
    const [step, setStep] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [subtitles, setSubtitles] = useState([]);

    const closeModal = () => {
        setIsModalOpen(false);
        if (step < 1) {
            setStep(step + 1)
        }
        else {
            goToMain();
        }
    };

    const stages = [
        { title: '쉐도잉하기', type: "video" },
        { title: '다시 풀기', type: "video" }
    ]
    const goToMain = () => {
        navigate("/");
    };

    useEffect(() => {
        setYoutubeLink(location.state?.link.url)
        setSubtitles(location.state?.link.subtitles)
        if (!isFetching) {

            // fetchSubtitles();

        }
    }, [location.state]);


    const fetchSubtitles = async () => {
        setIsFetching(true);

        const videoIdMatch = location.state?.link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/);
        if (!videoIdMatch) {
            alert('유효한 YouTube URL이 아닙니다.');
            setIsFetching(false);
            goToMain();
            return;
        }

        const videoId = videoIdMatch[1];
        let existingData = JSON.parse(localStorage.getItem('urlData') || '{"urls":[]}');
        const existingUrlIndex = existingData.urls.findIndex(item => item.videoId === videoId);


        if (existingUrlIndex !== -1) {
            console.log(existingData.urls[existingUrlIndex].data)

            setTranslatedScripts(existingData.urls[existingUrlIndex].data.translatedScripts)

        }
        else {
            fetchTransition(existingData, videoId);
        }


        setIsFetching(false);

    };


    const fetchTransition = async (existingData, videoId) =>{
        
        try {

            const existingUrlIndex = existingData.urls.findIndex(item => item.videoId === videoId);

            console.log("자막 요청 링크:", location.state?.link);
            console.log("자막 요청 중... (/api/subtitles)");

            const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/subtitles`, { videoUrl: location.state?.link });
            let textArray = response.data.slice(0, Math.min(response.data.length, 30));

            textArray = mergeTexts(textArray);
            const mergedTexts = mergeAllTexts(textArray);

            const newScript = await translateSubtitle(mergedTexts);
            console.log(newScript)
            const newTranslatedScripts = await mergeJsonArrays(textArray, newScript);
            setTranslatedScripts(newTranslatedScripts);

            if (existingUrlIndex !== -1) {
                const tempData = existingData;
                localStorage.removeItem('urlData')
                
                if (newTranslatedScripts.length) {

                    tempData.urls[existingUrlIndex] = {
                        videoId: videoId,
                        data: {
                            translatedScripts: newTranslatedScripts
                        }
                    };
    
                    localStorage.setItem('urlData', JSON.stringify(existingData));
                }
            }
            else{
                if (newTranslatedScripts.length) {

                    existingData.urls.push({
                        videoId: videoId,
                        data: {
                            translatedScripts: newTranslatedScripts
                        }
                    });
    
                    if (existingData.urls.length > 4) {
                        existingData.urls.shift();
                    }
    
                    localStorage.setItem('urlData', JSON.stringify(existingData));
                }
            }

        } catch (error) {
            console.error('자막을 가져오는 중 오류 발생:', error);
            alert('자막이 없는 영상입니다. 다른 영상을 선택해 주세요.');
        }

    }

    const mergeTexts = (data) => {
        const result = [];

        for (let i = 0; i < data.length; i += 2) {
            const chunk = data.slice(i, i + 2);
            const start = chunk[0].start;
            let dur;
            if (i + 2 >= data.length) {
                dur = chunk.reduce((acc, curr) => acc + parseFloat(curr.dur), 0).toFixed(1);
            } else {
                dur = (parseFloat(data[i + 2].start) - parseFloat(start)).toFixed(1);
            }
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
        console.log(data)
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/translator`, { subtitle: data });
        const result = stringToJson(response.data);
        console.log("번역 완료")
        console.log(result)
        return result;
    }
    return (
        <div className='detail-page'>

            <header>
                <div className='return-btn' onClick={goToMain}>
                    <object data={arrowLeft} onClick={goToMain} ></object>
                </div>
                <h2>영상제목</h2></header>

            <div className='steps-header'>
                {
                    stages.map((item, key) => (
                        <div className='step'>

                            <div
                                className='step-num'
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
                                    display: key === 1 ? 'none' : ''
                                }}
                            ></div>
                        </div>
                    ))
                }
            </div>

            <div className='detail-type-wrapper'>
                {youtubeLink && <VideoDetail onEnd={closeModal} url={youtubeLink} translations={subtitles}
                    autoPlay={location.state?.autoPlay}
                    step={step} isModalOpen={setIsModalOpen} ></VideoDetail>
                }
            </div>
            {isModalOpen && <Modal onClose={closeModal} step={step} onSelect={(index) => {
            }} />}
                        <button onClick={()=>fetchTransition(JSON.parse(localStorage.getItem('urlData') || '{"urls":[]}') , youtubeLink.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/))([^?&"'>]+)/)[1])}>자막 재요청하기</button>

        </div>
    )
}

export default DetailPage;