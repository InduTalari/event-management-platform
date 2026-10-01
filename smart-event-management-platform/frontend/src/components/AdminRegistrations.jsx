import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API = "https://event-management-platform-efb5.onrender.com/api";

function AdminRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/events/${id}/registrations`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || "Unable to load registrations");
        return data;
      })
      .then(setRegistrations)
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <section>
      <div className="section-heading"><div><h1>Event Registrations</h1><p className="muted">Registered users for this event.</p></div><Link to="/admin">Back to Admin</Link></div>
      {loading ? <p>Loading registrations...</p> : registrations.length === 0 ? <p className="empty">No registrations yet.</p> :
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Registered On</th></tr></thead><tbody>
          {registrations.map((r) => <tr key={r._id}><td>{r.user?.name}</td><td>{r.user?.email}</td><td>{new Date(r.registeredAt).toLocaleDateString()}</td></tr>)}
        </tbody></table></div>}
    </section>
  );
}
export default AdminRegistrations;
