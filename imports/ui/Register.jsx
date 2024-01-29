import React, { useState } from "react";
import { toast } from "sonner/dist";
import { Accounts } from "meteor/accounts-base";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sampleData = {
    email: "",
    name: "",
    password: "",
    userRole: "",
  };
  const [formData, setFormData] = useState(sampleData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, name, userRole } = formData;
    Accounts.createUser(
      {
        email,
        password,
        profile: { name, role: userRole, switchRole: userRole === "lender" },
      },
      (error) => {
        setLoading(false);
        if (error) {
          console.log(error);
          toast.error("Error while Registering...");
        } else {
          toast.success("User registered successfully!");
          navigate(`/${Meteor.user()?.profile?.role || ""}`);
        }
      }
    );
  };
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl text-center font-semibold">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="flex flex-col gap-3 mt-5 w-[350px]">
          <label className="text-xl">Name</label>
          <input
            type="text"
            className="border px-4 py-2 w-[350px] focus:shadow-md focus:outline-none"
            placeholder="Student Name"
            value={formData.name}
            name="name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-3 mt-5 w-[350px]">
          <label className="text-xl">Select Role</label>
          <div className="flex gap-5">
            <div className="flex gap-1">
              <input
                type="radio"
                id="borrower"
                name="userRole"
                value="borrower"
                checked={formData.userRole === "borrower"}
                onChange={(e) => handleChange(e)}
              />
              <label htmlFor="borrower">borrower</label>
              <input
                type="radio"
                id="lender"
                name="userRole"
                value="lender"
                checked={formData.userRole === "lender"}
                onChange={(e) => handleChange(e)}
              />
              <label htmlFor="lender">lender</label>
              <input
                type="radio"
                id="admin"
                name="userRole"
                value="admin"
                checked={formData.userRole === "admin"}
                onChange={(e) => handleChange(e)}
              />
              <label htmlFor="admin">admin</label>
            </div>
          </div>
        </div>
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
            loading || !formData.email || !formData.password || !formData.name
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
            disabled={
              loading || !formData.email || !formData.password || !formData.name
            }
          >
            {loading ? "Creating user..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
