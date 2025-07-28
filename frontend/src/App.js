import logo from "./logo.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import "./App.css";
import Apply from "./pages/Apply";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardExecutive from "./pages/DashboardExecutive";
import DashboardExpert from "./pages/DashboardExpert";
import ApplicationDetails from "./pages/ApplicationDetails";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-executive" element={<DashboardExecutive />} />
        <Route path="/dashboard-ekspert" element={<DashboardExpert />} />
        <Route path="/application/:id" element={<ApplicationDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
