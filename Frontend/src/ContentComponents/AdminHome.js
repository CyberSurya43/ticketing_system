import React, { useEffect, useState } from "react";
import BarChart from "../ChartComponents/BarChart";
import LineChart from "../ChartComponents/LineChart";
import PieChart from "../ChartComponents/PieChart";
import TempData from "../Utils/TempData";
import PieData from "../Utils/PieData";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";
const AdminHome = () => {

    const [details, setDetails] = useState({
        labels: TempData.map((item) => item.status),
        datasets: [{
            label: "ticketsRaised",
            data: TempData.map((item) => item.ticketsRaised)
        }]
    });

    const [piedetails, setPiedetails] = useState({
        labels: PieData.map((item) => item.category),
        datasets: [{
            label: "Tickets",
            data: PieData.map((item) => item.ticketsRaised)
        }]
    });
    const [tabledata, setTabledata] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        axios.get(`http://192.168.0.53:5000/getTicketCount`, {
            headers: {
                'Content-Type': 'application/json',
                'access-token': sessionStorage.getItem('token')
            },
        }).then(async (res) => {
            sessionStorage.setItem('opencount', res.data.openCount);
            sessionStorage.setItem('processcount', res.data.processCount);
            sessionStorage.setItem('onholdcount', res.data.onHoldCount);
            sessionStorage.setItem('closedcount', res.data.closedCount);
            sessionStorage.setItem('reopencount', res.data.reOpenCount);
            sessionStorage.setItem('itcount', res.data.ItCount);
            sessionStorage.setItem('hardwarecount', res.data.HardwareCount);
            sessionStorage.setItem('foodcount', res.data.FoodCount);
            return res.data;
        }).then(() => {
        axios.get(`http://192.168.0.53:5000/recentTickets`, {
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
        });}).catch((err) => {
            nav('/');
        });
    }, [])

    return (

        <div>
            <div className="flex justify-around mt-[30px]">
                <div className="w-[30%] bg-[aliceblue] rounded-[10px] shadow-2xl"> <BarChart chartData={details} /></div>
                <div className="w-[30%] h-[300px] bg-[aliceblue] rounded-[10px] shadow-2xl"> <PieChart chartData={piedetails} /></div>
                <div className="w-[30%] bg-[aliceblue] rounded-[10px] shadow-2xl"> <LineChart chartData={details} /></div>
            </div>
            <div className="mt-[50px] rounded-[10px] shadow-2xl w-[80%] h-[45vh] mx-auto ">
            <div className="bg-[#0F2C59]"><h1 className="text-2xl text-center text-white">Recents</h1></div>
                <div className=" mx-[auto] w-[80%] grid place-items-center" >
                    <table className="styled-table">
                        <thead>
                            <tr>
                            <td>Employee_Id</td>
                            <td>Ticket_Id</td>
                            <td>Parent_Ticket</td>
                            <td>Department</td>
                            <td>Agent_Id</td>
                            <td>Subject</td>
                            <td>Status</td>
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
                                            <td>{e.emp_id}</td>
                                            <td>{e.ticket_id}</td>
                                            <td>{e.p_ticket_id}</td>
                                            <td>{department}</td>
                                            <td>{e.agent_id}</td>
                                            <td>{e.subject}</td>
                                            <td>{e.status}</td>
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

export default AdminHome;