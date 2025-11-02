import React, { useEffect, useState } from "react";
import axios from "axios";


function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    setRole(decoded.role);
    setUserId(decoded.userId);

    axios
      .get('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Failed to fetch appointments"));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5001/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? res.data : a))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="dashboard">
<div className="dashboard-content">
  <div className="dashboard-header">
    <h2>{role === "vet" ? "Veterinarian Dashboard" : "My Dashboard"}</h2>
  </div>

  {error && <div className="alert alert-danger">{error}</div>}

  <div className="cards-row">
    {role === "owner" && (
      <>
        <div className="card">My Appointments: {appointments.length}</div>
        <div className="card">Pending: {appointments.filter(a => a.status==="pending").length}</div>
      </>
    )}
    {role === "vet" && (
      <>
        <div className="card">Today's Appointments: {appointments.length}</div>
        <div className="card">Pending Approvals: {appointments.filter(a => a.status==="pending").length}</div>
      </>
    )}
  </div>
</div>
</div>
  );
}
export default AppointmentsDashboard;
