import { User, Shield } from "phosphor-react";
import loginpageimage from "/LoginPageImage.png"; // Replace with the correct image path
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section with Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <img
          src={loginpageimage}
          alt="Login Illustration"
          className="max-w-md w-full"
        />
      </div>

      {/* Right Section with Buttons */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">Welcome to Dhanupay</h1>
        <div className="flex gap-4">
          <button
            className="flex flex-col items-center justify-center w-28 h-28 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            onClick={() => navigate("/administrator")}
          >
            <Shield size={40} />
            <span className="mt-2 text-sm">Admin</span>
          </button>
          <button
            className="flex flex-col items-center justify-center w-28 h-28 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
            onClick={() => navigate("/login")}
          >
            <User size={40} />
            <span className="mt-2 text-sm">User</span>
          </button>
        </div>
      </div>
    </div>
  );
}
