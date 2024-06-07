import React from "react";
import { AiFillHome } from 'react-icons/ai';
import { ImTicket } from 'react-icons/im';
import { AiOutlineHistory } from 'react-icons/ai';
import {VscOrganization} from 'react-icons/vsc';

const SideBar = (props) => {
    if (props.role === 'User') {
        return (
            <div className="side">
                <button onClick={(e) => props.setPage(0)} className="options mx-auto hover:scale-125 tooltip mt-[120px]"><AiFillHome size={30} color="white" /> <span className="tooltiptext">Home</span></button>
                <button onClick={(e) => props.setPage(1)} className="options mx-auto hover:scale-125 tooltip"><ImTicket size={30} color="white" /> <span className="tooltiptext">Raise Ticket</span></button>
                <button onClick={(e) => props.setPage(2)} className="options mx-auto hover:scale-125 tooltip"><AiOutlineHistory size={30} color="white" /> <span className="tooltiptext">History</span></button>
            </div>
        );
    }
    if (props.role === 'Help Desk') {
        return (
            <div className="side">
                <button onClick={(e) => props.setPage(9)} className="options mx-auto hover:scale-125 tooltip mt-[120px]"><AiFillHome size={30} color="white"  /> <span className="tooltiptext">Home</span></button>
                <button onClick={(e) => props.setPage(4)} className="options mx-auto hover:scale-125 tooltip"><ImTicket size={30} color="white" /> <span className="tooltiptext">Assigned Tickets</span></button>
                <button onClick={(e) => props.setPage(6)} className="options mx-auto hover:scale-125 tooltip"><AiOutlineHistory size={30} color="white" /> <span className="tooltiptext">History</span></button>
            </div>
        );
    }
    if (props.role === 'Admin') {
        return (
            <div className="side">
                <button onClick={(e) => props.setPage(8)} className="options mx-auto hover:scale-125 tooltip mt-[120px]"><AiFillHome size={30} color="white" /> <span className="tooltiptext">Home</span></button>
                <button onClick={(e) => props.setPage(5)} className="options mx-auto hover:scale-125 tooltip"><VscOrganization size={30} color="white" /> <span className="tooltiptext">Members</span></button>
                <button onClick={(e) => props.setPage(7)} className="options mx-auto hover:scale-125 tooltip"><ImTicket size={30} color="white" /> <span className="tooltiptext">Ticket Details</span></button>
            </div>
        );
    }
}

export default SideBar;