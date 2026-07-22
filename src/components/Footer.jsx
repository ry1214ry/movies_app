export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black py-10 px-6 md:px-16 text-center md:text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <span className="text-lg font-black tracking-tighter text-white">
            FLIX<span className="text-red-600">APP</span>
          </span>
          <p className="text-xs text-zinc-600 font-semibold">
            © 2026 FlixApp Cinematic Media Networks. Developed by Roeun Dary.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          <a href="#privacy" className="hover:text-red-500 transition">
            Privacy Statements
          </a>
          <a href="#terms" className="hover:text-red-500 transition">
            Terms of Service
          </a>
          <a href="#licensing" className="hover:text-red-500 transition">
            Distribution Rights
          </a>
        </div>
      </div>
    </footer>
  );
}
