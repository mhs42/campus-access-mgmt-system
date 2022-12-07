import React, { useEffect, useState,Component } from "react";
import './admin.css';
import Axios from 'axios';
import ADMIN from './admin';
import { useLocation } from "react-router-dom";

const Ta=(props)=> {

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
      async function fetchTA() {
        try {
          console.log("In try");
          console.log("location.state.id: ",location.state.id);
          const token = localStorage.getItem("token");
          let instance = Axios.create({
            headers: { "x-access-token": token },
          });
          console.log("reached here");
          let response = await instance.post('http://localhost:5000/ta', {
          usrname: location.state.id,
          h: "haha",
        })
          Setta(response.data.data);
        } catch (err) {
          alert(err);
        }
      }

    return (
        <div className="App">
        <button onClick={lgout}>logout</button>
        <button onClick={v_rqst}>view-requests-admin</button>
        <button onClick={v_admin}>admin</button>
        <tbody>
          <tr>
            <th>username</th>
            <th>ta name</th>
            <th>state</th>
          </tr>
          {ta.map((item, index) => (
            <tr key={index}>
              <td>{item.username}</td>
              <td>{item.ta}</td>
              <td>{item.state}</td>
            </tr>
          ))}
        </tbody>
      </div>
    );
  }
  
  export default Ta;