import { Link } from "react-router-dom";

const API = "https://event-management-platform-efb5.onrender.com/api";

function EventCard({ event, onRegister }) {
  const token = localStorage.getItem("token");
  const canRegister = event.status === "Upcoming" && event.availableSeats > 0 && token;

  const register = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API}/events/${event._id}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      alert(data.message);
      onRegister?.();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <article className="event-card">
      {event.image ? <img src={event.image} alt={event.title} className="event-image" /> : <div className="event-image placeholder">Event</div>}
      <div className="event-body">
        <span className="badge">{event.category}</span>
        <h3>{event.title}</h3>
        <p className="muted">{event.description}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Available Seats:</strong> {event.availableSeats}</p>
        <div className="card-actions">
          <Link className="button secondary" to={`/events/${event._id}`}>View Details</Link>
          {event.status === "Completed" ? (
            <span className="status completed">Completed</span>
          ) : event.availableSeats === 0 ? (
            <span className="status full">Event Full</span>
          ) : token ? (
            <button className="button" onClick={register}>Register</button>
          ) : (
            <Link className="button" to="/login">Login to Register</Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default EventCard;
