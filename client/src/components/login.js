import logo from "./logo.svg";
import React, { useEffect, useState } from "react";
import "./login.css";
import Axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [usr, setusr] = useState("");
  const [pass, setpass] = useState("");

  const signup = (data) => {
    window.location.replace("/signup");
  };
  const reset = (data) => {
    window.location.replace("/resetpassword");
  };

  const reg = (data) => {
    const response = Axios.post("http://localhost:5000/login", {
      usrname: usr,
      password: pass,
    }).then((response) => {
      if (
        response.data.status === "success" &&
        response.data.occupation === "student"
      ) {
        localStorage.setItem("token", response.data.auth);
        window.location.href = "/access";
      } else if (
        response.data.status === "success" &&
        response.data.occupation === "admin"
      ) {
        localStorage.setItem("token", response.data.auth);
        window.location.href = "/admin";
      } else {
        console.log(response.data.status);
        alert(response.data.error);
      }
    });
  };
  return (
    <div className="App">
      {/* <button onClick={signup}>signup</button>
      <button onClick={reset}>reset-pass</button> */}
      <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Campus Access Managment System</span>
      </nav>
      <div class="container p-1 my-3 bg-light w-60">
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1 my-5">
          <div className="Login">
            <h2>Login</h2>
            <div class="form-outline mb-4">
              {/* <label>username</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setusr(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter Username"
              />
            </div>
            <div class="form-outline mb-4">
              {/* <label>password</label> */}
              <input
                type="text"
                onChange={(e) => {
                  setpass(e.target.value);
                }}
                class="form-control form-control-lg"
                placeholder="Enter Password"
              />
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <a href="/resetPassword" class="text-body">
              Reset password?
            </a>
          </div>
          <div>
            <div class="text-center text-lg-start mt-4 pt-2">
              <button class="btn btn-primary btn-lg" onClick={reg}>
                Login
              </button>
              <p class="small fw-bold mt-2 pt-1 mb-0">
                Don't have an account?{" "}
                <a href="/signup" class="link-danger">
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
