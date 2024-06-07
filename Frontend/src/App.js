import './App.css';
import Login from './Pages/Login';
import Newbie from './Pages/Newbie';
import User from './Pages/User';
import Agent from './Pages/Agent';
import Admin from './Pages/Admin';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route exact path="/Newbie" element={<Newbie/>} />
          <Route exact path="/User" element={<User/>} />
          <Route exact path="/Agent" element={<Agent/>} />
          <Route exact path="/Admin" element={<Admin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
