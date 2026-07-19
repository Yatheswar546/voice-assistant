export default function GlowOrb() {
  return (
    <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-700 shadow-[0_0_35px_rgba(59,130,246,0.7)]">
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-200 to-blue-600 opacity-70 blur-sm" />
    </div>
  );
}