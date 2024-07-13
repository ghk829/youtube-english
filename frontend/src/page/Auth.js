import React, {useEffect} from 'react'
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const Auth = () => {
    useEffect(()=>{
        const code = new URL(window.location.href).searchParams.get("code");
        localStorage.setItem("name", code.name);
    }, [])
    return (
        <div>로그인 중입니다...</div>
    )
}

export default Auth;