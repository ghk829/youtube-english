import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './page/LoginPage';
import MainPage from './page/MainPage';
import DetailPage from './page/DetailPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path='/'
          element={<MainPage />}
        />

        <Route
          exact
          path='/login'
          element={<LoginPage />}
        />

        <Route
          exact
          path='/detail'
          element={<DetailPage />}
        />


        {/* <Route
        exact
        path='/detail/:id'
        element={<DetailPage/>}
        /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
