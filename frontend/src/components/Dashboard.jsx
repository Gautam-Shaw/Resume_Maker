import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetch("https://resume-maker-backend-9ygy.onrender.com", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch(() => navigate("/login"));
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">

      <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-center">Dashboard</h1>
        {user && <p className="mt-4 text-lg text-center">Hello, <span className="font-bold text-blue-500">{user.name}</span>!</p>}

        <Link to="/resume-maker">
          <button className="mt-6 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Create Resume
          </button>
        </Link>

        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          onClick={() => navigate("/")}
        >Go to Home
        </button>

      </div>

    </div>
  );
};

export default Dashboard;
