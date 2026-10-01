import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API = "http://localhost:5000/api";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await fetch(`${API}/events/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Event not found");
      setEvent(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const register = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const response = await fetch(`${API}/events/${id}/register`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    const data = await response.json();
    if (!response.ok) return alert(data.message);
    alert(data.message);
    load();
  };

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p className="error">Event not found.</p>;

  return (
    <section className="details">
      {event.image && <img src={event.image} alt={event.title} className="details-image" />}
      <span className="badge">{event.category}</span>
      <h1>{event.title}</h1>
      <p className="large">{event.description}</p>
      <div className="details-grid">
        <p><strong>Date</strong><span>{new Date(event.date).toLocaleDateString()}</span></p>
        <p><strong>Time</strong><span>{event.time}</span></p>
        <p><strong>Location</strong><span>{event.location}</span></p>
        <p><strong>Capacity</strong><span>{event.capacity}</span></p>
        <p><strong>Available Seats</strong><span>{event.availableSeats}</span></p>
        <p><strong>Status</strong><span>{event.status}</span></p>
      </div>
      <div className="card-actions">
        <Link className="button secondary" to="/events">Back</Link>
        {event.status === "Completed" ? <span className="status completed">Event Completed</span> :
          event.availableSeats === 0 ? <span className="status full">Event Full</span> :
          localStorage.getItem("token") ? <button className="button" onClick={register}>Register</button> :
          <Link className="button" to="/login">Login to Register</Link>}
      </div>
    </section>
  );
}

export default EventDetails;
