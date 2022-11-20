import React, { useEffect, useState,Component } from "react";
import './access.css';
import Axios from 'axios';




const Access=()=> {
  const [acc, Setacc] = useState("");
  useEffect(() => {
    fetchAccess();
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
      <div className="access">
        <h1>{acc}</h1>
      </div>
    </div>
  );
}

export default Access;
