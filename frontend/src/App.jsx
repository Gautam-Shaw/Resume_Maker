import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ResumeMaker from "./pages/ResumeMaker";


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto mt-5 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resume-maker" element={<ResumeMaker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
