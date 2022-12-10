import React, { useEffect, useState, Component } from "react";
import "./vehicle.css";
import Axios from "axios";

const Vehicle = () => {
  const [name, setname] = useState("");
  const [no, setno] = useState("");

  const lgout = (data) => {
    localStorage.clear();
    window.location.replace("/login");
  };
  const main = (data) => {
    window.location.replace("/access");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
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
      let response = await instance
        .post("http://localhost:5000/vehicle", {
          name: name,
          number: no,
        })
        .then((response) => {
          if (response.data.status === "success") {
            window.location.href = "/access";
          } else {
            console.log(response.data.status);
            alert(response.data.error);
            window.location.href = "/login";
          }
        });
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
          <button class="btn btn-secondary" onClick={main}>
            main
          </button>
        </div>
      </nav>
      <div class="container p-1 my-3 bg-light w-60">
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-4 my-5">
          {/* <button onClick={lgout}>logout</button>
        <button onClick={main}>main</button> */}

          <div className="visitor">
            <h4>Vehicle</h4>
            <div class="form-outline mb-4">
              {/* <label>vehiclename</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setname(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter Vehicle name"
              />
            </div>
            <div class="form-outline mb-4">
              {/* <label>plateno</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setno(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter Vehicle Plate No"
              />
            </div>
          </div>
          <div class="text-center text-lg-start mt-4 pt-2">
            <button class="btn btn-primary btn-lg" onClick={visit}>
              Request Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicle;
