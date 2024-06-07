import React  from "react";
import UserTickets from "../Utils/UserTickets";
import Ticket from "./Ticket";
const AvailableTickets = ()=>{
    return(
      <div>
        <h1 className="text-center text-2xl mt-[20px]">Raised Tickets</h1>
        <div className="mx-auto">
          {
            UserTickets.map((item)=>{
              return <Ticket key={item.id} id={item.id} category={item.category} priority={item.priority} description={item.description} status={item.status}></Ticket>
            })
          }
        </div>
        </div>
    );
  } 
  
  export default AvailableTickets;