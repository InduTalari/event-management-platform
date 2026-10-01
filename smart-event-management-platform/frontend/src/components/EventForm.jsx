import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://event-management-platform-efb5.onrender.com/api";

const initial = { title: "", description: "", date: "", time: "", location: "", category: "", capacity: 50, image: "" };

function EventForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(editing);

  useEffect(() => {
    if (!editing) return;
    fetch(`${API}/events/${id}`)
      .then((r) => r.json())
      .then((data) => setForm({
        title: data.title || "", description: data.description || "", date: data.date ? data.date.slice(0,10) : "",
        time: data.time || "", location: data.location || "", category: data.category || "",
        capacity: data.capacity || 50, image: data.image || ""
      }))
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [editing, id]);

  const submit = async (e) => {
    e.preventDefault();
    const response = await fetch(editing ? `${API}/events/${id}` : `${API}/events`, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) return alert(data.message || "Could not save event");
    alert(data.message);
    navigate("/admin");
  };

  if (loading) return <p>Loading event...</p>;

  return (
    <section className="form-card">
      <h1>{editing ? "Edit Event" : "Create Event"}</h1>
      <form className="form" onSubmit={submit}>
        <label>Title<input required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></label>
        <label>Description<textarea required rows="4" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /></label>
        <div className="two-col"><label>Date<input type="date" required value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} /></label><label>Time<input required value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} /></label></div>
        <div className="two-col"><label>Location<input required value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} /></label><label>Category<input required value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} /></label></div>
        <label>Capacity<input type="number" min="1" required value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} /></label>
        <label>Image URL<input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} /></label>
        <div className="card-actions"><button className="button">{editing ? "Update Event" : "Create Event"}</button><button type="button" className="button secondary" onClick={() => navigate("/admin")}>Cancel</button></div>
      </form>
    </section>
  );
}

export default EventForm;
