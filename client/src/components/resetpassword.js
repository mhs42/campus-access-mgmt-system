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
      <button onClick={login}>login</button>
      <button onClick={signup}>signup</button>
      <div className="Reset">
        <h1>RESET PASSWORD</h1>
        <label>username</label>
        <input type="text" onChange = {(e)=>{setusr(e.target.value)}} />
        <label>password</label>
        <input type="text" onChange = {(e)=>{setpass(e.target.value)}}/>
        <label>newpassword</label>
        <input type="text" onChange = {(e)=>{setnewpass(e.target.value)}}/>
      </div>
      <div>
        <button onClick={reg}>reset</button>
      </div>
    </div>
  );
}

export default Reset;
