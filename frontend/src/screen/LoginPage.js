import React from 'react'
import { GoogleLogin } from "@react-oauth/google";
import kakaoLogin from '../img/kakao_login.png';
import { useNavigate } from "react-router-dom";
import mainIllust from '../img/Illustration.png';
import './loginPage.css'

const LoginPage = () => {
    const navigate= useNavigate();

    const goToMain = () => {
        navigate("/");
      };

    return (
        <div className='login-page'>
            <div className='logo-wrapper'>
                <img src={mainIllust} className='logo-image'></img>
                <div className='logo-text'>Mimos</div>
            </div>
            <div className='login-btn-wrapper'>
                <img src={kakaoLogin} 
                onClick={goToMain}
                className="kakao-login-btn" />

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
                >

                </GoogleLogin>
            </div>
        </div>
    )
}

export default LoginPage;