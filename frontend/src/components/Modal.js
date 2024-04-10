import React, { useState } from 'react';
import './modal.css'
import LongButton from './LongButton';
import Chip from './Chip';

const Modal = ({ onClose, step, onSelect  }) => {
    const buttons = ["이해하지 못함", "30%", "50%", "70%", "90% 이상"];
    const states = ["전", "전", "후", "후"]
    const [selected_before, setSelected_before] = useState(null);

    
    return (
        <div className='modal'>
            <div className='modal-bg' >
            </div>
            <div className='modal-body'>
                <div className='modal-header'>
                    학습 {states[step]} <br />
                    내용을 얼마나 이해하셨나요?
                </div>
                <div className='modal-content'>
                    {
                        buttons.map((item, index) => (
                            <Chip
                            key={index}
                            content={item}
                            onClick={() => {
                                setSelected_before(index); 
                                onSelect(index); 
                            }}
                            clicked={selected_before === index}
                            ></Chip>
                        ))
                    }
                </div>
                <LongButton
                colour="purple"
                content="확인하기"
                onClick={onClose}
                />
            </div>
        </div>
    );
}

export default Modal;
