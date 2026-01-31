import CandidateGridCard from "./CandidateGridCard";

export default function CandidatesSection({
  positions,
  election,
  loading,
  noElection,
  candidatesRef,
}) {
  return (
    <section
      ref={candidatesRef}
      className="w-full max-w-7xl mx-auto py-32 px-8 scroll-mt-20"
    >
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-px bg-indigo-500" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">
            Ballot Registry
          </span>
        </div>
        <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
          Official <span className="text-indigo-500">Aspirants</span>
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-3/4 bg-slate-900/50 rounded-[2.5rem] animate-pulse"
            />
          ))}
        </div>
      ) : noElection ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
          <p className="text-slate-500 font-black uppercase tracking-widest">
            No candidates found for this session. Stay tuned! ⚡
          </p>
        </div>
      ) : (
        <div className="space-y-40">
          {positions.map((position) => (
            <div key={position.id} className="group">
              <div className="flex justify-between gap-2 items-end mb-16 border-b border-white/5 pb-8">
                <h3 className="text-2xl md:text-4xl lg:text-6xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-500 transition-colors">
                  {position.name}
                </h3>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {position.candidates.length} Registered
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {position.candidates.map((cand) => (
                  <CandidateGridCard
                    key={cand.id}
                    cand={{ ...cand, positionName: position.name }}
                    election={election?.title || ""}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
