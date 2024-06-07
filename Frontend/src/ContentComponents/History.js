import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import logo from "../Assests/no_image.png";
import { FaFilter } from 'react-icons/fa';
import "../ContentComponents/Home.css";
import { Watch } from  'react-loader-spinner';
const History = () => {
    const asignoptions = [
        { value: "open", label: "open" },
        { value: "process", label: "process" },
        { value: "on hold", label: "on hold" },
        { value: "closed", label: "closed" },
        { value: "re-open", label: "re-open" }
    ];
    const [tabledata, setTabledata] = useState([]);
    const [asign, setAsign] = useState(asignoptions.label);
    const [reopentrue, setReopentrue] = useState(false);
    const [enableform, setEnableform] = useState(false);
    const [ticket, setTicket] = useState(0);
    const [descr, setDesc] = useState("");
    const [subject, setSubject] = useState("");
    const [file, setFile] = useState(null);
    const [confirm, setConfirm] = useState(0);
    const nav = useNavigate();
    const [visible,setVisible]=useState(0);

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
        if (asign === 'closed') {
            setReopentrue(true);
        }
        else {
            setReopentrue(false);
        }
    }
    const handleChanged = (e) => {
        if (e.target.name === 'description') {
            setDesc(e.target.value);
        }
        if (e.target.name === 'filename') {
            let str = e.target.files[0].name;
            let format = str.split(".");
            if (format[1] === 'jpeg' || format[1] === 'png') {
                setFile(e.target.files[0]);
                setConfirm(1);
            }
            else {
                setConfirm(0);
                Swal.fire({
                    icon: 'error',
                    title: 'Wrong Credential!',
                    text: 'Select .jpeg or .png file',
                })
            }

        }
        if (e.target.name === 'subject') {
            setSubject(e.target.value);
        }
    }
    const checkSubmit = (e) => {
        setVisible(100);
        e.preventDefault();
        let count = 0;
        if (subject === '') {
            Swal.fire({
                icon: 'error',
                title: 'Missing Credentials!',
                text: 'Explain the subject',
            })
            return;
        }
        else {
            count++;
        }
        if (descr === '') {
            Swal.fire({
                icon: 'error',
                title: 'Missing Credentials!',
                text: 'Explain your problem in description',
            })
            return;
        }
        else {
            count++;
        }
        if (file === null || confirm === 1) {
            count++;
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Wrong Credential!',
                text: 'Select .jpeg or .png file',
            })
        }
        if (count === 3) {
            handleSubmit();
        }
    }
    const handleSubmit = async () => {
        const fd = new FormData();
        fd.append('ticket_id', ticket);
        fd.append('subject', subject);
        fd.append('descr', descr);
        fd.append('file', file);
        try {
            await axios.post("http://192.168.0.53:5000/reopenTicket", fd, {
                headers: {
                    'access-token': sessionStorage.getItem('token')
                },
            }
            ).then(res => {
                if (res.status === 200) {
                    setVisible(0);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your ticket is Reopened',
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {
                        window.location.reload();
                    })
                }
                else {
                    console.log("Failure");
                }
            })
        } catch (error) {
            console.log(error);
        }

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
                <h1 className="text-[#0F2C59] text-2xl text-center p-[5px]">Ticket Details</h1>
                <div className="flex justify-evenly w-[100%] mt-[10px]">
                    <Select className="btn" options={asignoptions} styles={customStyles} onChange={(e) => setAsign(e.label)} />
                    <button className="bg-[#0F2C59] text-white text-xl p-[10px] flex rounded-[10px]" onClick={() => handleChange()}><div>Filter</div><div className="mt-[4px]"><FaFilter size={20} /></div></button>
                </div>
            </div>
            
            <div className="grid grid-cols-[60%,40%] h-[60vh] w-[100%]">
                <div className="mx-auto w-[90%]">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <td>Ticket_Id</td>
                                <td>Department</td>
                                <td>Subject</td>
                                <td>Description</td>
                                <td>Agent_Id</td>
                                <td>Parent_Ticket</td>
                                <td>Proofs</td>
                                <td>set Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tabledata.map((e) => {
                                    let department = "";
                                    if (e.dept_id === 301) {
                                        department = "IT Support"
                                    }
                                    else if (e.dept_id === 302) {
                                        department = "Hardware"
                                    }
                                    else {
                                        department = "Food"
                                    }
                                    return (
                                        <tr key={e.ticket_id}>
                                            <td>{e.ticket_id}</td>
                                            <td>{department}</td>
                                            <td>{e.subject}</td>
                                            <td>{e.descr}</td>
                                            <td>{e.agent_id}</td>
                                            <td>{e.p_ticket_id}</td>
                                            <td><button className="bg-[#022A57] text-white" onClick={() => getImage(e.ticket_id)}>View Image</button></td>
                                            <td><button style={{ display: reopentrue ? "block" : "none" }} onClick={() => { setEnableform(true); setTicket(e.ticket_id) }} className="bg-[#022A57] text-white mt-[10px]">Re-Open</button></td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: enableform ? "block" : "none" }} >
                    <div>
                        <form style={{opacity :visible? 0 : 100}}>
                            <div className="bg-[skyblue] h-[60vh] w-[80%] mx-auto mt-[20px] items-center grid place-items-center">
                                <div className="mt-[25px] flex justify-evenly flex-col items-center">
                                    <div><label className="text-xl">Subject</label></div>
                                    <div><input type="text" name="subject" className="p-[5px] rounded-[10px]" onChange={handleChanged}></input></div>
                                </div>
                                <div className="mt-[25px] flex justify-evenly flex-col items-center">
                                    <div><label className="text-xl">Description</label></div>
                                    <div><textarea className="textarea p-2" name="description" rows={5} cols={30} maxLength={100} onChange={handleChanged}></textarea></div>
                                </div>
                                <div className="mt-[20px] text-center">
                                    <div><label className="text-xl">Files/Images</label></div>
                                    <div className="mt-[15px]"> <input type="file" name="filename" onChange={handleChanged} /></div>
                                </div>
                                <div className="flex justify-center"><button onClick={checkSubmit} className="bg-white p-3 mt-[20px] rounded-[15px] w-[150px] hover:bg-[#0F2C59] hover:text-white">Submit</button></div>

                            </div>
                        </form>
                        <form className="absolute top-[400px] right-[320px] "  style={{opacity :visible? 100 : 0}}>
                    <div className="relative"><Watch
                       height="80"
                       width="80"
                       radius="48"
                       color="#0f2c59"
                       ariaLabel="watch-loading"
                       wrapperStyle={{}}
                       wrapperClassName=""
                       visible={true}
                    /></div>
                    <h1 className="w-[500px] mt-[20px] text-2xl mr-[50px] absolute left-[-120px]">Your Ticket is being Processed</h1>
                </form>
                    </div>
                </div>


            </div>


        </div>
    );
}
export default History;