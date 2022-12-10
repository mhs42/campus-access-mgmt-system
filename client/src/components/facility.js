import React, { useEffect, useState,Component } from "react";
import './admin.css';
import Axios from 'axios';
import ADMIN from './admin';
import { useLocation } from "react-router-dom";

const Facility=(props)=> {

    const location = useLocation();

    const lgout =(data) =>{
        localStorage.clear()
        window.location.replace("/login")
      }
    
      const v_rqst =(data) =>{
        window.location.replace("/viewrequestsadmin");
      }

      const v_admin =(data) =>{
        window.location.replace("/admin");
      }


      async function reg(ev){
        let ind = ev.currentTarget.dataset.index;
        let i = ind.split(",");
        const token = localStorage.getItem("token");
        let instance = Axios.create({
          headers: { "x-access-token": token },
        });
        console.log(token);
        let response = await instance.post('http://localhost:5000/changegym', {
            usrname: i[0],
            gym: i[1],
        }).then((response)=>{
          if(response.data.status === "good"){
            window.location.href = "/facility";
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
        const token = localStorage.getItem("token");
        let instance = Axios.create({
          headers: { "x-access-token": token },
        });
        console.log(token);
        let response = await instance.post('http://localhost:5000/changelibrary', {
            usrname: i[0],
            library: i[1],
        }).then((response)=>{
          if(response.data.status === "good"){
            window.location.href = "/facility";
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
        const token = localStorage.getItem("token");
        let instance = Axios.create({
          headers: { "x-access-token": token },
        });
        console.log(token);
        let response = await instance.post('http://localhost:5000/changegymvisitor', {
            usrname: i[0],
            visitname: i[1],
            gym: i[2],
        }).then((response)=>{
          if(response.data.status === "good"){
            window.location.href = "/facility";
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
        const token = localStorage.getItem("token");
        let instance = Axios.create({
          headers: { "x-access-token": token },
        });
        console.log(token);
        let response = await instance.post('http://localhost:5000/changelibraryvisitor', {
            usrname: i[0],
            visitname: i[1],
            library: i[2],
        }).then((response)=>{
          if(response.data.status === "good"){
            window.location.href = "/facility";
          }
          else if(response.data.status === "error"){
            console.log(response.data.status);
            alert(response.data.error);
          }
        });
      }

    
    useEffect(() => {
        if(!localStorage.getItem("token")){
          alert("Login first");
          window.location.replace("/login");
        }
        else{
          fetchTA();
        }
      }, []);

      const [ta, Setta] = useState([]);
      const [vis, Setvis] = useState([]);
      async function fetchTA() {
        try {
          console.log("In try");
          console.log("location.state.id: ",location.state.id);
          const token = localStorage.getItem("token");
          let instance = Axios.create({
            headers: { "x-access-token": token },
          });
          console.log("reached here");
          let response = await instance.post('http://localhost:5000/facility', {
          usrname: location.state.id,
          h: "haha",
        })
          Setta(response.data.data);
          Setvis(response.data.data1);
        } catch (err) {
          alert(err);
        }
      }

    return (
      <div className="App">
        <nav class="navbar navbar-light bg-light">
          <span class="navbar-brand mb-0 h1">
            Campus Access Managment System
          </span>
          <div>
            <button class="btn btn-secondary" onClick={v_rqst}>
              view-requests-admin
            </button>
            <button class="btn btn-secondary" onClick={v_admin}>
              admin
            </button>

            <button class="btn btn-outline-danger" onClick={lgout}>
              Logout
            </button>
          </div>
        </nav>
        {/* <button onClick={lgout}>logout</button>
        <button onClick={v_rqst}>view-requests-admin</button>
        <button onClick={v_admin}>admin</button> */}
        <div class="col-xl-10 offset-xl-1">
          <div class="mt-5"></div>
          <h4>Users Access</h4>
          <table class="table table-striped">
            <tbody>
              <tr>
                <th>username</th>
                <th>gym</th>
                <th>library</th>
                <th>change gym</th>
                <th>change library</th>
              </tr>
              {ta.map((item, index) => (
                <tr key={index}>
                  <td>{item.username}</td>
                  <td>{item.gym}</td>
                  <td>{item.library}</td>
                  <td>
                    <button
                      class="btn btn-primary btn-sm"
                      
                      data-index={[item.username, item.gym]}
                      onClick={reg}
                    >
                      change-gym
                    </button>
                  </td>
                  <td>
                    <button
                      class="btn btn-primary btn-sm"
                      data-index={[item.username, item.library]}
                      onClick={reg1}
                    >
                      change-library
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div class="mt-5"></div>
          <h4>Visitors Access</h4>
          <table class="table table-striped">
            <tbody>
              <tr>
                <th>username</th>
                <th>visitor-name</th>
                <th>gym</th>
                <th>library</th>
                <th>change gym</th>
                <th>change library</th>
              </tr>
              {vis.map((item, index) => (
                <tr key={index}>
                  <td>{item.username}</td>
                  <td>{item.visitorname}</td>
                  <td>{item.gym}</td>
                  <td>{item.library}</td>
                  <td>
                    <button
                      data-index={[item.username, item.visitorname, item.gym]}
                      onClick={regg}
                    >
                      change-gym
                    </button>
                  </td>
                  <td>
                    <button
                      data-index={[
                        item.username,
                        item.visitorname,
                        item.library,
                      ]}
                      onClick={regg1}
                    >
                      change-library
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default Facility;