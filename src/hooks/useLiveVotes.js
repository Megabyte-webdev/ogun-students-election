import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveVotes() {
  const [voteSummary, setVoteSummary] = useState({});
  const [isSocketLoading, setIsSocketLoading] = useState(true);

  useEffect(() => {
    // If you are on Vercel, "websocket" transport will likely fail.
    // Use ["polling", "websocket"] to allow fallback.
    const socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 3,
    });

    // Fallback: If no data in 10 seconds, stop the spinner so the user sees something
    const timeout = setTimeout(() => {
      if (isSocketLoading) setIsSocketLoading(false);
    }, 10000);

    socket.on("vote:update:init", (data) => {
      if (data?.voteSummary) {
        setVoteSummary(data.voteSummary);
        setIsSocketLoading(false);
        clearTimeout(timeout);
      }
    });

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

    return () => {
      socket.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return { voteSummary, isSocketLoading };
}
