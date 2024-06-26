import React, { useEffect } from 'react'
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import mainIllust from '../img/Illustration.png';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import KakaoLogin, { kakaoLogin } from '../components/KakaoLogin'
import './css/loginPage.css'

const LoginPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const goToMain = (user) => {
        navigate("/", { state: { user: user } });
    };
    const makeDescriptionMeta = () => {
        const meta = document.createElement('meta');
        meta.setAttribute('referrer', 'no-referrer');
        document.getElementsByTagName('head')[0].appendChild(meta);
    }
const handleGoogleLogin = (res) =>{
    
    const addUser = async (user) => {
        const response = await axios.post(`${process.env.REACT_APP_MOD || ""}/api/adduser`, { user: user })
        console.log(response.data);
    }
    let userObj = jwtDecode(res.credential);

    let userInfo = {
        name: userObj.name,
        email: userObj.email,
        picture: userObj.picture
    }

    addUser(userInfo);


    goToMain(userObj);
}

    useEffect(() => {


        makeDescriptionMeta();

    }, []);
    return (
        <div className='login-page'>

            {/* 로고 */}
            <div className='logo-wrapper'>
                <img src={mainIllust} className='logo-image'
                    alt='logo'></img>
                <div className='logo-text'>Mimos</div>
            </div>

            {/* 카카오 로그인  */}
            <div className='login-btn-wrapper'>
                <KakaoLogin></KakaoLogin>

                {/* 구글 로그인 */}
                <GoogleLogin
                    className="google-login-btn"
                    onSuccess={(res) => {handleGoogleLogin(res)
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