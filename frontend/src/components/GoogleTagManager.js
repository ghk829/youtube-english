import React, {useEffect} from 'react'
import ReactGA from "react-ga4";

const GoogleTagManager = ({gtmId}) =>{
    useEffect(()=>{

        ReactGA.initialize(gtmId);

    }, [gtmId]);

    return <></>;
}

export default GoogleTagManager;