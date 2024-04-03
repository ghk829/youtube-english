import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './screen/LoginPage';
import MainPage from './screen/MainPage';
import DetailPage from './screen/DetailPage';
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
