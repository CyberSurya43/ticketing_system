import React, { useEffect, useState } from "react";
import "./Profile.css";
import Swal from "sweetalert2";
import { AiFillCamera } from "react-icons/ai";
const Profile = () => {
    const [enable, setEnable] = useState(false);
    const [sideenable, setSideenable] = useState(false);
    const [url, setUrl] = useState("");
    let role = sessionStorage.getItem('dept');
    let subrole = "";

    function handleClick() {
        setEnable(!enable);
    }

    function handleClicked() {
        setSideenable(!sideenable);
    }
    function removeImage() {
        try {
            fetch("http://192.168.0.53:5000/editProfile/remove", {
                method: "put",
                headers: {
                    'access-token': sessionStorage.getItem('token')
                },
            }
            ).then(res => {
                if (res.status === 200) {
                    Swal.fire(
                        'Hurrah!',
                        'Profile Image Removed',
                        'success'
                    ).then(() => {
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

    const [file, setFile] = useState(null);
    function updateImage() {
        const fd = new FormData();
        fd.append('file', file);
        try {
            fetch("http://192.168.0.53:5000/editProfile/update", {
                method: 'PUT',
                body: fd,
                headers: {
                    'access-token': sessionStorage.getItem('token')
                },
            }
            ).then(res => {
                if (res.status === 200) {
                    Swal.fire(
                        'Hurrah!',
                        'Profile Image Updated',
                        'success'
                    ).then(() => {
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

    if (role === 'Help Desk/IT Support') {
        let str = role.split("/");
        role = str[0];
        subrole = str[1];
    }
    if (role === 'Help Desk/Hardware') {
        let str = role.split("/");
        role = str[0];
        subrole = str[1];
    }
    if (role === 'Help Desk/Food') {
        let str = role.split("/");
        role = str[0];
        subrole = str[1];
    }

    setTimeout(() => {
        let bloburl = sessionStorage.getItem('url');
        setUrl(bloburl);

        if (role === 'User') {
            document.querySelector(`.role-1`).classList.add('spl');
        }
        else if (role === 'Help Desk') {
            document.querySelector(`.role-2`).classList.add('spl');
            document.querySelector(".dept-cat").classList.remove('invisible');
            document.querySelector(".dept-cat").classList.add('visible');
            if (subrole === "IT Support") {
                document.querySelector(`.role-sub-1`).classList.add('spl');
            }
            if (subrole === "Hardware") {
                document.querySelector(`.role-sub-2`).classList.add('spl');
            }
            if (subrole === "Food") {
                document.querySelector(`.role-sub-3`).classList.add('spl');
            }
        }
        else {
            document.querySelector(`.role-3`).classList.add('spl');
        }
    }, 20)
    return (
        <div className="profile-gridbox">
            <div className="subdiv-1">
                <h1 className="text-center text-2xl bg-[#0f2c59] text-white p-[10px]">My Profile</h1>
                <div className="img-box flex items-end relative">
                    <img className="image" src={url} alt="UserImage" />
                    <button className="absolute right-0 rounded-full bg-white p-[5px]" onClick={handleClick}><AiFillCamera size={35} /></button>
                </div>
                <div className="flex mt-[20px] justify-around" style={{ display: enable ? "flex" : "none" }}>
                    <button className="p-[5px] text-white bg-[#0F2C59] w-[100px]" onClick={removeImage}>Remove</button>
                    <button className="p-[5px] text-white bg-[#0F2C59] w-[100px]" onClick={handleClicked}>Update</button>
                </div>
                <h1 className="text">{sessionStorage.getItem('name')}</h1>
                <div className="small-box">
                    <h1 className="text">Role</h1>
                    <div className="mt-[20px] flex justify-around">
                        <button className="opt role-1">User</button>
                        <button className="opt role-2">Help Desk</button>
                        <button className="opt role-3">Admin</button>
                    </div>
                    <div className="dept-cat invisible">
                        <h1 className="text">Category</h1>
                        <div className="mt-[20px] flex justify-around ">
                            <button className="option-1 role-sub-1">IT Support</button>
                            <button className="option-1 role-sub-2">Hardware</button>
                            <button className="option-1 role-sub-3">Food</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="inner-profile-gridbox mt-[50px]">
                <div className="subdiv-2">
                <div className="text-2xl text-center p-[10px] text-white bg-[#0f2c59]">Employee Details</div>
                    <div className="p-[50px]">      
                        <div className="flex text-2xl  mt-[10px]">
                            <div>Name:</div>
                            <div>{sessionStorage.getItem('name')}</div>
                        </div>
                        <div className="flex text-2xl  mt-[10px]">
                            <div>Role:</div>
                            <div>{sessionStorage.getItem('dept')}</div>
                        </div>
                        <div className="flex text-2xl  mt-[10px]">
                            <div>Employee_Id:</div>
                            <div>{sessionStorage.getItem('emp_id')}</div>
                        </div>
                        <div className="flex text-2xl  mt-[10px]">
                            <div>Email:</div>
                            <div>{sessionStorage.getItem('email')}</div>
                        </div>
                    </div>
                </div>

                <div className="popup" style={{ display: sideenable ? "block" : "none" }}>
                    <h1 className="text-2xl text-center p-[10px] text-white bg-[#0f2c59] ">Select a image to upload</h1>
                    <div className="p-[50px] items-center">
                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                    <button className="p-[5px] text-white bg-[#0F2C59] w-[100px]" onClick={updateImage}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;