import React, {useEffect} from 'react'
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const Auth = () => {
    useEffect(()=>{
        const code = new URL(window.location.href).searchParams.get("code");
        console.log(jwtDecode(code.toString()));
    }, [])
    return (
        <div>로그인 중입니다...</div>
    )
}

export default Auth;