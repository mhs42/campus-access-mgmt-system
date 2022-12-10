import React, { useState } from "react";
import { Table, Input } from "antd";
import Axios from "axios";
import { useTableSearch } from "./useTableSearch";
import { Link, useNavigate } from "react-router-dom";

const { Search } = Input;

const lgout = (data) => {
  localStorage.clear();
  window.location.replace("/login");
};

const adm = (data) => {
  window.location.href = "/viewrequestsadmin";
};

const ven_rqst = (data) => {
  window.location.replace("/vendor");
};

const ven_check = (data) => {
  window.location.replace("/vendorsearch");
};

const fetchUsers = async () => {
  console.log("In try");
  const token = localStorage.getItem("token");
  let instance = Axios.create({
    headers: { "x-access-token": token },
  });
  const { data } = await instance.get("http://localhost:5000/admin");
  console.log("data: ", data);
  if (data.status == "error") {
    alert(data.error);
    window.location.href = "/login";
  } else {
    return data;
  }
};

export default function App() {
  const navigate = useNavigate();
  async function reg(ev) {
    let ind = ev.currentTarget.dataset.index;
    let i = ind.split(",");
    console.log(i[0], i[1]);
    const token = localStorage.getItem("token");
    let instance = Axios.create({
      headers: { "x-access-token": token },
    });
    console.log(token);
    let response = await instance
      .post("http://localhost:5000/change", {
        usrname: i[0],
        status: i[1],
      })
      .then((response) => {
        if (response.data.status === "good") {
          window.location.href = "/admin";
        } else if (response.data.status === "error") {
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }

  async function reggg1(id) {
    console.log("inside regg1 hha");
    let ind = id.currentTarget.dataset.index;
    console.log(ind);
    navigate("/facility", {
      state: {
        id: ind,
      },
    });
  }

  async function regg1(id) {
    console.log("inside regg1 hha");
    let ind = id.currentTarget.dataset.index;
    console.log(ind);
    navigate("/ta", {
      state: {
        id: ind,
      },
    });
  }

  async function regg(ev) {
    let ind = ev.currentTarget.dataset.index;
    console.log(ind);
    const token = localStorage.getItem("token");
    let instance = Axios.create({
      headers: { "x-access-token": token },
    });
    console.log(token);
    let response = await instance
      .post("http://localhost:5000/delete", {
        usrname: ind,
        p: "here",
      })
      .then((response) => {
        if (response.data.status === "good") {
          window.location.href = "/admin";
        } else if (response.data.status === "error") {
          console.log(response.data.status);
          alert(response.data.error);
        }
      });
  }

  const userColumns = [
    {
      title: "user",
      dataIndex: "username",
      key: "user",
    },
    {
      title: "occupation",
      dataIndex: "occupation",
      key: "occupation",
    },
    {
      title: "state",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "change",
      dataIndex: "key",
      key: "key",
      render: (text, record) => (
        <button
          class="btn btn-primary btn-sm"
          data-index={[record.username, record.state]}
          onClick={reg}
        >
          change
        </button>
      ),
    },
    {
      title: "delete",
      dataIndex: "key",
      key: "key",
      render: (text, record) => (
        <button
          class="btn btn-primary btn-sm"
          data-index={[record.username]}
          onClick={regg}
        >
          delete
        </button>
      ),
    },
    {
      title: "TAs",
      dataIndex: "key",
      key: "key",
      render: (text, record) => (
        <button
          class="btn btn-primary btn-sm"
          data-index={[record.username]}
          onClick={regg1}
        >
          TAs
        </button>
      ),
    },
    {
      title: "facility",
      dataIndex: "key",
      key: "key",
      render: (text, record) => (
        <button
          class="btn btn-primary btn-sm"
          data-index={[record.username]}
          onClick={reggg1}
        >
          facility
        </button>
      ),
    },
  ];
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers,
  });

  return (
    <>
      <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Campus Access Managment System</span>
        <div>
          <button class="btn btn-secondary" onClick={adm}>
            view-requests
          </button>
          <button class="btn btn-secondary" onClick={ven_rqst}>
            view-vendors
          </button>
          <button class="btn btn-secondary" onClick={ven_check}>
            vendors-search
          </button>
          <button class="btn btn-outline-danger" onClick={lgout}>
            Logout
          </button>
        </div>
      </nav>
      {/* <button onClick={lgout}>logout</button> */}
      {/* <button onClick={adm}>view-requests</button>
      <button onClick={ven_rqst}>view-vendors</button>
      <button onClick={ven_check}>vendors-search</button> */}
      <div class="mt-5"></div>
      <Search
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{ position: "sticky", top: "0", left: "0" }}
      />
      <br /> <br />
      <Table
        rowKey="name"
        dataSource={filteredData}
        columns={userColumns}
        loading={loading}
        pagination={false}
      />
    </>
  );
}
