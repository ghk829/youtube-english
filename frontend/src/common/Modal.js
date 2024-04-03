import React from 'react';
import './modal.css'

const Modal = ({ onClose, state }) => {
    const buttons = ["이해하지 못함", "30%", "50%", "70%", "90% 이상"];

    return (
        <div className='modal'>
            <div className='modal-bg' >
            </div>
            <div className='modal-body'>
                <div className='modal-header'>
                    학습 {state} <br />
                    내용을 얼마나 이해하셨나요?
                </div>
                <div className='modal-content'>
                    {
                        buttons.map((item,) => (
                            <div className='modal-content-btn'>{item}</div>
                        ))
                    }
                </div>
                <div className='modal-footer' onClick={onClose}>
                    확인하기
                </div>
            </div>
        </div>
    );
}

export default Modal;
