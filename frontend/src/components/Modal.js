import React, { useState } from 'react';
import './modal.css'
import LongButton from './LongButton';
import fireIcon from '../img/icon/fire.svg'

const Modal = ({ onClose }) => {

    
    return (
        <div className='modal'>
            <div className='modal-bg' >
            </div>
            <div className='modal-body'>
                <div className='modal-header'>
                    오늘도 수고했어요!
                </div>
                <div className='modal-icon'>
                    <object data={fireIcon}></object>
                    <span style={{fontWeight: "700", fontSize: "24px", lineHeight: "36px", color: " #B076F9" }}>+1</span>
                </div>
                <div className='modal-content'>

                </div >
                <div className='modal-btn'>
                <LongButton
                colour="purple"
                content="홈으로 돌아가기"
                onClick={onClose}
                />
                </div>
            </div>
        </div>
    );
}


export default Modal;
