import { useState, useEffect } from "react";
import useAdmin from "../hooks/useAdmin";
import { CheckCircle2, AlertCircle, Upload, X } from "lucide-react";

export default function CandidateForm({ candidate, onCreated }) {
  const { createCandidate, updateCandidate, get } = useAdmin();

  const [positions, setPositions] = useState([]);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    positionId: "",
    name: "",
    photo: null,
    manifesto: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  /* ----------------------------------
     Load positions
  ----------------------------------- */
  useEffect(() => {
    get("positions").then((res) => {
      if (res.positions) setPositions(res.positions);
    });
  }, []);

  useEffect(() => {
    if (!candidate) {
      resetForm();
      return;
    }

    setForm({
      positionId: candidate.positionId || "",
      name: candidate.name || "",
      photo: null, // keep null unless user uploads new
      manifesto: candidate.manifesto || "",
    });

    setPreview(candidate.photo || null);
  }, [candidate]);

  /* ----------------------------------
     Cleanup blob URLs
  ----------------------------------- */
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ----------------------------------
     Image upload handler
  ----------------------------------- */
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ----------------------------------
     Submit
  ----------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.positionId)
      return setStatus({ ...status, error: "Please select a position" });

    if (!form.name.trim())
      return setStatus({ ...status, error: "Name is required" });

    setStatus({ loading: true, error: "", success: "" });

    try {
      const formData = new FormData();
      formData.append("positionId", form.positionId);
      formData.append("name", form.name.trim());
      if (form.photo) formData.append("photo", form.photo);
      if (form.manifesto) formData.append("manifesto", form.manifesto.trim());

      const res = candidate?.id
        ? await updateCandidate(candidate.id, formData)
        : await createCandidate(formData);

      if (!res.success) throw new Error(res.message);

      setStatus({
        loading: false,
        error: "",
        success: `Candidate ${
          candidate?.id ? "updated" : "created"
        } successfully`,
      });

      onCreated(res.candidateId || candidate?.id);
      if (!candidate?.id) resetForm();
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  const resetForm = () => {
    setForm({ positionId: "", name: "", photo: null, manifesto: "" });
    setPreview(null);
  };

  /* ----------------------------------
     UI
  ----------------------------------- */
  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* IMAGE */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Candidate Photo</label>

          <div className="relative group border-2 border-dashed rounded-2xl aspect-square bg-gray-50 overflow-hidden">
            {preview ? (
              <>
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Candidate"
                  onError={(e) =>
                    (e.currentTarget.src = "/avatar-placeholder.png")
                  }
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setForm((p) => ({ ...p, photo: null }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 opacity-0 group-hover:opacity-100"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Upload size={32} />
                <span className="text-xs mt-2">Upload photo</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold">
            {candidate?.id ? "Edit Candidate" : "New Candidate"}
          </h2>

          {status.error && <StatusMsg type="error">{status.error}</StatusMsg>}
          {status.success && (
            <StatusMsg type="success">{status.success}</StatusMsg>
          )}

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            className="w-full p-3 rounded-xl bg-gray-50"
          />

          <select
            value={form.positionId}
            onChange={(e) => setForm({ ...form, positionId: e.target.value })}
            className="w-full p-3 rounded-xl bg-gray-50"
          >
            <option value="">Select position</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <textarea
            value={form.manifesto}
            onChange={(e) => setForm({ ...form, manifesto: e.target.value })}
            rows={4}
            placeholder="Manifesto"
            className="w-full p-3 rounded-xl bg-gray-50 resize-none"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 rounded-xl text-gray-500 hover:bg-gray-100"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-65 disabled:cursor-not-allowed"
            >
              {status.loading
                ? candidate?.id
                  ? "Saving..."
                  : "Creating..."
                : candidate?.id
                  ? "Save Changes"
                  : "Create Candidate"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const StatusMsg = ({ type, children }) => (
  <div
    className={`p-3 rounded-xl flex items-center text-sm font-medium ${
      type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
    }`}
  >
    {type === "error" ? (
      <AlertCircle size={18} className="mr-2" />
    ) : (
      <CheckCircle2 size={18} className="mr-2" />
    )}
    {children}
  </div>
);
