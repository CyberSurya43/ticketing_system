import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFilter } from 'react-icons/fa';
import "../ContentComponents/Home.css";
const asignoptions = [
    { value: "User", label: "User" },
    { value: "IT Support", label: "IT Support" },
    { value: "Hardware", label: "Hardware" },
    { value: "Food", label: "Food" },
];

const FilterMembers = () => {
    const nav = useNavigate();
    const [asign, setAsign] = useState(asignoptions.label);
    const [tabledata, setTabledata] = useState([]);

    const handleChange = async () => {
        await axios.get(`http://192.168.0.53:5000/members/${asign}`, {
            headers: {
                'Content-Type': 'application/json',
                'access-token': sessionStorage.getItem('token')
            },
        }).then(async (result) => {
            console.log(result.data);
            setTabledata(result.data);
            return result.data;
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
        <div>
            <div className="h-[60vh]">
                <div className="bg-[skyblue] h-[15vh]">
                    <h1 className="text-[#0f2c59] text-2xl text-center p-[5px]">Ticket Details</h1>
                    <div className="flex justify-evenly w-[100%] mt-[10px]">
                        <Select className="btn" options={asignoptions} styles={customStyles} onChange={(e) => setAsign(e.label)} />
                        <button className="bg-[#0F2C59] text-white text-xl p-[10px] flex rounded-[10px]" onClick={() => handleChange()}><div>Filter</div><div className="mt-[4px]"><FaFilter size={20} /></div></button>
                    </div>
                </div>
                <div className="ml-[30%] w-[50%]">
                    <table className="styled-table">
                        <thead>
                            <tr>
                            <td>Employee_Id</td>
                            <td>Email</td>
                            <td>Name</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tabledata.map((e) => {
                                    return (
                                        <tr key={e.emp_id}>
                                            <td>{e.emp_id}</td>
                                            <td>{e.email}</td>
                                            <td>{e.name}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default FilterMembers;