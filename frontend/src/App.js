import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
// Pages
import LoginPage from "./page/LoginPage";
import MainPage from "./page/MainPage";
import DetailPage from "./page/DetailPage";
// import AddVideo from "./page/admin/AddVideo";
import Redirect from "./page/Redirect";
import WordListPage from "./page/WordListPage.tsx";
// Components
import BottomBar from "./components/Common/BottomBar.tsx";
import QuickMenuDetail from "./page/QuickMenuDetail.tsx";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const location = useLocation();

  // 바텀 바가 필요한 페이지의 경로를 배열로 정의
  const pathsWithBottomBar = ["/", "/word-list", "/video"];

  // 현재 경로가 바텀 바가 필요한 경로에 포함되어 있는지 확인
  const showBottomBar = pathsWithBottomBar.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<MainPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/detail" element={<DetailPage />} />
        {/* <Route exact path='/video-add' element={<AddVideo />} /> */}
        <Route exact path="/video" element={<QuickMenuDetail />} />
        <Route path="/word-list" element={<WordListPage />} />
        <Route path="/oauth" element={<Redirect />} />
      </Routes>
      {showBottomBar && <BottomBar />} {/* 바텀 바 렌더링 */}
    </>
  );
}

export default App;
