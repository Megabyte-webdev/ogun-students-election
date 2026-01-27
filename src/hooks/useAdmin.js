// hooks/useAdmin.js
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

const useAdmin = () => {
  const { token } = useAuth(); // admin auth token

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": token,
  };

  const get = async (endpoint) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, { headers });
    return res.json();
  };

  const post = async (endpoint, body) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const patch = async (endpoint, body = {}) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "PATCH",
      headers,
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    });
    return res.json();
  };

  const remove = async (endpoint) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return res.json();
  };

  // Election endpoints
  const createElection = (data) => post("elections", data);
  const updateElection = (id, data) => patch(`elections/${id}`, data);
  const activateElection = (id) => patch(`${id}/activate`);
  const deactivateElection = (id) => patch(`${id}/deactivate`);
  const deleteElection = (id) => remove(`elections/${id}`);
  const closeElection = (id) => post(`elections/${id}/close`);

  // Position endpoints
  const createPosition = (data) => post("positions", data);
  const activatePosition = (id) => patch(`positions/${id}/activate`);
  const deletePosition = (id) => remove(`positions/${id}`);

  // Candidate endpoints
  const createCandidate = (data) => post("candidates", data);
  const activateCandidate = (id) => patch(`candidates/${id}/activate`);
  const deleteCandidate = (id) => remove(`candidates/${id}`);

  // Audit / stats endpoints
  const listVotes = () => get("votes");
  const listAbuseLogs = () => get("abuse-logs");

  return {
    createElection,
    updateElection,
    activateElection,
    deactivateElection,
    deleteElection,
    closeElection,

    createPosition,
    activatePosition,
    deletePosition,

    createCandidate,
    activateCandidate,
    deleteCandidate,

    listVotes,
    listAbuseLogs,
    get,
  };
};

export default useAdmin;
