import React from "react";
import { useState } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  let navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [usr, setusr] = useState("");

  const onForgot = async (data) => {
    try {
      let response = await Axios.post("/resetPassword", { username: usr });
      if (response.data.status === "ok") {
        navigate(`/reset/${usr}`);
      } else if (response.data.status === "error") {
        alert(response.data.error);
      }
    } catch (err) {
      // }
      alert(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onForgot)}>
        <h3>Reset Password</h3>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={usr}
            onChange={(e) => {
              setusr(e.target.value);
            }}
          />
        </div>

        <button type="submit">Reset Password</button>
      </form>
    </>
  );
}
export default ForgotPassword;
