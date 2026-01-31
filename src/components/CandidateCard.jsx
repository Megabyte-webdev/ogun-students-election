// CandidateCard.jsx
import { User, FileText, CheckCircle2 } from "lucide-react";

export default function CandidateCard({
  candidate,
  selected,
  onSelect,
  onViewManifesto,
}) {
  return (
    <div
      onClick={onSelect}
      className={`group relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 flex items-center gap-4 ${
        selected
          ? "border-blue-600 bg-blue-50 ring-4 ring-blue-50"
          : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-md"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-full shrink-0 flex items-center justify-center border-2 ${
          selected
            ? "bg-blue-100 border-blue-400"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        {candidate.imageUrl ? (
          <img
            src={candidate.imageUrl}
            className="w-full h-full rounded-full object-cover"
            alt=""
          />
        ) : (
          <User
            className={selected ? "text-blue-600" : "text-gray-400"}
            size={24}
          />
        )}
      </div>

      <div className="grow">
        <div className="flex justify-between items-start">
          <p
            className={`font-black text-lg leading-tight uppercase tracking-tight ${selected ? "text-blue-900" : "text-gray-800"}`}
          >
            {candidate.name}
          </p>
          {selected && (
            <CheckCircle2
              size={20}
              className="text-blue-600 animate-in zoom-in"
            />
          )}
        </div>

        {onViewManifesto && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewManifesto(candidate);
            }}
            className="mt-1 flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
          >
            <FileText size={14} /> Manifesto
          </button>
        )}
      </div>
    </div>
  );
}
