import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './page/LoginPage';
import MainPage from './page/MainPage';
import DetailPage from './page/DetailPage';
import AddVideo from './page/AddVideo';
import Redirect from './page/Redirect'

function App() {
  return (
    <>
      <BrowserRouter  basename={process.env.PUBLIC_URL}>
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
          <Route
            exact
            path='/video-add'
            element={<AddVideo />}
          />

          <Route
            path='/oauth'
            element={<Redirect />}
          />


          {/* <Route
        exact
        path='/detail/:id'
        element={<DetailPage/>}
        /> */}

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
