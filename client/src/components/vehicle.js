import React, { useEffect, useState,Component } from "react";
import './vehicle.css';
import Axios from 'axios';




const Vehicle=()=> {
  const [name,setname] = useState('')
  const [no,setno] = useState('')

  const lgout =(data) =>{
    localStorage.clear()
    window.location.replace("/login")
  }

  async function visit() {
    try {
        console.log("In try");
        const token = localStorage.getItem("token");
        console.log(token);
        let instance = Axios.create({
          headers: { "x-access-token": token },
        });
        let response = await instance.post('http://localhost:5000/vehicle',{
            name: name,
            number: no,
      }).then((response)=>{
        if(response.data.status === "success"){
            window.location.href = "/access";
        }
        else{
          console.log(response.data.status);
          alert(response.data.error);
        }
      })
      } catch (err) {
        alert(err);
      }
}


  return (
    <div className="App">
        <button onClick={lgout}>logout</button>
      <div className="visitor">
        <h1>VISITOR</h1>
        <label>vehiclename</label>
        <input type="text" onChange = {(e)=>{setname(e.target.value)}}/>
        <label>plateno</label>
        <input type="text" onChange = {(e)=>{setno(e.target.value)}}/>
      </div>
      <div>
        <button onClick={visit}>request</button>
      </div>
    </div>
  );
}

export default Vehicle;
