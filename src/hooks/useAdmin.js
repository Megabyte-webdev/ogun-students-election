// hooks/useAdmin.js
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

const useAdmin = () => {
  const { token } = useAuth(); // token from context

  async function post(endpoint, body) {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async function postVote(endpoint, body) {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async function get(endpoint) {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      headers: {
        "x-admin-token": token,
      },
    });
    return res.json();
  }

  async function getOpen(endpoint) {
    const res = await fetch(`${API_BASE}/${endpoint}`);
    return res.json();
  }

  const activateElection = async (id) => {
    const res = await fetch(`${API_BASE}/admin/${id}/activate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
    });
    return res.json();
  };
  const deactivateElection = async (id) => {
    const res = await fetch(`${API_BASE}/admin/${id}/deactivate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
    });
    return res.json();
  };
  const updateElection = async (id, data) => {
    const res = await fetch(`${API_BASE}/admin/elections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", "x-admin-token": token },
    });
    return res.json();
  };

  // Functions exposed to components
  return {
    createElection: (data) => post("elections", data),
    updateElection,
    createPosition: (data) => post("positions", data),
    createCandidate: (data) => post("candidates", data),
    closeElection: (id) => post(`elections/${id}/close`),
    listVotes: () => get("votes"),
    listAbuseLogs: () => get("abuse-logs"),
    activateElection,
    deactivateElection,
    get,
    post: postVote,
    getOpen,
  };
};

export default useAdmin;
