import logo from './logo.svg';
import React, { useEffect, useState } from "react";
import './login.css';
import Axios from 'axios';
// import { Link, useNavigate } from "react-router-dom";




function Login() {
  const [usr,setusr] = useState('')
  const [pass,setpass] = useState('')

  const reg =(data) =>{
      const response = Axios.post('http://localhost:5000/login', {
        usrname: usr, 
        password: pass,
      }).then((response)=>{
        if(response.data.status === "success" && response.data.occupation === "student"){
          localStorage.setItem("token", response.data.auth);
          window.location.href = "/access";

        }
        else if(response.data.status === "success" && response.data.occupation === "admin"){
          localStorage.setItem("token", response.data.auth);
          window.location.href = "/admin";
        }
        else{
          console.log(response.data.status);
          alert(response.data.error);
        }
      })
}
  return (
    <div className="App">
      <div className="Login">
        <h1>Login</h1>
        <label>username</label>
        <input type="text" onChange = {(e)=>{setusr(e.target.value)}} />
        <label>password</label>
        <input type="text" onChange = {(e)=>{setpass(e.target.value)}}/>
      </div>
      <div>
        <button onClick={reg}>login</button>
      </div>
    </div>
  );
}

export default Login;
