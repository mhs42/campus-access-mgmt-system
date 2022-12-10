import React, { useEffect, useState, Component } from "react";
import "./visitor.css";
import Axios from "axios";

const Visitor = () => {
  const [name, setname] = useState("");
  const [cnic, setcnic] = useState("");

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
        .post("http://localhost:5000/visitor", {
          name: name,
          cnic: cnic,
        })
        .then((response) => {
          if (response.data.status === "success") {
            window.location.href = "/access";
          } else {
            console.log(response.data.status);
            alert(response.data.error);
            window.location.replace("/login");
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
          <div className="visitor">
            <h2>Visitor</h2>
            <div class="form-outline mb-4">
              <input
                type="text"
                onChange={(e) => {
                  setname(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter visitor name"
              />
            </div>
            <div class="form-outline mb-4">
              <input
                type="text"
                onChange={(e) => {
                  setcnic(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter CNIC"
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

export default Visitor;
