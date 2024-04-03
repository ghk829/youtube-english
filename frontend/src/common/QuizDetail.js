import React, { useState } from 'react'
import '../screen/detailPage.css'

const QuizDetail = () => {
    const scripts =
        [
            { eng: "Such a feeling is coming over me", kr: "번역번역번역번역번역번역번역번역번역번역번역번역" },
            { eng: "There is wonder in 'most everything I see", kr: "번역번번역번역번역번역번역번역번역번역번역번역번역번역역" },
            { eng: "Not a cloud in the sky", kr: "번번역번역번역번역번역번역번역번역번역번역번역번역역번역" },
            { eng: "Got the sun in my eyes", kr: "번역번역번역번역번역번역번역번역번역번역번역번역" }        
        ];

        const quizVocabs = [
            "most", 
            "everything",
            "I",
            "see"
        ]

        let clickedOrder = []

    return (
        <div className='quiz-detail'>
            <div className='quiz-progress'>1/5</div>
            <div className='quiz-question'>{scripts[0].eng}</div>
            <div className='quiz-question-empty'></div>

            <div className='quiz-question-translated'>{scripts[0].kr}</div>
            <div className='quiz-btns'>
                {
                    quizVocabs.map((item)=>(
                        <div className='quiz-btn'>
                            {item}
                            </div>
                    ))
                }
            </div>
        </div>
    )
}

export default QuizDetail;