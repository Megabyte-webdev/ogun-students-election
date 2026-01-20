import { useState, useEffect } from "react";
import useAdmin from "../hooks/useAdmin";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function CandidateForm({ onCreated }) {
  const { createCandidate, get } = useAdmin();
  const [form, setForm] = useState({
    positionId: "",
    name: "",
    photo: "",
    manifesto: "",
  });
  const [positions, setPositions] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  // Fetch positions for dropdown
  useEffect(() => {
    get("positions").then((res) => {
      if (res.positions) setPositions(res.positions);
    });
  }, []);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.positionId)
      return setStatus({ ...status, error: "Select a position first" });
    if (!form.name.trim())
      return setStatus({ ...status, error: "Candidate name is required" });

    setStatus({ loading: true, error: "", success: "" });
    try {
      const res = await createCandidate(form);
      if (res.success) {
        setStatus({
          loading: false,
          error: "",
          success: "Candidate created successfully!",
        });
        onCreated(res.candidateId);
        setForm({ positionId: "", name: "", photo: "", manifesto: "" });
      } else {
        setStatus({
          loading: false,
          error: res.message || "Failed to create candidate",
          success: "",
        });
      }
    } catch {
      setStatus({
        loading: false,
        error: "Error creating candidate",
        success: "",
      });
    }
  };

  const Message = ({ type, children }) => (
    <div
      className={`mb-4 p-3 rounded-lg flex items-start ${
        type === "error"
          ? "bg-red-50 border border-red-200 text-red-800"
          : "bg-green-50 border border-green-200 text-green-800"
      }`}
    >
      {type === "error" ? (
        <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
      ) : (
        <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
      )}
      <div>{children}</div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl border border-gray-200"
    >
      {status.success && <Message type="success">{status.success}</Message>}
      {status.error && <Message type="error">{status.error}</Message>}

      <h2 className="text-lg font-semibold text-gray-900">Create Candidate</h2>

      <select
        value={form.positionId}
        onChange={handleChange("positionId")}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Position</option>
        {positions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="Candidate Name"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <input
        type="text"
        value={form.photo}
        onChange={handleChange("photo")}
        placeholder="Photo URL (optional)"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <textarea
        value={form.manifesto}
        onChange={handleChange("manifesto")}
        placeholder="Manifesto"
        rows={3}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() =>
            setForm({ positionId: "", name: "", photo: "", manifesto: "" })
          }
          className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          disabled={status.loading}
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={status.loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
          {status.loading ? (
            <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
          ) : (
            "Create Candidate"
          )}
        </button>
      </div>
    </form>
  );
}
