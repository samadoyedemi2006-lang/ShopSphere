import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>User Dashboard</h2>

      {user && `${user.name.toUpperCase()}!! Welcome to your dashboard!`}
      <br />

      {user && (
        <>
        <h2>Profile Information</h2>
          <p>User ID: {user.id}</p>
          <p>User Name: {user.name}</p>
          <p>User Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}
