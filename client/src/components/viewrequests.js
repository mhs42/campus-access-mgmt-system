import React, { useEffect, useState, Component } from "react";
import "./viewrequests.css";
import Axios from "axios";

const Viewrequests = () => {
  const lgout = (data) => {
    localStorage.clear();
    window.location.replace("/login");
  };
  const usm = (data) => {
    window.location.href = "/access";
  };

  const [admin, Setadmin] = useState([]);
  const [veh, Setveh] = useState([]);
  const [fac, Setfac] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("Login first");
      window.location.replace("/login");
    } else {
      fetchAdmin();
    }
  }, []);
  async function fetchAdmin() {
    try {
      console.log("In try");
      const token = localStorage.getItem("token");
      let instance = Axios.create({
        headers: { "x-access-token": token },
      });
      let response = await instance.get("http://localhost:5000/viewrequests");
      if (response.data.status == "error") {
        alert(response.data.error);
        window.location.href = "/login";
      }
      Setadmin(response.data.data);
      Setveh(response.data.data1);
      Setfac(response.data.data2);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="App">
      <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Campus Access Managment System</span>
        <div>
          <button class="btn btn-outline-danger" onClick={lgout}>
            Logout
          </button>
          <button class="btn btn-secondary" onClick={usm}>
            user-main
          </button>
        </div>
      </nav>
      {/* <button onClick={lgout}>logout</button>
      <button onClick={usm}>user-main</button> */}
      <div class="col-xl-10 offset-xl-1">
        <div class="mt-5"></div>
        <h4>Visitors Access Requests</h4>
        <table class="table table-striped">
          <tbody>
            <tr>
              <th>user</th>
              <th>visitor</th>
              <th>cnic</th>
              <th>state</th>
            </tr>
            {admin.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.visitorname}</td>
                <td>{item.cnic}</td>
                <td>{item.state}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div class="mt-5"></div>
        <h4>Vehicle Access Requests</h4>
        <table class="table table-striped">
          <tbody>
            <tr>
              <th>user</th>
              <th>vehicle</th>
              <th>plate</th>
              <th>state</th>
              <th>item</th>
            </tr>
            {veh.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.vehiclename}</td>
                <td>{item.plateno}</td>
                <td>{item.state}</td>
                <td>{item.item}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="mt-5"></div>
        <h4>Visitors Facilities Requests</h4>
        <table class="table table-striped">
          <tbody>
            <tr>
              <th>username</th>
              <th>visitor-name</th>
              <th>gym</th>
              <th>library</th>
            </tr>
            {fac.map((item, index) => (
              <tr key={index}>
                <td>{item.username}</td>
                <td>{item.visitorname}</td>
                <td>{item.gym}</td>
                <td>{item.library}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Viewrequests;
