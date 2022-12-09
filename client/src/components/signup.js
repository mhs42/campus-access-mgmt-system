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
      <button onClick={login}>login</button>
      <button onClick={reset}>reset-pass</button>
      <div className="signup">
        <h1>signup</h1>
        <label>username</label>
        <input type="text" onChange = {(e)=>{setusr(e.target.value)}} />
        <label>password</label>
        <input type="text" onChange = {(e)=>{setpass(e.target.value)}}/>
        <label>Occupation</label>
        <input type="text" onChange = {(e)=>{setocc(e.target.value)}}/>
      </div>
      <div>
        <button onClick={reg}>signup</button>
      </div>
    </div>
  );
}

export default Signup;
