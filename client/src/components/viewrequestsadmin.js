import React, { useEffect, useState,Component } from "react";
import './viewrequestsadmin.css';
import Axios from 'axios';




const Viewrequestsadmin=()=> {


  const lgout =(data) =>{
    localStorage.clear()
    window.location.replace("/login")
  }
  const adm =(data) =>{
    window.location.href = "/admin";
  }

  async function reg(ev){
    let ind = ev.currentTarget.dataset.index;
    let i = ind.split(",");
    console.log(i[0],i[1],i[2]);
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      console.log(token);
      let response = await instance.post('http://localhost:5000/changevisitors', {
          usrname: i[0],
          status: i[1],
          cnic: i[2]
      }).then((response)=>{
        if(response.data.status === "good"){
          window.location.href = "/viewrequestsadmin";

        }
        else if(response.data.status === "error"){
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }


  async function reg1(ev){
    let ind = ev.currentTarget.dataset.index;
    let i = ind.split(",");
    console.log(i[0],i[1],i[2]);
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      console.log(token);
      let response = await instance.post('http://localhost:5000/deletevisitor', {
        usrname: i[0],
        status: i[1],
        cnic: i[2]
      }).then((response)=>{
        if(response.data.status === "good"){
          window.location.href = "/viewrequestsadmin";

        }
        else if(response.data.status === "error"){
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }

  async function regg(ev){
    let ind = ev.currentTarget.dataset.index;
    let i = ind.split(",");
    console.log(i[0],i[1],i[2],i[3]);
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      console.log(token);
      let response = await instance.post('http://localhost:5000/changevehicles', {
          usrname: i[0],
          vehiname: i[1],
          pltno: i[2],
          st: i[3]
      }).then((response)=>{
        if(response.data.status === "good"){
          window.location.href = "/viewrequestsadmin";

        }
        else if(response.data.status === "error"){
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }

  async function regg1(ev){
    let ind = ev.currentTarget.dataset.index;
    let i = ind.split(",");
    console.log(i[0],i[1],i[2],i[3]);
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      console.log(token);
      let response = await instance.post('http://localhost:5000/deletevehicle', {
        usrname: i[0],
        vehiname: i[1],
        pltno: i[2],
        st: i[3]
      }).then((response)=>{
        if(response.data.status === "good"){
          window.location.href = "/viewrequestsadmin";
        }
        else if(response.data.status === "error"){
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }



  const [admin, Setadmin] = useState([]);
  const [veh, Setveh] = useState([]);
  useEffect(() => {
    if(!localStorage.getItem("token")){
      alert("Login first");
      window.location.replace("/login");
    }
    else{
      fetchvisitors();
    }
  }, []);
  async function fetchvisitors() {
    try {
      console.log("In try");
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      let response = await instance.get('http://localhost:5000/viewrequestsadmin');
      Setadmin(response.data.data);
      Setveh(response.data.data1);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="App">
      <button onClick={lgout}>logout</button>
      <button onClick={adm}>admin-main</button>
      <h1>VISITORS REQUESTS</h1>
      <tbody>
        <tr>
          <th>user</th>
          <th>visitor</th>
          <th>cnic</th>
          <th>state</th>
          <th>change</th>
          <th>delete</th>
        </tr>
        {admin.map((item, index) => (
          <tr key={index}>
            <td>{item.username}</td>
            <td>{item.visitorname}</td>
            <td>{item.cnic}</td>
            <td>{item.state}</td>
            <td><button data-index={[item.username,item.state,item.cnic]} onClick={reg}>change</button></td>
            <td><button data-index={[item.username,item.state,item.cnic]} onClick={reg1}>delete</button></td>
          </tr>
        ))}
      </tbody>
      <h1>VEHICLES REQUESTS</h1>
      <tbody>
        <tr>
          <th>user</th>
          <th>vehicle</th>
          <th>plate</th>
          <th>state</th>
          {/* <th>item</th> */}
          <th>change</th>
          <th>delete</th>
        </tr>
        {veh.map((item, index) => (
          <tr key={index}>
            <td>{item.username}</td>
            <td>{item.vehiclename}</td>
            <td>{item.plateno}</td>
            <td>{item.state}</td>
            {/* <td>{item.item}</td> */}
            <td><button data-index={[item.username,item.vehiclename,item.plateno,item.state]} onClick={regg}>change</button></td>
            <td><button data-index={[item.username,item.vehiclename,item.plateno,item.state]} onClick={regg1}>delete</button></td>
          </tr>
        ))}
      </tbody>
    </div>
  );
}

export default Viewrequestsadmin;
