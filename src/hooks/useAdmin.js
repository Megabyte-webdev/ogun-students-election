// hooks/useAdmin.js
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

const useAdmin = () => {
  const { auth } = useAuth();

  const jsonHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.token}`,
  };

  const authHeaders = {
    Authorization: `Bearer ${auth?.token}`,
  };

  const get = async (endpoint) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      headers: jsonHeaders,
    });
    return res.json();
  };
  const getOpen = async (endpoint) => {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      headers: jsonHeaders,
    });
    return res.json();
  };

  const post = async (endpoint, body) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const postForm = async (endpoint, formData) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "POST",
      headers: authHeaders, // ❗ no Content-Type
      body: formData,
    });
    return res.json();
  };

  const patch = async (endpoint, body = {}) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    });
    return res.json();
  };

  const remove = async (endpoint) => {
    const res = await fetch(`${API_BASE}/admin/${endpoint}`, {
      method: "DELETE",
      headers: jsonHeaders,
    });
    return res.json();
  };

  // Elections
  const createElection = (data) => post("elections", data);
  const updateElection = (id, data) => patch(`elections/${id}`, data);
  const activateElection = (id) => patch(`${id}/activate`);
  const deactivateElection = (id) => patch(`${id}/deactivate`);
  const deleteElection = (id) => remove(`elections/${id}`);

  // Positions
  const createPosition = (data) => post("positions", data);
  const updatePosition = (id, data) => patch(`positions/${id}`, data);
  const deletePosition = (id) => remove(`positions/${id}`);

  // Candidates (MULTI-FORM)
  const createCandidate = (formData) => postForm("candidates", formData);
  const updateCandidate = (id, formData) =>
    fetch(`${API_BASE}/admin/candidates/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
      body: formData,
    }).then((res) => res.json());
  const deleteCandidate = (id) => remove(`candidates/${id}`);

  // Logs
  const listVotes = () => get("votes");
  const listAbuseLogs = () => get("abuse-logs");

  return {
    createElection,
    updateElection,
    activateElection,
    deactivateElection,
    deleteElection,

    createPosition,
    updatePosition,
    deletePosition,

    createCandidate,
    updateCandidate,
    deleteCandidate,

    listVotes,
    listAbuseLogs,
    get,
    getOpen,
    post,
  };
};

export default useAdmin;
