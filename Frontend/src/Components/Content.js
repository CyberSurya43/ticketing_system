import React from "react";
import TicketRaise from "../ContentComponents/TicketRaise";
import Home from "../ContentComponents/Home";
import AdminHome from "../ContentComponents/AdminHome";
import Profile from "../ContentComponents/Profile";
import History from "../ContentComponents/History";
import AssignedTickets from "../ContentComponents/AssignedTickets";
import Members from "../ContentComponents/Members";
import AgentHistory from "../ContentComponents/AgentHistory";
import AdminHistory from "../ContentComponents/AdminHistory";
import AgentHome from "../ContentComponents/AgentHome";
const Content= (props) => {
    if(props.page === 0){
        return (
            <div><Home/></div>
            );
    }
    else if(props.page === 1){
        return (
            <div><TicketRaise/></div>
            );
    }
    else if(props.page === 2){
        return (
            <div><History/></div>
            );
    }
    else if(props.page === 3){
        return (
            <div><Profile/></div>
            );
    }
    else if(props.page === 4){
        return (
            <div><AssignedTickets/></div>
            );
    }
    else if(props.page === 5){
        return (
            <div><Members/></div>
            );
    }
    else if(props.page === 6){
        return (
            <div><AgentHistory/></div>
            );
    }
    else if(props.page === 7){
        return (
            <div><AdminHistory/></div>
            );
    }
    else if(props.page === 8){
        return (
            <div><AdminHome/></div>
            );
    }
    else if(props.page === 9){
        return (
            <div><AgentHome/></div>
            );
    }
}

export default Content;