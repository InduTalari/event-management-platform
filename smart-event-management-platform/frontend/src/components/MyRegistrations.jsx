import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API}/registrations/my`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load registrations");
        setRegistrations(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section>
      <h1>My Registrations</h1>
      {loading ? <p>Loading registrations...</p> : registrations.length === 0 ? <p className="empty">You haven't registered for any events yet.</p> :
        <div className="table-wrap"><table><thead><tr><th>Event</th><th>Date</th><th>Time</th><th>Location</th><th>Registered On</th><th>Status</th></tr></thead>
          <tbody>{registrations.map((item) => {
            const completed = new Date(item.event.date) < new Date(new Date().setHours(0,0,0,0));
            return <tr key={item.id}><td>{item.event.title}</td><td>{new Date(item.event.date).toLocaleDateString()}</td><td>{item.event.time}</td><td>{item.event.location}</td><td>{new Date(item.registeredAt).toLocaleDateString()}</td><td>{completed ? "Completed" : "Upcoming"}</td></tr>;
          })}</tbody>
        </table></div>}
    </section>
  );
}

export default MyRegistrations;
