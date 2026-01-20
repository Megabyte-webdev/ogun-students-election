import React, { useState, useEffect } from "react";
import useAdmin from "../hooks/useAdmin.js";
import ElectionCard from "../components/ElectionCard";

export default function VotingDashboard() {
  const { get } = useAdmin();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElections() {
      setLoading(true);
      try {
        const res = await get("elections");
        setElections(res.elections || []);
      } catch (err) {
        console.error("Failed to fetch elections", err);
      } finally {
        setLoading(false);
      }
    }
    fetchElections();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Available Elections</h1>
      {elections.length === 0 ? (
        <p>No elections available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => (
            <ElectionCard key={election.id} election={election} />
          ))}
        </div>
      )}
    </div>
  );
}
