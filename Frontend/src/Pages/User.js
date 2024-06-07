import React, { useEffect, useState } from "react";
import Navbar from "../Components/NavBar";
import SideBar from '../Components/SideBar';
import Content from '../Components/Content';
import "./User.css";
import { useNavigate } from "react-router-dom";
const User = () => {
  const nav = useNavigate();
  const role = sessionStorage.getItem('dept');
  useEffect(() => {
    try {
      fetch('http://192.168.0.53:5000/img', {
        headers: {
          'Content-Type': 'image/jpeg',
          'access-token': sessionStorage.getItem('token')
        }
      }).then(async (res) => {
        if (res.status === 200 && role === 'User') {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          sessionStorage.setItem('url',url);
        }
        else {
          nav("/");
        }
      })
    }
    catch (error) {
      console.log("error");
    }
  }, [])
  const [page, setPage] = useState(0);
  return (
    <div>
      <div className="outer-grid-box">
        <div className="navbar"><Navbar setPage={setPage} role={role} /></div>
        <div className="inner-grid-box sm:grid-cols-[8%,92%] md:grid-cols-[6%,94%] lg:grid-cols-[5%,95%] xl:grid-cols-[4%,96%] ">
          <div className="side"><SideBar setPage={setPage} role={role}/></div>
          <div className="content"><Content page={page} /></div>
        </div>

        <div className="footer text-2xl text-white text-center fixed bottom-0 w-[100%]"><h1 className='mt-[15px]'>For further information contact admin</h1></div>
      </div>
    </div>
  );
}
export default User;