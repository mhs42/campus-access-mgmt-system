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
      else if (response.data.status === "error") {
        alert(response.data.error);
        window.location.href = "/login";
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
      <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Campus Access Managment System</span>
        <div>
          <button class="btn btn-danger" onClick={lgout}>
            Logout
          </button>
        </div>
      </nav>
      {/* <button onClick={lgout}>logout</button> */}
      {/* <button onClick={rqst}>request-Visitor</button>
      <button onClick={rqst_v}>request-Vehicle</button>
      <button onClick={v_rqst}>view-requests</button> */}
      <div class="container p-1 my-3 bg-light w-60">
        <div className="access mt-5">
          <h4>{acc}</h4>
        </div>
        <div class="d-grid gap-2 d-md-block">
          <div class="mt-4">
            <button class="btn btn-primary w-50" type="button" onClick={rqst}>
              request-Visitor
            </button>
          </div>
          <div class="mt-2">
            <button class="btn btn-primary w-50" type="button" onClick={rqst_v}>
              request-Vehicle
            </button>
          </div>
          <div class="mt-2">
            <button class="btn btn-primary w-50" type="button" onClick={v_rqst}>
              view-requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Access;
