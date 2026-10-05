import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Learning from "./pages/Learning";
import Progress from "./pages/Progress";

function App() {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<Home />} />
      <Route path="/index.html" element={<Home />} />

      {/* AUTH (login / register / forgot / reset — all tabs live in one page) */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth.html" element={<Auth />} />

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard.html" element={<Dashboard />} />

      {/* COURSES */}
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses.html" element={<Courses />} />

      {/* LEARNING */}
      <Route path="/learning" element={<Learning />} />
      <Route path="/learning.html" element={<Learning />} />

      {/* PROGRESS */}
      <Route path="/progress" element={<Progress />} />
      <Route path="/progress.html" element={<Progress />} />
    </Routes>
  );
}

export default App;
