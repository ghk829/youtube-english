import React, {useEffect} from 'react'
const Auth = () => {
    const code = new URL(window.location.href).searchParams.get("code");
    useEffect(()=>{
        console.log(code)
    }, [])
    return (
        <>인증중</>
    )
}

export default Auth;