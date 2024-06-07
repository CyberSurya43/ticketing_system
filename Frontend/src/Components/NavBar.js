import React from "react";
import { FaHandsHelping } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
const NavBar = (props) => {
    const nav = useNavigate();
    return (
        <div >
            <div className="flex justify-between w-[100%] mt-[10px]">
                <div className="text-white my-auto flex pl-[10px]"><FaHandsHelping size={30} color="white" /><h1 className="ml-[10px] my-auto">HelpSupport</h1></div>
                <div className="flex items-center w-[500px] justify-around">
                    <div><button className="bg-white text-[#0F2C59] text-[16px] p-[5px] flex hover:scale-[1.1]" onClick={()=>{nav("/")}}><div className="mr-[10px]">Logout</div><div><RiLogoutBoxLine size={20}/></div></button></div>
                    <div ><button onClick={(e) => props.setPage(3)} className="tooltip bg-white p-[2px]"><CgProfile size={30} color="[#0F2C59]" /><span className="tooltiptext">Profile</span></button></div>
                    <div className="text-xl text-white">Welcome {props.role}</div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;