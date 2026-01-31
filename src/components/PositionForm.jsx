import { useState, useEffect } from "react";
import useAdmin from "../hooks/useAdmin";
import { CheckCircle2, AlertCircle } from "lucide-react";

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

export default function PositionForm({ onCreated, position }) {
  const { createPosition, updatePosition, get } = useAdmin();

  const [form, setForm] = useState({ electionId: "", name: "" });
  const [elections, setElections] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  // Fetch elections for dropdown
  useEffect(() => {
    get("elections").then((res) => {
      if (res.elections && res.elections.length > 0) {
        setElections(res.elections);
        setForm((prev) => ({
          ...prev,
          electionId: position?.electionId || res.elections[0].id,
          name: position?.name || prev.name,
        }));
      }
    });
  }, [position]);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.electionId)
      return setStatus({ ...status, error: "Select an election first" });
    if (!form.name.trim())
      return setStatus({ ...status, error: "Position name is required" });

    setStatus({ loading: true, error: "", success: "" });

    try {
      let res;
      if (position?.id) {
        // Update mode
        res = await updatePosition(position.id, form);
      } else {
        // Create mode
        res = await createPosition(form);
      }

      if (res.success) {
        setStatus({
          loading: false,
          error: "",
          success: position?.id
            ? "Position updated successfully!"
            : "Position created successfully!",
        });
        onCreated(res.position || res.positionId);
        // Reset form only if creating new
        if (!position?.id) setForm({ electionId: "", name: "" });
      } else {
        setStatus({
          loading: false,
          error: res.message || "Operation failed",
          success: "",
        });
      }
    } catch {
      setStatus({
        loading: false,
        error: "Internal error occurred",
        success: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl border border-gray-200"
    >
      {status.success && <Message type="success">{status.success}</Message>}
      {status.error && <Message type="error">{status.error}</Message>}

      <h2 className="text-lg font-semibold text-gray-900">
        {position?.id ? "Update Position" : "Create Position"}
      </h2>

      <select
        value={form.electionId}
        onChange={handleChange("electionId")}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select Election</option>
        {elections.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={form.name}
        onChange={handleChange("name")}
        placeholder="Position Name"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <div className="flex justify-end space-x-2">
        {!position?.id && (
          <button
            type="button"
            onClick={() => setForm({ electionId: "", name: "" })}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={status.loading}
          >
            Clear
          </button>
        )}
        <button
          type="submit"
          disabled={status.loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {status.loading
            ? position?.id
              ? "Updating..."
              : "Creating..."
            : position?.id
              ? "Update Position"
              : "Create Position"}
        </button>
      </div>
    </form>
  );
}
