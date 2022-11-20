import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./components/signup";
import Login from "./components/login";
import Access from "./components/access";
import Admin from "./components/admin";



export default function App() {
    return (
    <BrowserRouter>
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
    </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
