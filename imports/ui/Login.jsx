import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { toast } from "sonner/dist";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin, setUserRole }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sampleData = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(sampleData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = formData;
    Meteor.loginWithPassword(email, password, (result,error) => {
      setLoading(false);
      if (error) {
        console.log(error);
        toast.error("Error while Logging In...");
      } else {
        toast.success("User logged in successfully!");
        onLogin();
        localStorage.setItem("userRole", Meteor.user().profile.role);
        setUserRole(Meteor.user().profile.role);
        navigate(`/${Meteor.user()?.profile?.role || ""}`);
      }
    });
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-3 mt-5 w-[350px]">
          <label className="text-xl">Email</label>
          <input
            type="email"
            className="border px-4 py-2 w-[350px] focus:shadow-md focus:outline-none"
            placeholder="Enter Email"
            value={formData.email}
            name="email"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex flex-col gap-3 mt-5  w-[350px]">
          <label className="text-xl">Password</label>
          <input
            type="password"
            className="border px-4 py-2 w-[350px] focus:shadow-md focus:outline-none"
            placeholder="Enter Password"
            value={formData.password}
            name="password"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="flex gap-3 mt-6 w-[350px]">
          <button
            type="submit"
            className={`px-4 mb-4 w-full py-2 bg-[#0d6efd] rounded-lg hover:bg-[#0b5ed7] text-white
          ${
            loading || !formData.email || !formData.password
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </div>
        <div className="flex gap-3 mt-5 w-[350px]">
          <p>Don't have an account register</p>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="hover:cursor-pointer text-blue-700 focus:outline-none"
          >
            here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
