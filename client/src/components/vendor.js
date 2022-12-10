import React, { useEffect, useState,Component } from "react";
import './vendor.css';
import Axios from 'axios';
import ADMIN from './admin';
import { useLocation } from "react-router-dom";

const Vendor=(props)=> {

    const location = useLocation();

    const lgout =(data) =>{
        localStorage.clear()
        window.location.replace("/login")
      }
    
      const v_rqst =(data) =>{
        window.location.replace("/viewrequestsadmin");
      }

      const v_admin =(data) =>{
        window.location.replace("/admin");
      }

    
    useEffect(() => {
        if(!localStorage.getItem("token")){
          alert("Login first");
          window.location.replace("/login");
        }
        else{
            fetchVendor();
        }
      }, []);

      const [vendor, Setvendor] = useState([]);
      const [car, Setcar] = useState([]);
      async function fetchVendor() {
        try {
          console.log("In try");
          const token = localStorage.getItem("token");
          let instance = Axios.create({
            headers: { "x-access-token": token },
          });
          let response = await instance.post('http://localhost:5000/vendor');
          // console.log("response.data.data[0]: ",response.data.data[0]);
          console.log(response);
          if(response.data.status == "error"){
              alert(response.data.error)
              window.location.href = "/login";
          }
          else{
          Setvendor(response.data.data);
          Setcar(response.data.data1);
          }
        } catch (err) {
          alert(err);
        }
      }

    return (
      <div className="App">
        <nav class="navbar navbar-light bg-light">
          <span class="navbar-brand mb-0 h1">
            Campus Access Managment System
          </span>
          <div>
            <button class="btn btn-secondary" onClick={v_admin}>
              admin
            </button>
            <button class="btn btn-secondary" onClick={v_rqst}>
              view-requests-admin
            </button>

            <button class="btn btn-outline-danger" onClick={lgout}>
              Logout
            </button>
          </div>
        </nav>
        {/* <button onClick={lgout}>logout</button>
        <button onClick={v_rqst}>view-requests-admin</button>
        <button onClick={v_admin}>admin</button> */}
        <div class="col-xl-10 offset-xl-1">
          <div class="mt-5"></div>
          <h4>Vendors</h4>
          <table class="table table-striped">
            <tbody>
              <tr>
                <th>vendor-id</th>
                <th>type</th>
                <th>items</th>
              </tr>
              {vendor.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.items}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div class="mt-5"></div>
          <h4>Vehiles with Items</h4>
          <table class="table table-striped">
            <tbody>
              <tr>
                <th>user</th>
                <th>vehicle</th>
                <th>plate</th>
                <th>state</th>
                <th>item</th>
                <th>vendor-id</th>
                <th>type</th>
              </tr>
              {car.map((item, index) => (
                <tr key={index}>
                  <td>{item.username}</td>
                  <td>{item.vehiclename}</td>
                  <td>{item.plateno}</td>
                  <td>{item.state}</td>
                  <td>{item.item}</td>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default Vendor;