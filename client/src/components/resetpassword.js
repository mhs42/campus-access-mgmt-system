import logo from './logo.svg';
import React, { useEffect, useState } from "react";
import './resetpassword.css';
import Axios from 'axios';
// import { Link, useNavigate } from "react-router-dom";




function Reset() {

  const login =(data) =>{
    window.location.replace("/login");
  }
  const signup =(data) =>{
    window.location.replace("/signup");
  }

  const [usr,setusr] = useState('')
  const [pass,setpass] = useState('')
  const [newpass,setnewpass] = useState('')

  const reg =(data) =>{
      const response = Axios.post('http://localhost:5000/resetpassword', {
        usrname: usr, 
        password: pass,
        newpassword: newpass,
      }).then((response)=>{
        if(response.data.status === "success"){
            window.location.href = "/login";
        }
        else{
          console.log(response.data.status);
          alert(response.data.error);
        }
      })
}
  return (
    <div className="App">
      <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Campus Access Managment System</span>
        <div>
          <button class="btn btn-success" onClick={login}>
            Login
          </button>
          <button class="btn btn-outline-success" onClick={signup}>
            Signup
          </button>
        </div>
      </nav>
      <div class="container p-1 my-3 bg-light w-60">
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 my-5">
          {/* <button onClick={login}>login</button>
      <button onClick={signup}>signup</button> */}
          <div className="Reset">
            <h2>RESET PASSWORD</h2>
            <div class="form-outline mb-4">
              {/* <label>username</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setusr(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter Username"
              />
            </div>
            <div class="form-outline mb-4">
              {/* <label>password</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setpass(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter password"
              />
            </div>
            <div class="form-outline mb-4">
              {/* <label>newpassword</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setnewpass(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter new password"
              />
            </div>
          </div>
          {/* <div>
        <button onClick={reg}>reset</button>
      </div> */}
          <div class="text-center text-lg-start mt-4 pt-2">
            <button class="btn btn-primary btn-lg" onClick={reg}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reset;
