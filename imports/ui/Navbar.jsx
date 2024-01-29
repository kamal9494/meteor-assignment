import React from "react";

const Navbar = ({ user, userRole, handleLogout }) => {
  return (
    <div className="flex justify-between p-2 items-center">
      <p>Welcome, {user || "User"}!</p>
      <div>
        {userRole && (
          <div className="flex gap-3 items-center">
            <label>
              Current role: <span className="font-semibold">{userRole}</span>
            </label>
            <button
              className="p-2 bg-red-500 text-white rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
        {!userRole && (
          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={handleLogout}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
