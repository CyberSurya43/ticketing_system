import { RiLogoutBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
const Newbie = () => {
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
            if (res.status === 200 && role === 'Pending') {
               const blob = await res.blob();
               const url = URL.createObjectURL(blob);
               sessionStorage.setItem('url', url);
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
   return (
      <div>
         <div className="grid place-items-center h-[100vh]">
            <div className="bg-[#0F2C59] text-white text-center h-[50vh] w-[80%] grid place-items-center rounded-[10px] shadow-2xl justify-center">
               <div><h1 className="text-2xl">Admin Still hasn't Provide a role for you!</h1></div>
               <div className="bg-white text-[#0F2C59] hover:scale-[1.1]"><button className="flex p-[10px]" onClick={() => nav("/")}><div className="text-2xl">Logout to Home Page</div><div><RiLogoutBoxLine size={30} color="[#0F2C59]" /></div></button></div>
            </div>
         </div>

      </div>
   );
}
export default Newbie;