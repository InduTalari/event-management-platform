import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "https://event-management-platform-efb5.onrender.com/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Create Account</h1>
      <p className="muted">Join events at your college or community.</p>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={submit} className="form">
        <label>Name<input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></label>
        <label>Password<input type="password" minLength="6" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></label>
        <button className="button" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </section>
  );
}

export default Register;
