import {  BrowserRouter,  Routes,   Route  } from 'react-router-dom';
import './App.css';
import LoginPage from './screen/LoginPage';
import MainPage from './screen/MainPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
        exact
        path='/'
        element={<MainPage/>}
        />
        <Route
        exact
        path='/login'
        element={<LoginPage/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
