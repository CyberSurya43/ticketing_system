import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
const Routebody = () => {
    const nav = useNavigate();
    let username = "";
    let usermail = "";
    let profile_pic = null;
    const [token, setToken] = useState("");

    const getdata = async (token) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
            );
            const data = await response.json();
            username = data.name;
            usermail = data.email;
            profile_pic = data.picture;
            setToken(token);

        } catch (error) {
            console.log("Error", error);
        }
    };

    const googlelogin = useGoogleLogin({
        onSuccess: (res) => {
            getdata(res.access_token).then(() => {
                const payload = {
                    "token": res.access_token,
                    "name": username,
                    "email": usermail,
                    "profile_pic": profile_pic
                };
                try {
                    axios.post("http://192.168.0.53:5000/login", payload)
                        .then((res) => {
                            if (res.status === 200) {
                                sessionStorage.setItem('token', res.data.token);
                                sessionStorage.setItem('name', res.data.name);
                                sessionStorage.setItem('emp_id', res.data.emp_id);
                                sessionStorage.setItem('dept', res.data.dept);
                                sessionStorage.setItem('email', res.data.email);
                                if (sessionStorage.getItem('dept') === 'User' && sessionStorage.getItem('token')) {
                                    nav("/User");
                                }
                                else if (sessionStorage.getItem('dept') === 'Help Desk/Hardware' && sessionStorage.getItem('token')) {
                                    let Overallrole = sessionStorage.getItem('dept');
                                    let str = Overallrole.split("/");
                                    sessionStorage.setItem('role1', str[0]);
                                    sessionStorage.setItem('role2', str[1]);
                                    nav("/Agent");
                                }
                                else if (sessionStorage.getItem('dept') === 'Help Desk/IT Support' && sessionStorage.getItem('token')) {
                                    let Overallrole = sessionStorage.getItem('dept');
                                    let str = Overallrole.split("/");
                                    sessionStorage.setItem('role1', str[0]);
                                    sessionStorage.setItem('role2', str[1]);
                                    nav("/Agent");
                                }
                                else if (sessionStorage.getItem('dept') === 'Help Desk/Food' && sessionStorage.getItem('token')) {
                                    let Overallrole = sessionStorage.getItem('dept');
                                    let str = Overallrole.split("/");
                                    sessionStorage.setItem('role1', str[0]);
                                    sessionStorage.setItem('role2', str[1]);
                                    nav("/Agent");
                                }
                                else if ((sessionStorage.getItem('dept') === 'Pending' || sessionStorage.getItem('dept') === null) && sessionStorage.getItem('token')) {
                                    nav("/Newbie");
                                }
                                else if (sessionStorage.getItem('dept') === 'Admin' && sessionStorage.getItem('token')) {
                                    nav("/Admin");
                                }
                                else {
                                    nav("/");
                                }
                            }
                            else {
                                console.log("Failure");
                            }
                        })
                } catch (error) {
                    console.log(error);
                }
            })
        }
    })

    return (
        <div className="header">
            <img
                src="https://images.unsplash.com/photo-1526958097901-5e6d742d3371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Home"
            ></img>
            <div className="hero-tag" >
                <h1>We Join hands to make it possible!</h1>
                <p>We shine by making your day to day life fine</p>
                <button onClick={() => googlelogin()} className="signin">Sign up with google</button>
            </div>
        </div>
    );
}
export default Routebody;