import { useEffect, useState } from "react";
import useAdmin from "../hooks/useAdmin";
import CandidateCard from "./CandidateCard";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { extractErrorMessage } from "../utils/formatters";
import { axiosClient } from "../services/axios-client";

export default function PositionVoteCard({ electionId, user, onClose }) {
  const { getOpen } = useAdmin();

  const [positions, setPositions] = useState([]);
  const [votes, setVotes] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isReviewing, setIsReviewing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [failedPositions, setFailedPositions] = useState([]);

  useEffect(() => {
    async function fetchPositions() {
      setLoading(true);
      try {
        const res = await getOpen("vote/positionsWithCandidate");
        setPositions(res.positions || []);
      } catch (err) {
        setError(extractErrorMessage(err) || "Unable to load ballot.");
      } finally {
        setLoading(false);
      }
    }
    fetchPositions();
  }, [electionId]);

  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  const currentPos = positions[currentIndex];

  const handleSelect = (candId) => {
    setVotes((prev) => ({ ...prev, [currentPos.id]: candId }));
    setError("");
    setFailedPositions((prev) => prev.filter((id) => id !== currentPos.id));
  };

  const handleNext = () => {
    if (!votes[currentPos.id]) {
      setError("Please select a candidate to proceed.");
      return;
    }

    if (currentIndex < positions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsReviewing(true);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(votes).length !== positions.length) {
      setError("All positions must be voted for before submission.");
      return;
    }

    setSubmitting(true);
    setError("");

    const failed = [];

    for (const [positionId, candidateId] of Object.entries(votes)) {
      try {
        const { data } = await axiosClient.post("vote/submit-vote", {
          matricNo: user.matricNo,
          deviceId: user.deviceId,
          biometricType: user.biometricType || "none",
          biometricPayload:
            user.biometricType && user.biometricType !== "none"
              ? user.biometricPayload
              : null,
          positionId,
          candidateId,
        });

        if (!data?.success) {
          failed.push({
            positionId,
            error: data?.message || "Vote rejected",
          });
        }
      } catch (err) {
        failed.push({
          positionId,
          error: extractErrorMessage(err),
        });
      }
    }

    setFailedPositions(failed.map((f) => f.positionId));

    if (failed.length === 0) {
      setCompleted(true);
    } else {
      const msg = failed
        .map((f) => {
          const pos = positions.find((p) => p.id === f.positionId);
          return `${pos?.name}: ${f.error}`;
        })
        .join("\n");

      setError(msg);
    }

    setSubmitting(false);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-20 text-center space-y-3">
        <p className="animate-pulse font-semibold text-blue-600 tracking-wide">
          Establishing Secure Voting Session
        </p>
        <p className="text-xs text-gray-500">
          Verifying election data and ballot integrity…
        </p>
      </div>
    );
  }

  /* ================= REVIEW SCREEN ================= */
  if (isReviewing) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase">
          <span>Step 2 of 2</span>
          <span>Secure Voting Session</span>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <ShieldCheck className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-extrabold uppercase">
            Review Your Ballot
          </h2>
          <p className="text-gray-500 text-sm">
            Confirm all selections before final submission.
          </p>
        </div>

        <div className="space-y-3">
          {positions.map((pos) => {
            const selected = pos.candidates.find((c) => c.id === votes[pos.id]);
            const isFailed = failedPositions.includes(pos.id);

            return (
              <div
                key={pos.id}
                className={`p-4 rounded-xl border flex justify-between items-center
                  ${isFailed ? "bg-red-50 border-red-200" : "bg-white"}`}
              >
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    {pos.name}
                  </p>
                  <p
                    className={`font-bold ${
                      isFailed ? "text-red-700" : "text-gray-800"
                    }`}
                  >
                    {selected?.name}
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full
                    ${
                      isFailed
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {isFailed ? "Needs Attention" : "Confirmed"}
                </span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            {error.split("\n").map((e, i) => (
              <p key={i} className="text-sm text-red-700 font-semibold">
                • {e}
              </p>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
          {!completed && (
            <>
              <button
                onClick={() => setIsReviewing(false)}
                className="px-6 py-3 rounded-xl border font-semibold text-gray-600"
              >
                Edit
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="grow bg-green-600 text-white py-4 rounded-xl font-extrabold uppercase tracking-wide
                           hover:bg-green-700 disabled:bg-gray-400"
              >
                {submitting ? "Securing Your Vote…" : "Submit Secure Ballot"}
              </button>
            </>
          )}

          {completed && (
            <button
              onClick={onClose}
              className="grow bg-blue-600 text-white py-4 rounded-xl font-extrabold uppercase"
            >
              Voting Completed ✓
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ================= VOTING SCREEN ================= */
  return (
    <div className="space-y-6">
      <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase">
        <span>Step 1 of 2</span>
        <span>Secure Voting Session</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{
              width: `${((currentIndex + 1) / positions.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs font-bold text-gray-400">
          {currentIndex + 1}/{positions.length}
        </span>
      </div>

      <h2 className="text-3xl font-extrabold uppercase">{currentPos.name}</h2>
      <p className="text-gray-500 text-sm">
        Select one candidate for this position.
      </p>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-3">
        {currentPos.candidates.map((cand) => (
          <CandidateCard
            key={cand.id}
            candidate={cand}
            selected={votes[currentPos.id] === cand.id}
            onSelect={() => handleSelect(cand.id)}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="p-4 border rounded-xl"
          >
            <ArrowLeft />
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!votes[currentPos.id]}
          className="grow bg-blue-600 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold"
        >
          {currentIndex === positions.length - 1
            ? "Review Selections"
            : "Next Position"}
          <ArrowRight className="inline ml-2" />
        </button>
      </div>
    </div>
  );
}
