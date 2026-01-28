import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import Vote from "./pages/Vote";
import { AuthProvider, useAuth } from "./context/AuthContext";
import VotingDashboard from "./pages/VotingDashboard";
import AdminForm from "./pages/AdminForm";

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/secure/login" element={<AdminForm />} />
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
