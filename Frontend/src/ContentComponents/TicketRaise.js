import React, { useState } from "react";
import '../Pages/User.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Watch } from  'react-loader-spinner';
const TicketRaise = () => {
    const nav = useNavigate();
    const [category, setCat] = useState("");
    const [descr, setDesc] = useState("");
    const [subject, setSubject] = useState("");
    const [file, setFile] = useState(null);
    const [confirm, setConfirm] = useState(0);
    const [visible,setVisible]=useState(0);
    const setCategory = (props) => {
        if (document.querySelector(`.opt-${props}`).classList.contains('btn')) {
            document.querySelector(`.opt-${props}`).classList.remove('btn');
            setCat('');
        }
        else {
            setCat(document.querySelector(`.opt-${props}`).innerHTML);
            for (let i = 1; i <= 3; i++) {
                if (i === props) {
                    continue
                }
                document.querySelector(`.opt-${i}`).classList.remove('btn')
            }
            document.querySelector(`.opt-${props}`).classList.add('btn');
        }
    }

    const handleChange = (e) => {
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
        e.preventDefault();
        let count = 0;
        if (category === '') {
            Swal.fire({
                icon: 'error',
                title: 'Missing Credentials!',
                text: 'Select any Category',
            })
            return;
        }
        else {
            count++;
        }
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
        if (count === 4) {
            handleSubmit();
        }
    }


    const handleSubmit = async () => {
        setVisible(100);
        const fd = new FormData();
        fd.append('emp_id', sessionStorage.getItem('emp_id'));
        fd.append('category', category);
        fd.append('subject', subject);
        fd.append('descr', descr);
        fd.append('file', file);
        try {
            await axios.post("http://192.168.0.53:5000/user/newTicket", fd, {
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
                        title: 'Your ticket is Raised',
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



    return (

        <div className="p-[10px]">
            <div className="bg-[skyblue] w-[65%] mx-auto rounded-[15px] shadow-xl p-[20px] mt-[40px] relative">
                <form className="p-[25px]" style={{opacity :visible? 0 : 100}}>
                    <h1 className="text-2xl">Ticket Details</h1>
                    <div className="mt-[25px] text-center">
                        <div><label className="text-xl">Category/Department</label></div>
                        <div className="mt-[15px]">
                            <button className="bg-white text-[#0F2C59] p-3 ml-[20px] rounded-[15px] w-[150px] hover:scale-[1.1] opt-1" onClick={(e) => { e.preventDefault(); setCategory('1') }}>IT Support</button>
                            <button className="bg-white text-[#0F2C59] p-3 ml-[20px] rounded-[15px] w-[150px] hover:scale-[1.1] opt-2" onClick={(e) => { e.preventDefault(); setCategory('2') }}>Hardware</button>
                            <button className="bg-white text-[#0F2C59] p-3 ml-[20px] rounded-[15px] w-[150px] hover:scale-[1.1] opt-3" onClick={(e) => { e.preventDefault(); setCategory('3') }}>Food</button>
                        </div>
                    </div>
                    <div className="mt-[25px] flex justify-evenly flex-col items-center">
                        <div><label className="text-xl">Subject</label></div>
                        <div><input type="text" name="subject" className="p-[5px] rounded-[10px]" onChange={handleChange}></input></div>
                    </div>
                    <div className="mt-[25px] flex justify-evenly flex-col items-center">
                        <div><label className="text-xl">Description</label></div>
                        <div><textarea className="textarea p-2" name="description" rows={5} cols={30} maxLength={100} onChange={handleChange}></textarea></div>
                    </div>
                    <div className="mt-[20px] text-center">
                        <div><label className="text-xl">Files/Images</label></div>
                        <div className="mt-[15px]"> <input type="file" name="filename" onChange={handleChange} /></div>
                    </div>
                    <div><button onClick={checkSubmit} className="bg-white p-3 rounded-[15px] w-[150px] hover:bg-[#0F2C59] hover:text-white">Submit</button></div>
                </form>
                <form style={{opacity :visible? 100 : 0}}className="absolute top-[300px] left-[550px]">
                    <div><Watch
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
    );
}

export default TicketRaise;