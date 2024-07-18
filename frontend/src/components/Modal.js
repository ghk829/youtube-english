import React from 'react';
import { useNavigate } from "react-router-dom";
import './modal.css';
import LongButton from './LongButton';
import fire from '../img/icon/purpleFire.svg';
import lightFire from '../img/icon/fire.svg';

/**
 * Modal 컴포넌트
 *
 * - onClose: 모달을 닫을 때 호출되는 함수
 * - isLoggedIn: 로그인 상태
 */
const Modal = ({ onClose, isLoggedIn }) => {
    const navigate = useNavigate();

    // 로그인 페이지로 이동
    const goLogin = () => {
        onClose();
        navigate("/login");
    }

    // 홈 페이지로 이동
    const goHome = () => {
        onClose();
        navigate("/");
    }

    return (
        <div className='modal'>
            {/* 배경 */}
            <div className='modal-bg'></div>
            <div className='modal-body'>
                {/* 모달 헤더 */}
                <div className='modal-header'>
                    {isLoggedIn ? (
                        <div>오늘도 수고했어요!</div>
                    ) : (
                        <div>
                            로그인을 하면<br />나의 학습 일수를 기록할 수 있어요!
                        </div>
                    )}
                </div>
                {/* 모달 내용 */}
                <div className='modal-content'>
                    {isLoggedIn ? (
                        // 로그인 상태일 때 학습 일수 표시
                        <div
                            className='modal-studied-number'
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <object data={lightFire}></object>
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontSize: "24px",
                                    color: "#B076F9"
                                }}
                            >
                                +1
                            </span>
                        </div>
                    ) : (
                        // 비로그인 상태일 때 학습 일수 표시
                        <div className='modal-studied-wrapper'>
                            학습 일수
                            <div className='modal-studied-number'>
                                <object data={fire}></object>
                                100
                            </div>
                        </div>
                    )}
                    {/* 예시 박스 */}
                    <div className='example-box'></div>
                </div>
                {/* 모달 버튼 영역 */}
                <div className='modal-btns'>
                    {/* 로그인 버튼 */}
                    {!isLoggedIn && (
                        <div
                            className='modal-btn'
                            style={{ marginTop: "80px" }}
                        >
                            <LongButton
                                color="purple"
                                content="로그인하기"
                                onClick={goLogin}
                                width="250px"
                            />
                        </div>
                    )}
                    {/* 홈으로 버튼 */}
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
