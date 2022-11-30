import { useState } from "react";
import Axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useParams } from "react-router-dom";

import React from "react";
//import ReactDOM from 'react-dom'
// function Login() {
//   const [usr, setusr] = useState("");

//   return (
//     // <div className="App">
//     //   <div className="Login">
//     //     <h1>Login</h1>
//     //     <label>username</label>
//     //     <input
//     //       type="text"
//     //       onChange={(e) => {
//     //         setusr(e.target.value);
//     //       }}
//     //     />
//     //   </div>
//     //   {/* <div>
//     //     <button onClick={reg}>login</button>
//     //   </div> */}
//     // </div>
//   );
// }

// export default Login;

export default function resetPassword() {
  const { username } = useParams();

  const formSchema = Yup.object().shape({
    password: Yup.string(),
  });
  const formOptions = { resolver: yupResolver(formSchema) };

  const {
    handleSubmit,
  } = useForm(formOptions);

  const [pwd, setPwd] = useState("");

  const onSubmit = async (data) => {
    try {
      console.log("state", username);
      let response = await Axios.post("/reset", {
        username: username,
        password: pwd,
      });
      if (response.data.status === "ok") {
        alert(
          "Password Reseted Successful!"
        );
        window.location.href = "/login";
      } else if (response.data.status === "error") {
        alert(response.data.error);
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <h3>Reset Password</h3>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
            }}
            id="loginpass"
          />
 
          <p className="error">console.log("Error occured")</p>
        </div>

        <button type="submit">Reset</button>
      </form>
    </>
  );
}