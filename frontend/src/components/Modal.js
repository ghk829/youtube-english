import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './modal.css'
import LongButton from './LongButton';

const Modal = ({ onClose, isLoggedIn }) => {

    const navigate = useNavigate();

    const goLogin = () => {
        onClose();
        navigate("/login");

    }
    const goHome = () => {
        onClose();
        navigate("/");

    }

    return (
        <div className='modal'>
            <div className='modal-bg' >
            </div>
            <div className='modal-body'>
                <div className='modal-header'>
                    {isLoggedIn ? <div>오늘도 수고했어요!</div> : <div>
                        로그인을 하면<br />나의 학습 일수를 기록할 수 있어요!</div>}
                </div>
                <div className='modal-content'>

                    {isLoggedIn ? <div className='modal-studied-number'
                    
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}>
                        <svg width="21" height="29" viewBox="0 0 21 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5011 28.6667C8.49731 28.6665 6.53977 28.0643 4.88231 26.9383C3.22485 25.8122 1.9439 24.2142 1.20556 22.3514C0.467223 20.4886 0.30554 18.4469 0.741479 16.4911C1.17742 14.5353 2.19087 12.7556 3.65044 11.3827C5.43977 9.69867 9.83444 6.66667 9.16777 0C17.1678 5.33333 21.1678 10.6667 13.1678 18.6667C14.5011 18.6667 16.5011 18.6667 19.8344 15.3733C20.1944 16.404 20.5011 17.512 20.5011 18.6667C20.5011 21.3188 19.4475 23.8624 17.5722 25.7377C15.6968 27.6131 13.1533 28.6667 10.5011 28.6667Z" fill="#B076F9" />
                        </svg>
                        <span
                            style={{
                                fontWeight: 700,
                                fontSize: "24px",
                                color: "#B076F9"
                            }}
                        >+1</span>

                    </div> : <div className='modal-studied-wrapper'>
                        학습 일수
                        <div className='modal-studied-number'>
                            <svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.50044 18.1667C5.24807 18.1666 4.02461 17.7902 2.9887 17.0864C1.95279 16.3826 1.1522 15.3839 0.690733 14.2196C0.22927 13.0554 0.128218 11.7793 0.40068 10.5569C0.673142 9.33456 1.30655 8.22223 2.21878 7.36417C3.33711 6.31167 6.08378 4.41667 5.66711 0.25C10.6671 3.58333 13.1671 6.91667 8.16711 11.9167C9.00044 11.9167 10.2504 11.9167 12.3338 9.85833C12.5588 10.5025 12.7504 11.195 12.7504 11.9167C12.7504 13.5743 12.092 15.164 10.9199 16.3361C9.74776 17.5082 8.15805 18.1667 6.50044 18.1667Z" fill="#913FF7" />
                            </svg> 100
                        </div>
                    </div>}
                    <div className='example-box'>


                    </div>
                </div >

                <div className='modal-btns'>
                    {isLoggedIn ? <></> :
                        <div className='modal-btn'
                        style={{
                            marginTop: "80px"
                        }}>
                            <LongButton
                                color="purple"
                                content="로그인하기"
                                onClick={goLogin}
                                width="250px"
                            />
                        </div>}
                    <div className='modal-btn'>
                        <LongButton
                            color="purpleLine"
                            content="학습 종료하기"
                            onClick={goHome}
                            width="250px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Modal;
