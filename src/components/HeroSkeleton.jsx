export default function HeroSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-24 bg-slate-800/40 rounded-3xl animate-pulse w-full" />
      <div className="h-24 bg-slate-800/40 rounded-3xl animate-pulse w-3/4" />
      <div className="h-10 bg-slate-800/40 rounded-xl animate-pulse w-1/3" />
    </div>
  );
}
