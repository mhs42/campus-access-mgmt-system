import React, { useEffect, useState,Component } from "react";
import './signup.css';
import Axios from 'axios';




const Signup=()=> {

  const login =(data) =>{
    window.location.replace("/login");
  }
  const reset =(data) =>{
    window.location.replace("/resetpassword");
  }
  
  const [usr,setusr] = useState('')
  const [pass,setpass] = useState('')
  const [occ,setocc] = useState('')

  const reg =(data) =>{
      const response = Axios.post('http://localhost:5000/signup', {
        usrname: usr, 
        password: pass, 
        occupation: occ
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
      </nav>
      <div class="container p-1 my-3 bg-light w-60">
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 my-5">
          {/* <button onClick={login}>login</button>
      <button onClick={reset}>reset-pass</button> */}
          <div className="signup">
            <h2>signup</h2>
            <div class="form-outline mb-4"></div>
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
                placeholder="Enter Password"
              />
            </div>
            <div class="form-outline mb-4">
              {/* <label>Occupation</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setocc(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter Occupation"
              />
            </div>
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button class="btn btn-primary btn-lg" onClick={reg}>
              Signup
            </button>
            <p class="small fw-bold mt-2 pt-1 mb-0">
              Already have an account?{" "}
              <a href="/login" class="link-success">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
