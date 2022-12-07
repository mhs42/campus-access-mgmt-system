import React, { useEffect, useState,Component } from "react";
import './access.css';
import Axios from 'axios';




const Access=()=> {

  const lgout =(data) =>{
    localStorage.clear()
    window.location.replace("/login")
  }

  const rqst =(data) =>{
    window.location.href = "/visitor";
  }

  const rqst_v =(data) =>{
    window.location.href = "/vehicle";
  }

  const v_rqst =(data) =>{
    window.location.href = "/viewrequests";
  }

  const [acc, Setacc] = useState("");
  useEffect(() => {
    if(!localStorage.getItem("token")){
      alert("Login first");
      window.location.replace("/login");
    }
    else{
      fetchAccess();
    }
  }, "");
  async function fetchAccess() {
    try {
      console.log("In try");
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      let response = await instance.get('http://localhost:5000/access');
      if (response.data.status === "success") {
        console.log("response.data.data: ",response.data.data);
        console.log("response.data: ",response.data)
        Setacc(response.data.data);
      } 
      else{
        alert(response.data.error);
      }
    } catch (err) {
      alert(err);
    }
  }
  return (
    <div className="App">
      <button onClick={lgout}>logout</button>
      <button onClick={rqst}>request-Visitor</button>
      <button onClick={rqst_v}>request-Vehicle</button>
      <button onClick={v_rqst}>view-requests</button>
      <div className="access">
        <h1>{acc}</h1>
      </div>
    </div>
  );
}

export default Access;
