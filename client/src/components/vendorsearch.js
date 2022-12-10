import logo from './logo.svg';
import React, { useEffect, useState } from "react";
import './login.css';
import Axios from 'axios';
// import { Link, useNavigate } from "react-router-dom";




function Vendorsearch() {
  const [usr,setusr] = useState('')
  const [ite,setite] = useState('')

  const lgout =(data) =>{
    localStorage.clear()
    window.location.replace("/login")
  }
  const adm =(data) =>{
    window.location.href = "/admin";
  }

  useEffect(() => {
    if(!localStorage.getItem("token")){
      alert("Login first");
      window.location.replace("/login");
    }
  },[]);

  async function reg(){
    try {
        console.log("In try");
        const token = localStorage.getItem("token");
        let instance = Axios.create({
          headers: { "x-access-token": token },
        });
        console.log("reached here");
        let response = await instance.post('http://localhost:5000/vendorsearch', {
        usrname: usr,
      })
      if(response.data.status == "error"){
        alert(response.data.error);
        window.location.href = "/login";
      }
        else{
            console.log(response.data.data);
            console.log(response.data.data.length);
            if(response.data.data.length == 0){
                setite('');
            }
            else{
            console.log(response.data.data[0].items);
            setite(response.data.data[0].items);
            }
        }
      } catch (err) {
        alert(err);
      }
    }
  return (
    <div className="App">
        <button onClick={lgout}>logout</button>
        <button onClick={adm}>admin-main</button>
      <div className="Login">
        <h1>VENDOR-SEARCH</h1>
        <label>id</label>
        <input type="text" onChange = {(e)=>{setusr(e.target.value)}} />
      </div>
      <div>
        <button onClick={reg}>search</button>
        <h3>{ite}</h3>
      </div>
    </div>
  );
}

export default Vendorsearch;
