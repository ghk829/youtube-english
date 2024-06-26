import React from 'react'
import kakaoLogin from '../img/kakao_login.png';

const KakaoLogin = () =>{
    const Rest_api_key = process.env.REACT_APP_REST_API_KAKAO;
    const Redirect_uri =process.env.REACT_APP_REDIRECT_URI;

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${Redirect_uri}&response_type=code`

    const handleLogin = () =>{
        window.location.href = kakaoURL;
    }

    return(
        
        <img src={kakaoLogin}
        alt='kakao-login'
            onClick={handleLogin}
            className="kakao-login-btn" />
    )
}

export default KakaoLogin