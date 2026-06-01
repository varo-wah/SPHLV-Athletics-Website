import { Trophy } from 'lucide-react';

const RECENT_RESULTS = [
  { sport: "Girls' Soccer", result: "win against JIS", score: "2-0", image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=400&auto=format&fit=crop", win: true },
  { sport: "Girls' Volleyball", result: "wins against ACG", score: "2-1", image: "https://images.unsplash.com/photo-1544061807-6ee8931bfa2b?q=80&w=400&auto=format&fit=crop", win: true },
  { sport: "Boys' Basketball", result: "lose against BSJ", score: "54-62", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400&auto=format&fit=crop", win: false },
];

export default function HomeScreen({ onNavigateToNews }: { onNavigateToNews?: () => void }) {
  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-6 mt-4">
      {/* Banner */}
      <div className="rounded-2xl overflow-hidden border border-border/5 relative bg-card">
        <img 
          src="https://res.cloudinary.com/dpgt445lg/image/upload/v1779163626/image_13_qztsyf.png" 
          alt="Eagle Athletics Banner" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-shadow via-shadow/40 to-transparent"></div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#5A1C2C] to-[#431420] p-5 rounded-2xl flex flex-col items-start gap-4 border border-[#431420]/50 relative overflow-hidden shadow-lg">
          <div className="text-left w-full">
            <h3 className="text-[13px] font-bold text-white tracking-widest uppercase text-shadow-sm drop-shadow-md">NEXT MATCH</h3>
            <p className="text-lg font-black text-white mt-2 uppercase tracking-wide">Varsity Girls Soccer vs BSJ</p>
            <p className="text-[10px] text-white/70 tracking-widest mt-2 uppercase font-medium">FRI, NOV 15 @ 7:00 PM</p>
          </div>
        </div>

        <button onClick={onNavigateToNews} className="text-left bg-subcard p-5 rounded-2xl flex flex-col items-start gap-4 border border-border/5 relative shadow-lg overflow-hidden group hover:bg-subcard-hover transition-colors">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity rounded-2xl grayscale mix-blend-luminosity"></div>
          <div className="relative z-10 w-full">
            <h3 className="text-[13px] font-bold text-white tracking-widest uppercase text-shadow-sm drop-shadow-md">TEAM NEWS</h3>
            <p className="text-[10px] text-white/70 tracking-widest mt-1.5 uppercase font-medium drop-shadow-md">UPDATED ROUND ROBIN</p>
          </div>
        </button>
      </div>
    </div>
  );
}
