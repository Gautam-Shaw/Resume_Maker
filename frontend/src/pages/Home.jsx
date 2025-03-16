const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Resume Maker</h1>
        <p className="text-lg text-gray-600 mb-6">Create professional resumes in minutes.</p>
        <div className="space-x-4">
          <a href="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
            Sign Up
          </a>
          <a href="/login" className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;


