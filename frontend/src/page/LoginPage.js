import React from 'react'
import { GoogleLogin } from "@react-oauth/google";
import kakaoLogin from '../img/kakao_login.png';
import { useNavigate } from "react-router-dom";
import mainIllust from '../img/Illustration.png';
import './loginPage.css'

const LoginPage = () => {
    const navigate = useNavigate();

    const goToMain = () => {
        navigate("/");
    };

    return (
        <div className='login-page'>

            {/* 로고 */}
            <div className='logo-wrapper'>
                <img src={mainIllust} className='logo-image'></img>
                <div className='logo-text'>Mimos</div>
            </div>

            {/* 카카오 로그인 (클릭시 메인 페이지 바로 이동) */}
            <div className='login-btn-wrapper'>
                <img src={kakaoLogin}
                    onClick={goToMain}
                    className="kakao-login-btn" />

                {/* 구글 로그인 */}
                <GoogleLogin
                    className="google-login-btn"
                    onSuccess={(credentialResponse) => {
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log("Error while login with google")
                    }}
                    width={"300px"}

                    useOneTap
                />

            </div>
        </div>
    )
}

export default LoginPage;