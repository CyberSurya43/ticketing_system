import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import logo from "../Assests/no_image.png";
import Swal from "sweetalert2";
import { FaFilter } from 'react-icons/fa';
const AssignedTickets = () => {
    const asignoptions = [
        { value: "open", label: "open" },
        { value: "re-open", label: "re-open" },
        { value: "process", label: "process" },
        { value: "on hold", label: "on hold" }
    ];
    const [processtrue, setProcesstrue] = useState(true);
    const [holdtrue, setHoldtrue] = useState(true);
    const [option, setOption] = useState("");
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
        if (asign === 'process') {
            setHoldtrue(true);
            setProcesstrue(!processtrue);
        }
        if (asign === 'on hold') {
            setProcesstrue(true);
            setHoldtrue(!holdtrue);
        }
        if (asign === 'open') {
            setHoldtrue(true);
            setProcesstrue(true);
        }
        if (asign === 'open') {
            setProcesstrue(true);
            setHoldtrue(true);
        }
    }
    if (option === 'closed') {
        let str = sessionStorage.getItem('id');
        Swal.fire({
            title: 'Do you want to close the ticket?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://192.168.0.53:5000/changeStatus`, {
                    method: "put",
                    headers: {
                        'Content-type': 'application/json',
                        'access-token': sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        'ticket_id': str,
                        'status': option
                    })
                }).then(async (result) => {
                    setOption("");
                    console.log(result);
                }).catch((error) => {
                    nav("/")
                }).then(() => {
                    Swal.fire('Ticket is Closed').then(() => {
                        window.location.reload();
                    })
                })
            }
            else {
                Swal.fire('Changes are not saved')
            }
        })
    }

    if (option === 'on hold') {
        let str = sessionStorage.getItem('id')
        Swal.fire({
            title: 'Do you want to hold the ticket?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://192.168.0.53:5000/changeStatus`, {
                    method: "put",
                    headers: {
                        'Content-type': 'application/json',
                        'access-token': sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        'ticket_id': str,
                        'status': option
                    })
                }).then(async (result) => {
                    setOption("");
                    console.log(result);
                }).catch((error) => {
                    nav("/")
                }).then(() => {
                    Swal.fire('Ticket is on hold').then(() => {
                        window.location.reload();
                    })
                })
            }
            else {
                Swal.fire('Changes are not saved')
            }
        })

    }
    if (option === 'process') {
        let str = sessionStorage.getItem('id')
        Swal.fire({
            title: 'Do you want to process the ticket?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://192.168.0.53:5000/changeStatus`, {
                    method: "put",
                    headers: {
                        'Content-type': 'application/json',
                        'access-token': sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        'ticket_id': str,
                        'status': option
                    })
                }).then(async (result) => {
                    setOption("");
                    console.log(result);
                }).catch((error) => {
                    nav("/")
                }).then(() => {
                    Swal.fire('Ticket is on process').then(() => {
                        window.location.reload();
                    })
                })
            }
            else {
                Swal.fire('Changes are not saved')
            }
        })

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
                console.log(blob);
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
                <h1 className="text-2xl text-center p-[20px] text-[#022A57">Assigned Tickets</h1>
                <div className="flex justify-evenly w-[100%] mt-[10px]">
                    <Select className="btn" options={asignoptions} styles={customStyles}  onChange={(e) => setAsign(e.label)} />
                    <button className="bg-[#0F2C59] text-white text-xl p-[10px] flex rounded-[10px]" onClick={() => handleChange()}><div>Filter</div><div className="mt-[4px]"><FaFilter size={20} /></div></button>
                </div>
            </div>
            <div className="ml-[15%]">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <td>Ticket_Id</td>
                            <td>Employee_Id</td>
                            <td>Subject</td>
                            <td>Parent_Ticket</td>
                            <td>Proof</td>
                            <td>Set Status</td>
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
                                        <td><div>
                                            <button className="bg-[#022A57] text-white p-[5px] mx-[10px]" onClick={() => { sessionStorage.setItem('id', e.ticket_id); setOption("closed"); }}>Close</button>
                                            <button className="bg-[#022A57] text-white p-[5px] mx-[10px]" style={{ display: holdtrue ? "block" : "none" }} onClick={() => { sessionStorage.setItem('id', e.ticket_id); setOption("on hold"); }}>Hold</button>
                                            <button className="bg-[#022A57] text-white p-[5px] mx-[10px]" style={{ display: processtrue ? "block" : "none" }} onClick={() => { sessionStorage.setItem('id', e.ticket_id); setOption("process"); }}>On Process</button>
                                        </div></td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default AssignedTickets;