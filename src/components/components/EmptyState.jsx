import { Film } from "lucide-react";

export default function EmptyState({ message }) {
  return (
    <div className="text-center py-20 bg-zinc-950 border border-zinc-900 border-dashed rounded-3xl p-8 max-w-sm mx-auto space-y-3">
      <Film size={32} className="text-zinc-800 mx-auto" />
      <p className="text-xs text-zinc-500 font-bold tracking-wide leading-relaxed">
        {message}
      </p>
    </div>
  );
}
