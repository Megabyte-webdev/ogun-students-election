export default function CandidateCard({ candidate, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg p-4 cursor-pointer hover:border-blue-600 ${
        selected ? "border-blue-600 bg-blue-50" : "border-gray-200"
      }`}
    >
      <p className="font-semibold">{candidate.name}</p>
      {candidate.manifesto && (
        <p className="text-sm text-gray-500">{candidate.manifesto}</p>
      )}
    </div>
  );
}
