import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import logo from "../Assests/no_image.png";
import { FaFilter } from 'react-icons/fa';
const AgentHistory = () => {
    const asignoptions = [
        { value: "open", label: "open" },
        { value: "process", label: "process" },
        { value: "on hold", label: "on hold" },
        { value: "closed", label: "closed" },
        { value: "re-open", label: "re-open" }
    ];
    const [tabledata, setTabledata] = useState([]);
    const [asign, setAsign] = useState(asignoptions.label);
    const nav = useNavigate();

    const handleChange = async () => {
        await axios.get(`http://192.168.0.53:5000/getTicket/${asign}`, {
            headers: {
                'Content-Type': 'application/json',
                'access-token': sessionStorage.getItem('token')
            },
        }).then(async (result) => {
            setTabledata(result.data);
            return result.data;
        }).catch((err) => {
            nav('/');
        });
    }

    const getImage = (id) => {
        fetch(`http://192.168.0.53:5000/getTicketImg/${id}`, {
            headers: {
                'Content-Type': 'image/jpeg',
                'access-token': sessionStorage.getItem('token')
            },
        }).then(async (res) => {
            if (res.status === 204) {
                Swal.fire({
                    imageUrl: logo,
                    imageWidth: 800,
                    imageHeight: 500,
                    imageAlt: 'Proof',
                })
            }
            if (res.status === 200) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                Swal.fire({
                    imageUrl: url,
                    imageWidth: 800,
                    imageHeight: 500,
                    imageAlt: 'Proof',
                })
            }
        }).catch((error) => {
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
            <div className="bg-[skyblue] h-[15vh]">
                <h1 className="text-[#0f2c59] text-2xl text-center p-[5px]">Ticket Details</h1>
                <div className="flex justify-evenly w-[100%] mt-[10px]">
                    <Select className="btn" options={asignoptions} styles={customStyles} onChange={(e) => setAsign(e.label)} />
                    <button className="bg-[#0F2C59] text-white text-xl p-[10px] flex rounded-[10px]" onClick={() => handleChange()}><div>Filter</div><div className="mt-[4px]"><FaFilter size={20} /></div></button>
                </div>
            </div>
            <div className="ml-[20%]">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <td>Ticket_Id</td>
                                <td>Employee_Id</td>
                                <td>Subject</td>
                                <td>Parent_Ticket</td>
                                <td>Proof</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tabledata.map((e) => {
                                    return (
                                        <tr key={e.ticket_id}>
                                            <td>{e.ticket_id}</td>
                                            <td>{e.emp_id}</td>
                                            <td>{e.subject}</td>
                                            <td>{e.p_ticket_id}</td>
                                            <td><button className="bg-[#022A57] text-white p-[5px]" onClick={() => getImage(e.ticket_id)}>View Image</button></td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
        </div>
    );
}
export default AgentHistory;