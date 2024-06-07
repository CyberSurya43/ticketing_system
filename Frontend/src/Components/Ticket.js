import React from "react";
const Ticket= (props)=>{
    return(
    <div>
      <div className="Card-box bg-[#eecea4]  w-[70%] h-[150px] mx-auto mt-[20px] p-[10px] rounded-[15px]">
        <div className="flex justify-between items-center">
            <p className="bg-[#0F2C59] text-white p-[5px] rounded-[15px] w-fit tooltip">#{props.id} <span className="tooltiptext">Home</span></p>
            <p className=" bg-[#0F2C59] text-white w-[25px] h-[25px] rounded-[50%] text-center">{props.priority}</p>
        </div> 
        <div className=" p-[10px] mx-auto flex justify-around">
        <p className="bg-[#0F2C59] text-white p-[5px] rounded-[15px] w-fit">{props.category}</p> 
           <p className=" bg-[#0F2C59] text-white rounded-[15px] w-fit p-[5px]">{props.description}</p>
          
           <p className=" bg-[#0F2C59] text-white rounded-[15px] w-fit p-[5px]">Status:{props.status}</p> 
       </div> 
       <div><button></button></div>   
      </div>
    </div>
   
    );   
  }
  export default Ticket;