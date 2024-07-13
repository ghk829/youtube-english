import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export function Redirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  useEffect(() => {
    const fetchData = async () => {

      const addUser = async (user) => {
        await axios.post(`${process.env.REACT_APP_MOD || ""}/api/adduser`, { user: user });
      }
      
      try {
        const response = await fetch(`/api/kakao?code=${code}`, {
          method: "POST",
          headers: headers,
        });
        const userData = await response.json();

        let userInfo = {
          name: userData.name,
          email: userData.email||(userData.name+userData.picture),
          picture: userData.picture
        }

        addUser(userInfo);
        localStorage.setItem("name", userData.name);
        navigate("/", { state: { user: userData } });

      } catch (error) {
        console.error("오류 발생", error);
      }
    };
    fetchData();
  }, [navigate, code]);

  return (
    <div>
      <h1>로그인 중입니다.</h1>
    </div>
  );
}

export default Redirect;
