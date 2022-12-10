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
            setite(response.data.data);
            }
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
          <button class="btn btn-secondary" onClick={adm}>
            admin-main
          </button>

          <button class="btn btn-outline-danger" onClick={lgout}>
            Logout
          </button>
        </div>
      </nav>
      {/* <button onClick={lgout}>logout</button>
      <button onClick={adm}>admin-main</button> */}
      <div className="Login">
        <div class="container p-1 my-3 bg-light w-60">
          <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 my-5">
            <h4>Vendor Search</h4>
            <label>ID</label>
            <input
              type="text"
              onChange={(e) => {
                setusr(e.target.value);
              }}
              class="form-control form-control-lg"
              placeholder="Search by ID"
            />
            <div class="text-center text-lg-start mt-4 pt-2">
            <button class="btn btn-primary btn-lg" onClick={reg}>
              Search
            </button>
            {/* <button onClick={reg}>search</button> */}
            <h3>{ite}</h3>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vendorsearch;
