import React, { useState } from 'react';
import './modal.css'
import LongButton from './LongButton';
import Chip from './Chip';

const Modal = ({ onClose }) => {

    
    return (
        <div className='modal'>
            <div className='modal-bg' >
            </div>
            <div className='modal-body'>
                <div className='modal-header'>
                    오늘도 수고했어요!
                </div>
                <div className='modal-content'>

                </div>
                <LongButton
                colour="purple"
                content="닫기"
                onClick={onClose}
                />
            </div>
        </div>
    );
}

export default Modal;
