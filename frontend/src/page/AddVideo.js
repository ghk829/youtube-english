import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const AddVideo = () => {
    const navigate = useNavigate();
    const [newVideo, setNewVideo] = useState({
        category: '',
        subcategory: '',
        url: '',
        title: '',
        subtitles: []
    });

    const [allData, setAllData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [yesSub, setYesSub] = useState(true);
    const [translated, setTranslated] = useState([]);


    const fetchAllData = async () => {
        try {

            const response = await axios.get(`${process.env.REACT_APP_MOD || ""}/api/getallvideo`);
            setAllData(response.data);

            const uniqueCategories = [...new Set(response.data.map((item) => item.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newCategory') {
            setNewCategory(value);
        } else if (name === 'subcategory') {
            setNewVideo((prevState) => ({
                ...prevState,
                subcategory: value,
            }));
        } else {
            setNewVideo((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const getTitle = async (url) => {
        console.log("제목 요청중")
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/title`, { videoUrl: url });
        console.log(`제목 요청 완료: ${response.data.title}`)


        setNewVideo((prevState) => ({
            ...prevState,
            title: response.data.title
        }));

        return response.data.title;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await getTitle(newVideo.url);
            await fetchSubtitles();
            setNewVideo((prevState) => ({
                ...prevState,
            }));
    
            if (yesSub && newVideo.title != "") {
                const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/addvideo`, { newVideo: newVideo });
                if (response.status === 200) {
                    console.log('Video added successfully');
                    alert("비디오가 정상적으로 등록되었습니다.");
                } else {
                    alert("비디오 등록에 실패하였습니다.");
                    console.error('Error adding video');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert("비디오 등록에 실패하였습니다.");
        } finally {
            fetchAllData();
        }
    };

    const fetchSubtitles = async () => {
        try {
            console.log("자막 요청 링크:", newVideo.url);
            console.log("자막 요청 중... (/api/subtitles)");

            const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/subtitles`, { videoUrl: newVideo.url });
            let textArray = response.data.slice(0, Math.min(response.data.length, 30));

            textArray = mergeTexts(textArray);
            setYesSub(true);
            await fetchTransition(newVideo.url);

            textArray = translated;

            setNewVideo((prevState) => ({
                ...prevState,
                subtitles: textArray
            }));
        } catch (error) {
            console.error('자막을 가져오는 중 오류 발생:', error);
            alert('자막이 없는 영상입니다. 다른 영상을 선택해 주세요.');
            setYesSub(false);
        }
    }

    const fetchTransition = async (videoUrl) => {

        try {

            console.log("자막 요청 중... (/api/subtitles)");

            const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/subtitles`, { videoUrl: videoUrl});
            let textArray = response.data.slice(0, Math.min(response.data.length, 60));

            textArray = mergeTexts(textArray);
            const mergedTexts = mergeAllTexts(textArray);

            const newScript = await translateSubtitle(mergedTexts);
            const newTranslatedScripts = await mergeJsonArrays(textArray, newScript);
            await setTranslated(newTranslatedScripts)
            console.log(newTranslatedScripts)

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
        const json = lines.map((line) => ({ ko: line }));

        return json;
    }
    const translateSubtitle = async (data) => {

        console.log("번역 요청 중...  (/api/translator)")
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/translator`, { subtitle: data });
        const result = stringToJson(response.data);
        console.log("번역 완료")
        return result;
    }


    return (
        <div className="add-video">
            <h2>현재 비디오 목록</h2>
            <table style={{ border: "1px solid gray" }}>
                <thead >
                    <tr >
                        <th>Category</th>
                        <th>Sub</th>
                        <th>URL</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {allData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.category}</td>
                            <td>{item.subcategory}</td>
                            <td>{item.url}</td>
                            <td>{item.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>새 비디오 등록하기</h2>
            <form onSubmit={handleSubmit}>
                <h4>비디오 URL</h4>
                <input
                    type='text'
                    name='url'
                    placeholder='비디오 url을 입력하세요'
                    onChange={handleInputChange}
                    required
                />
                <br />
                <h4>비디오 카테고리</h4>
                {categories.map((category, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={newVideo.category === category.toString()}
                            onChange={handleInputChange}
                            required
                        />
                        {category}
                    </label>
                ))}
                <br />



                <input
                    type="text"
                    name="newCategory"
                    placeholder="새 카테고리"
                    onChange={handleInputChange}
                />

                <br />
                <br />
                <input
                    type="text"
                    name="subcategory"
                    placeholder="서브 카테고리"
                    onChange={handleInputChange}
                    value={newVideo.subcategory}
                />


                <button style={{ width: '100px' }} type='submit'>
                    <h3>등록</h3>
                </button>
            </form>
        </div>
    )
}

export default AddVideo;
