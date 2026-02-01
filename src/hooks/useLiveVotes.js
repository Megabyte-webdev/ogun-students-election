import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveVotes() {
  const [voteSummary, setVoteSummary] = useState({});
  const [isSocketLoading, setIsSocketLoading] = useState(true);

  useEffect(() => {
    console.log("Attempting to connect to:", import.meta.env.VITE_BASE_URL);

    const socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected! ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });

    // Listen for the initial data
    socket.on("vote:update:init", (data) => {
      console.log("📦 Received Initial Data:", data);
      if (data && data.voteSummary) {
        setVoteSummary(data.voteSummary);
        setIsSocketLoading(false);
      } else {
        console.warn("⚠️ Data received but voteSummary is missing:", data);
      }
    });

    socket.on("vote:update", (data) => {
      console.log("⚡ New Vote Received:", data);
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
    };
  }, []);

  return { voteSummary, isSocketLoading };
}
