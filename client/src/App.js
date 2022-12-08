import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./components/signup";
import Login from "./components/login";
import Access from "./components/access";
import Admin from "./components/admin";
import Visitor from "./components/visitor";
import Viewrequests from "./components/viewrequests"
import Viewrequestsadmin from "./components/viewrequestsadmin";
import Vehicle from "./components/vehicle";
import Resetpassword from "./components/resetpassword";
import Ta from "./components/ta";
import Facility from "./components/facility";


export default function App() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>} />
      </Routes>
      <Routes>
        <Route path="signup" element={<Signup/>} />
      </Routes>
      <Routes>
        <Route path="login" element={<Login/>} />
      </Routes>
      <Routes>
        <Route path="access" element={<Access/>} />
      </Routes>
      <Routes>
        <Route path="admin" element={<Admin/>} />
      </Routes>
      <Routes>
        <Route path="visitor" element={<Visitor/>} />
      </Routes>
      <Routes>
        <Route path="vehicle" element={<Vehicle/>} />
      </Routes>
      <Routes>
        <Route path="viewrequests" element={<Viewrequests/>} />
      </Routes>
      <Routes>
        <Route path="viewrequestsadmin" element={<Viewrequestsadmin/>} />
      </Routes>
      <Routes>
        <Route path="resetpassword" element={<Resetpassword/>} />
      </Routes>
      <Routes>
        <Route path="ta" element={<Ta/>} />
      </Routes>
      <Routes>
        <Route path="facility" element={<Facility/>} />
      </Routes>
    </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
