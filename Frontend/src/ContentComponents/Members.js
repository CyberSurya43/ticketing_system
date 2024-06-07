import React, { useState, useEffect } from "react";
import FilterMembers from "../Components/FilterMembers";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "../ContentComponents/Home.css"
import { Audio } from 'react-loader-spinner';
const Members = () => {
  const nav = useNavigate();
  const [asign, setAsign] = useState();
  const asignoptions = [
    { value: "User", label: "User" },
    { value: "IT Support", label: "IT Support" },
    { value: "Hardware", label: "Hardware" },
    { value: "Food", label: "Food" }
  ];

   const [payload,setPayload]=useState([]);

  useEffect(() => {
    axios.get(`http://192.168.0.53:5000/members/Pending`, {
      headers: {
        'Content-Type': 'application/json',
        'access-token': sessionStorage.getItem('token')
      },
    }).then(async (result) => {
      setPayload(result.data);
      return result.data;
    }).catch((err) => {
      nav('/');
    });
  },[])
    
  const setRole = ()=>{
    fetch(`http://192.168.0.53:5000/editStatus/${sessionStorage.getItem('tempempid')}/${asign}`, {
      method:"PUT",
      headers: {
        'Content-Type': 'application/json',
        'access-token': sessionStorage.getItem('token')
      },
    }).then(async (result) => {
      console.log("Success");
      window.location.reload();
    }).catch((err) => {
      nav('/');
    });
  }
  const customStyles = {
    control: (provided) => ({
        ...provided,
        width: '200px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isSelected ? '#007bff' : 'white',
        color: state.isSelected ? 'white' : 'black',
    }),

};

  return (
    <div className="grid grid-rows-[35%,65%] h-[90vh]">
      <div className="bg-white h-[100%] grid place-items-center">
        <div className="bg-white h-[80%] w-[80%] grid justify-center mx-auto">
          <div className="table">
            <table className="styled-table">
              <thead>
                <tr>
                <td>Employee_Id</td>
                <td>Email</td>
                <td>Name</td>
                <td>Asign_Role</td>
                <td>Confirm</td>
                </tr>
              </thead>
              <tbody>
                {
                  payload.map((e) => {
                    return (
                      <tr key={e.emp_id}>
                        <td>{e.emp_id}</td>
                        <td>{e.email}</td>
                        <td>{e.name}</td>
                        <td> <Select className="btn" options={asignoptions}  styles={customStyles} onChange={(e) => setAsign(e.label)} /></td>
                        <td><button className=" bg-[#022A57] text-white" onClick={()=>{sessionStorage.setItem('tempempid',e.emp_id); setRole()}}>Confirm</button></td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div><FilterMembers /></div>
    </div>
  );
}
export default Members;