import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";

const API = "http://localhost:5000/api";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await fetch(`${API}/events/upcoming`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load events");
      setEvents(data.slice(0, 3));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <section>
      <div className="hero">
        <div><p className="eyebrow">SMART EVENT MANAGEMENT</p><h1>Welcome, {user?.name}!</h1><p>Discover upcoming events and register in a few clicks.</p></div>
        <Link className="button" to="/events">Browse Events</Link>
      </div>
      <div className="section-heading"><div><h2>Upcoming Events</h2><p className="muted">The nearest events are shown first.</p></div><Link to="/upcoming-events">View All</Link></div>
      {loading ? <p>Loading events...</p> : events.length === 0 ? <p className="empty">No upcoming events available.</p> :
        <div className="event-grid">{events.map((event) => <EventCard key={event._id} event={event} onRegister={load} />)}</div>}
    </section>
  );
}

export default Dashboard;
