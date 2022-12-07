import React, { useEffect, useState,Component } from "react";
import './visitor.css';
import Axios from 'axios';




const Visitor=()=> {
  const [name,setname] = useState('')
  const [cnic,setcnic] = useState('')

  const lgout =(data) =>{
    localStorage.clear()
    window.location.replace("/login")
  }

  const main =(data) =>{
    window.location.replace("/access")
  }

  useEffect(() => {
    if(!localStorage.getItem("token")){
      alert("Login first");
      window.location.replace("/login");
    }
  });

  async function visit() {
    try {
        console.log("In try");
        const token = localStorage.getItem("token");
        console.log(token);
        let instance = Axios.create({
          headers: { "x-access-token": token },
        });
        let response = await instance.post('http://localhost:5000/visitor',{
            name: name,
            cnic: cnic,
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
        <button onClick={main}>main</button>
      <div className="visitor">
        <h1>VISITOR</h1>
        <label>visitorname</label>
        <input type="text" onChange = {(e)=>{setname(e.target.value)}}/>
        <label>cnic</label>
        <input type="text" onChange = {(e)=>{setcnic(e.target.value)}}/>
      </div>
      <div>
        <button onClick={visit}>request</button>
      </div>
    </div>
  );
}

export default Visitor;
