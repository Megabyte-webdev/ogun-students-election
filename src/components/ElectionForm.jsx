import { useState, useEffect } from "react";
import useAdmin from "../hooks/useAdmin";
import { AlertCircle, CheckCircle2 } from "lucide-react";

function toDatetimeLocal(date) {
  const d = new Date(date); // parse ISO or Date
  const pad = (n) => n.toString().padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1); // month is 0-indexed
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function ElectionForm({ onCreated, election = null }) {
  const { createElection, updateElection } = useAdmin();

  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    isActive: true,
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  // Populate form if editing
  useEffect(() => {
    if (election) {
      setForm({
        title: election.title || "",
        startTime: election.startTime
          ? toDatetimeLocal(election.startTime)
          : "",
        endTime: election.endTime ? toDatetimeLocal(election.endTime) : "",
        description: election.description || "",
        isActive: election.status === "active",
      });
    }
  }, [election]);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleActive = () =>
    setForm((prev) => ({ ...prev, isActive: !prev.isActive }));

  const validate = () => {
    const { title, startTime, endTime } = form;
    if (!title.trim()) return "Election title is required";
    if (!startTime) return "Start time is required";
    if (!endTime) return "End time is required";

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate >= endDate) return "End must be after start";
    if (startDate < now) return "Start cannot be in the past";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setStatus({ loading: false, error: err, success: "" });

    setStatus({ loading: true, error: "", success: "" });

    try {
      // ⚡ Send datetime-local values as-is
      const payload = {
        ...form,
        startTime: form.startTime,
        endTime: form.endTime,
        status: form.isActive ? "active" : "upcoming",
      };

      let res;
      if (election) {
        res = await updateElection(election.id, payload);
      } else {
        res = await createElection(payload);
      }

      if (res.success) {
        setStatus({
          loading: false,
          error: "",
          success: election
            ? "Election updated successfully!"
            : "Election created successfully!",
        });
        onCreated(res.electionId || election?.id);

        if (!election) {
          setForm({
            title: "",
            startTime: "",
            endTime: "",
            description: "",
            isActive: true,
          });
        }
      } else {
        setStatus({
          loading: false,
          error: res.message || "Failed to submit election",
          success: "",
        });
      }
    } catch {
      setStatus({
        loading: false,
        error: "Error submitting election",
        success: "",
      });
    }
  };

  const minStart = new Date().toISOString().slice(0, 16);
  const defaultEnd = form.startTime
    ? new Date(new Date(form.startTime).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16)
    : "";

  const Message = ({ type, children }) => (
    <div
      className={`sticky top-0 mb-4 p-4 rounded-lg flex items-start ${
        type === "error"
          ? "bg-red-50 border border-red-200 text-red-800"
          : "bg-green-50 border border-green-200 text-green-800"
      }`}
    >
      {type === "error" ? (
        <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
      ) : (
        <CheckCircle2 className="w-5 h-5 mr-3 text-green-600" />
      )}
      <div>{children}</div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl border border-gray-200"
    >
      {status.success && <Message type="success">{status.success}</Message>}
      {status.error && <Message type="error">{status.error}</Message>}

      <div className="space-y-4">
        <label className="block font-medium">Election Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Student Union Presidential Election"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        <label className="block font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Optional description..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Start Date & Time *</label>
          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => {
              handleChange("startTime")(e);
              if (
                !form.endTime ||
                new Date(e.target.value) >= new Date(form.endTime)
              )
                setForm((prev) => ({ ...prev, endTime: defaultEnd }));
            }}
            min={minStart}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block font-medium">End Date & Time *</label>
          <input
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange("endTime")}
            min={form.startTime || minStart}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium">Active Status</p>
          <p className="text-sm text-gray-600">
            Election will be immediately active for voting
          </p>
        </div>
        <button
          type="button"
          onClick={toggleActive}
          className={`relative h-6 w-11 rounded-full transition-colors ${form.isActive ? "bg-green-600" : "bg-gray-300"}`}
        >
          <span
            className={`absolute inline-block h-4 w-4 top-0 bottom-0 my-auto bg-white rounded-full transform transition-all ${form.isActive ? "left-6" : "left-1"}`}
          />
        </button>
      </div>

      <div className="flex justify-end space-x-3">
        {!election && (
          <button
            type="button"
            onClick={() =>
              setForm({
                title: "",
                startTime: "",
                endTime: "",
                description: "",
                isActive: true,
              })
            }
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={status.loading}
          >
            Clear
          </button>
        )}
        <button
          type="submit"
          disabled={status.loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
        >
          {status.loading
            ? election
              ? "Updating..."
              : "Creating..."
            : election
              ? "Update Election"
              : "Create Election"}
        </button>
      </div>
    </form>
  );
}
