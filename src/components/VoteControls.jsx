import { useMemo } from "react";

export default function VoteControls({
  votes,
  voteFilters,
  setVoteFilters,
  onExport,
}) {
  // Get unique positions and candidates for filters
  const positions = useMemo(
    () => [...new Set(votes.map((v) => v.position))],
    [votes],
  );
  const candidates = useMemo(
    () =>
      voteFilters.position
        ? [
            ...new Set(
              votes
                .filter((v) => v.position === voteFilters.position)
                .map((v) => v.candidate),
            ),
          ]
        : [...new Set(votes.map((v) => v.candidate))],
    [votes, voteFilters.position],
  );

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <select
        value={voteFilters.position}
        onChange={(e) =>
          setVoteFilters((prev) => ({ ...prev, position: e.target.value }))
        }
        className="px-3 py-1 border rounded-md"
      >
        <option value="">All Positions</option>
        {positions.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <select
        value={voteFilters.candidate}
        onChange={(e) =>
          setVoteFilters((prev) => ({ ...prev, candidate: e.target.value }))
        }
        className="px-3 py-1 border rounded-md"
      >
        <option value="">All Candidates</option>
        {candidates.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        onClick={onExport}
        className="px-4 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Export CSV
      </button>
    </div>
  );
}
