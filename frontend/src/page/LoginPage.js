import React from 'react'
import { GoogleLogin } from "@react-oauth/google";
import kakaoLogin from '../img/kakao_login.png';
import { useNavigate } from "react-router-dom";
import mainIllust from '../img/Illustration.png';
import { jwtDecode } from "jwt-decode";
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
                <img src={mainIllust} className='logo-image'
                alt='logo'></img>
                <div className='logo-text'>Mimos</div>
            </div>

            {/* 카카오 로그인 (클릭시 메인 페이지 바로 이동) */}
            <div className='login-btn-wrapper'>
                <img src={kakaoLogin}
                alt='kakao-login'
                    onClick={goToMain}
                    className="kakao-login-btn" />

                {/* 구글 로그인 */}
                <GoogleLogin
                    className="google-login-btn"
                    onSuccess={(res) => {
                        console.log(res);
                        let userObj = jwtDecode(res.credential);
                        console.log(userObj);

                        goToMain();
                    }}
                    onError={() => {
                        console.log("Error while login with google")
                    }}
                    width={"300px"}
                />

            </div>
        </div>
    )
}

export default LoginPage;