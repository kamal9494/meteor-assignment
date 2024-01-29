import React, { useState, useEffect } from "react";
import Register from "./Register";
import Login from "./Login";
import Navbar from "./Navbar";
import BorrowerDashboard from "./BorrowerDashboard";
import BorrowerView from "./Views/BorrowerView";
import AdminView from "./Views/AdminView";
import LenderView from "./Views/LenderView";
import AdminDashboard from "./AdminDashboard";
import LenderDashboard from "./LenderDashboard";
import { Toaster, toast } from "sonner/dist";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Routes, Route, useNavigate } from "react-router-dom";

export const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user());

  useEffect(() => {
    const isLoggedIn = !!Meteor.userId();
    if (!isLoggedIn) {
      // navigate("/login");
    } else {
      setLoggedIn(true);
      const storedUserRole = localStorage.getItem("userRole");
      if (storedUserRole) {
        setUserRole(storedUserRole);
      } else {
        setUserRole(Meteor.user()?.profile?.role || "");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    Meteor.logout();
    setLoggedIn(false);
    setUserRole("");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleRoleConfirmation = (role) => {
    Meteor.call("users.setRole", Meteor.userId(), role, (error, result) => {
      if (error) toast.error("Error occured!");
      else toast.success("Role changed to " + role);
    });
    setUserRole(role);
    localStorage.setItem("userRole", role);
    if (role === "lender") {
      navigate("/lender");
    } else if (role === "borrower") {
      navigate("/borrower");
    }
  };

  return (
    <>
      <Navbar
        user={user?.profile?.name || "User"}
        handleLogout={handleLogout}
        userRole={user?.profile?.role || ""}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => setLoggedIn(true)}
              setUserRole={setUserRole}
            />
          }
        />

        <Route path="/register" element={<Register />} />
        <Route
          path="/borrower"
          element={
            <BorrowerView role={userRole}>
              <BorrowerDashboard />
            </BorrowerView>
          }
        />
        <Route
          path="/lender"
          element={
            <LenderView role={userRole}>
              <LenderDashboard
                changeRole={handleRoleConfirmation}
                userRole={userRole}
                setUserRole={setUserRole}
              />
            </LenderView>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminView role={userRole}>
              <AdminDashboard />
            </AdminView>
          }
        />
      </Routes>
      <Toaster expand={true} richColors />
    </>
  );
};
