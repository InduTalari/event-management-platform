import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Welcome Back</h1>
      <p className="muted">Login to manage and register for events.</p>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit} className="form">
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></label>
        <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></label>
        <button className="button" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p>New user? <Link to="/register">Create an account</Link></p>
    </section>
  );
}

export default Login;
