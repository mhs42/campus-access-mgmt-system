import React, { useEffect, useState,Component } from "react";
import './admin.css';
import Axios from 'axios';
import { Link, useNavigate } from "react-router-dom";




const Admin=()=> {


  const navigate = useNavigate();

  const lgout =(data) =>{
    localStorage.clear()
    window.location.replace("/login")
  }

  const v_rqst =(data) =>{
    window.location.replace("/viewrequestsadmin");
  }

  async function reg(ev){
    let ind = ev.currentTarget.dataset.index;
    let i = ind.split(",");
    console.log(i[0],i[1]);
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      console.log(token);
      let response = await instance.post('http://localhost:5000/change', {
          usrname: i[0],
          status: i[1]
      }).then((response)=>{
        if(response.data.status === "good"){
          window.location.href = "/admin";

        }
        else if(response.data.status === "error"){
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }

  async function regg(ev){
    let ind = ev.currentTarget.dataset.index;
    console.log(ind);
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      console.log(token);
      let response = await instance.post('http://localhost:5000/delete', {
          usrname: ind,
          p: "here",
      }).then((response)=>{
        if(response.data.status === "good"){
          window.location.href = "/admin";

        }
        else if(response.data.status === "error"){
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }


  async function regg1(id){
    console.log("inside regg1 hha");
    let ind = id.currentTarget.dataset.index;
    console.log(ind);
    navigate("/ta", {
      state:{
        id: ind,
      }
    });
  }

  const [admin, Setadmin] = useState([]);
  useEffect(() => {
    if(!localStorage.getItem("token")){
      alert("Login first");
      window.location.replace("/login");
    }
    else{
      fetchAdmin();
    }
  }, []);
  async function fetchAdmin() {
    try {
      console.log("In try");
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      let response = await instance.get('http://localhost:5000/admin');
      console.log("response.data.data[0]: ",response.data.data[0]);
      Setadmin(response.data.data);
      console.log("response.data.data[1]: ",response.data.data[1]);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="App">
      <button onClick={lgout}>logout</button>
      <button onClick={v_rqst}>view-requests-admin</button>
      <tbody>
        <tr>
          <th>user</th>
          <th>occupation</th>
          <th>state</th>
          <th>change</th>
          <th>delete</th>
          <th>TAs</th>
        </tr>
        {admin.map((item, index) => (
          <tr key={index}>
            <td>{item.username}</td>
            <td>{item.occupation}</td>
            <td>{item.state}</td>
            <td><button data-index={[item.username,item.state]} onClick={reg}>change</button></td>
            <td><button data-index={[item.username]} onClick={regg}>delete</button></td>
            <td><button data-index={[item.username]} onClick={regg1}>TA</button></td>
          </tr>
        ))}
      </tbody>
    </div>
  );
}

export default Admin;
