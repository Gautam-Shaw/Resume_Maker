import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Resume Maker</h1>
      <div className="space-x-4">
        <Link to="/" className="text-white hover:underline">Home</Link>
        <Link to="/dashboard" className="text-white hover:underline">Dashboard</Link>
        <Link to="/signup" className="text-white hover:underline">Signup</Link>
        <Link to="/login" className="text-white hover:underline">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
