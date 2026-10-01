import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import UpcomingEvents from "./components/UpcomingEvents";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import MyRegistrations from "./components/MyRegistrations";
import AdminDashboard from "./components/AdminDashboard";
import EventForm from "./components/EventForm";
import AdminRegistrations from "./components/AdminRegistrations";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/upcoming-events" element={<UpcomingEvents />} />
          <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/events/create" element={<ProtectedRoute adminOnly><EventForm /></ProtectedRoute>} />
          <Route path="/admin/events/edit/:id" element={<ProtectedRoute adminOnly><EventForm /></ProtectedRoute>} />
          <Route path="/events/:id/registrations" element={<ProtectedRoute adminOnly><AdminRegistrations /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
