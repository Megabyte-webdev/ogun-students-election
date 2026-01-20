import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Vote from "./pages/Vote";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Signup from "./pages/Signup";
import VotingDashboard from "./pages/VotingDashboard";

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/vote" element={<VotingDashboard />} />

          <Route
            path="/dashboard"
            element={
              <Protected>
                <AdminDashboard />
              </Protected>
            }
          />

          <Route
            path="/vote"
            element={
              <Protected>
                <Vote />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
