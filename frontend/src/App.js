import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginScreen from './Screens/LoginScreen.js';
import HomeScreen from './Screens/HomeScreen.js';
import RegisterScreen from './Screens/RegisterScreen.js';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <HomeScreen /> } />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </div>
  );
}

export default App;
