'use client';

export default function LogoPremium() {
  return (
    <div className="relative group cursor-pointer">
      <div className="flex items-center gap-2">
        {/* Icon/Symbol */}
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span className="text-white font-black text-xl">B</span>
          </div>
        </div>
        
        {/* Text */}
        <div className="flex flex-col">
          <span className="text-lg font-bold text-neutral-900 tracking-tight leading-none">
            BYZCLUB
          </span>
          <span className="text-[10px] text-neutral-500 tracking-wider uppercase leading-none">
            Neuchâtel
          </span>
        </div>
      </div>
    </div>
  );
}
