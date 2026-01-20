import React, { useState } from "react";
import VoteModal from "./VoteModal";

export default function ElectionCard({ election }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold">{election.title}</h2>
          <p className="text-gray-500 mt-1">
            {new Date(election.startTime).toLocaleString()} -{" "}
            {new Date(election.endTime).toLocaleString()}
          </p>
          <p
            className={`mt-2 font-medium ${
              election.status === "active"
                ? "text-green-600"
                : election.status === "upcoming"
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {election.status.toUpperCase()}
          </p>
        </div>
        {election.status === "active" && (
          <button
            onClick={() => setOpen(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Vote Now
          </button>
        )}
      </div>

      <VoteModal
        election={open ? election : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
