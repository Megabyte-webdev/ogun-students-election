import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveVotes() {
  const [voteSummary, setVoteSummary] = useState({});

  useEffect(() => {
    // Replace with your actual backend URL
    const socket = io("http://localhost:5000");

    // Listen for the specific init event from your logs
    socket.on("vote:update:init", (data) => {
      if (data.voteSummary) {
        setVoteSummary(data.voteSummary);
      }
    });

    // Listener for incremental updates (if backend sends individual votes)
    socket.on("vote:update", (data) => {
      setVoteSummary((prev) => ({
        ...prev,
        [data.positionId]: {
          ...(prev[data.positionId] || {}),
          [data.candidateId]:
            (prev[data.positionId]?.[data.candidateId] || 0) + 1,
        },
      }));
    });

    return () => socket.disconnect();
  }, []);

  return voteSummary;
}
