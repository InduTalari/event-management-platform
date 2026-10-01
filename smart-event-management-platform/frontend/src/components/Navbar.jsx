import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link className="brand" to={token ? "/dashboard" : "/login"}>Smart Events</Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/upcoming-events">Upcoming</Link>
            <Link to="/events">All Events</Link>
            <Link to="/my-registrations">My Registrations</Link>
            {user?.role === "admin" && <Link to="/admin">Admin</Link>}
            {user?.role === "admin" && <Link to="/admin/events/create">Create Event</Link>}
            <button className="link-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
