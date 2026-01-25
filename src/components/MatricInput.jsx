import { useState, useEffect } from "react";

export default function MatricInput({ value, onChange }) {
  const [prev, setPrev] = useState(value || "");
  const [error, setError] = useState("");

  const formatMatric = (raw) => {
    const clean = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    let formatted = "";
    for (let i = 0; i < clean.length; i++) {
      formatted += clean[i];
      if (i === 2 || i === 4 || i === 6) formatted += "/";
    }

    return formatted.slice(0, 14);
  };

  const validateMatric = (formatted) => {
    setError("");

    // Quick regex check
    const MATRIC_REGEX = /^[A-Z]{3}\/\d{2}\/\d{2}\/\d{4}$/;
    if (formatted.length === 14 && !MATRIC_REGEX.test(formatted)) {
      setError("Invalid format (e.g., EES/24/25/0000)");
      return false;
    }

    // Live year validation: check if graduation year is in the past
    const parts = formatted.split("/");
    if (parts.length === 4) {
      const entryYear = parseInt(parts[1], 10);
      const gradYear = parseInt(parts[2], 10);
      const currentYear = new Date().getFullYear() % 100; // last two digits

      if (gradYear > currentYear) {
        setError("Graduation year is in the future. Please check.");
        return false;
      }

      if (gradYear < currentYear - 5) {
        // Assuming max 5-year course
        setError("You may have already graduated.");
        return false;
      }
    }

    return true;
  };

  const handleChange = (e) => {
    let val = e.target.value;

    // Handle backspace over a slash
    if (prev.length > val.length) {
      if (prev[val.length] === "/") {
        val = val.slice(0, -1);
      }
    }

    const formatted = formatMatric(val);
    setPrev(formatted);
    onChange(formatted);

    // Live validation
    if (formatted.length === 14) {
      validateMatric(formatted);
    } else {
      setError(""); // reset error if incomplete
    }
  };

  return (
    <div className="space-y-1">
      <input
        type="text"
        placeholder="EES/21/22/0000"
        value={value}
        onChange={handleChange}
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-lg font-bold tracking-widest focus:border-indigo-600 focus:bg-white transition-all outline-none placeholder:opacity-30 text-center"
      />
      {error && (
        <p className="text-red-500 text-[11px] font-bold italic text-center">
          {error}
        </p>
      )}
    </div>
  );
}
