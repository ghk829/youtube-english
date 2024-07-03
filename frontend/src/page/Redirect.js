import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export function Redirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/kakao?code=${code}`, {
          method: "POST",
          headers: headers,
        });
        const userData = await response.json();
        console.log(userData);
        navigate("/");
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
