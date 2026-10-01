import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://event-management-platform-efb5.onrender.com/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  const load = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      const [statsResponse, eventsResponse] = await Promise.all([
        fetch(`${API}/events/stats`, { headers }),
        fetch(`${API}/events`)
      ]);
      const statsData = await statsResponse.json();
      const eventsData = await eventsResponse.json();
      if (!statsResponse.ok) throw new Error(statsData.message || "Unable to load admin data");
      setStats(statsData);
      setEvents(eventsData);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const response = await fetch(`${API}/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await response.json();
    if (!response.ok) return alert(data.message);
    load();
  };

  return (
    <section>
      <div className="section-heading"><div><p className="eyebrow">ADMIN</p><h1>Admin Dashboard</h1></div><Link className="button" to="/admin/events/create">Create Event</Link></div>
      {stats && <div className="stats-grid">
        <div className="stat"><span>Total Events</span><strong>{stats.totalEvents}</strong></div>
        <div className="stat"><span>Upcoming Events</span><strong>{stats.upcomingEvents}</strong></div>
        <div className="stat"><span>Completed Events</span><strong>{stats.completedEvents}</strong></div>
        <div className="stat"><span>Total Registrations</span><strong>{stats.totalRegistrations}</strong></div>
      </div>}
      <h2>Manage Events</h2>
      <div className="table-wrap"><table><thead><tr><th>Title</th><th>Date</th><th>Status</th><th>Seats</th><th>Actions</th></tr></thead>
        <tbody>{events.map((event) => <tr key={event._id}><td>{event.title}</td><td>{new Date(event.date).toLocaleDateString()}</td><td>{event.status}</td><td>{event.availableSeats}/{event.capacity}</td>
          <td className="actions"><Link to={`/events/${event._id}`}>View</Link><Link to={`/admin/events/edit/${event._id}`}>Edit</Link><Link to={`/events/${event._id}/registrations`}>Registrations</Link><button className="danger-link" onClick={() => remove(event._id)}>Delete</button></td></tr>)}</tbody>
      </table></div>
      <p className="muted small">To view registrations for an event, use the Registrations action. The API is protected for admins.</p>
    </section>
  );
}

export default AdminDashboard;
