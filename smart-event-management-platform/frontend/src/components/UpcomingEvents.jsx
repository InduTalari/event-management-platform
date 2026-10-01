import { useEffect, useState } from "react";
import EventCard from "./EventCard";

const API = "https://event-management-platform-efb5.onrender.com/api";

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (query = "") => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/events/upcoming${query ? `?search=${encodeURIComponent(query)}` : ""}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load upcoming events");
      setEvents(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const timer = setTimeout(() => load(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section>
      <div className="section-heading">
        <div><h1>Upcoming Events</h1><p className="muted">Nearest events appear first.</p></div>
        <input className="search" placeholder="Search upcoming events..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading ? <p>Loading events...</p> : events.length === 0 ? <p className="empty">No upcoming events available.</p> :
        <div className="event-grid">{events.map((event) => <EventCard key={event._id} event={event} onRegister={() => load(search)} />)}</div>}
    </section>
  );
}

export default UpcomingEvents;
