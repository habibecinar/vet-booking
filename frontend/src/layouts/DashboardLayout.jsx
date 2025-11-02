import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const role = decoded.role || "";

  return (
    <div className="dashboard">
      <Sidebar role={role} />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
