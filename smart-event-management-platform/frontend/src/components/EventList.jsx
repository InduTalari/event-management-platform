import { useEffect, useState } from "react";
import EventCard from "./EventCard";

const API = "https://event-management-platform-efb5.onrender.com/api";

function EventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async (query = "") => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/events${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load events");
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadEvents(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section>
      <div className="section-heading">
        <div><h1>All Events</h1><p className="muted">Search by title, category or location.</p></div>
        <input className="search" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading ? <p>Loading events...</p> : error ? <div className="error">{error}</div> : events.length === 0 ? <p className="empty">No events found.</p> :
        <div className="event-grid">{events.map((event) => <EventCard key={event._id} event={event} onRegister={() => loadEvents(search)} />)}</div>}
    </section>
  );
}

export default EventList;
