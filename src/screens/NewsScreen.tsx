import { Newspaper, ChevronRight } from 'lucide-react';

const NEWS = [
  {
    title: "VARSITY BASKETBALL SECURES THRILLING OVERTIME VICTORY",
    date: "2 HOURS AGO",
    tag: "GAMEDAY RECAP",
    excerpt: "Marcus Reed drops 28 points as the Eagles storm back in the fourth quarter to take down JIS...",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "GIRLS SOCCER ADVANCES TO REGIONAL QUARTERFINALS",
    date: "1 DAY AGO",
    tag: "TEAM NEWS",
    excerpt: "A dominant 3-1 performance sets up a clash with ACS next Tuesday under the lights.",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "TRACK & FIELD SETS THREE NEW SCHOOL RECORDS AT INVITATIONAL",
    date: "3 DAYS AGO",
    tag: "ACHIEVEMENT",
    excerpt: "The weekend saw historic performances across the sprints and hurdles events from our varsity roster.",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop"
  }
];

export default function NewsScreen() {
  return (
    <div className="animate-in fade-in duration-500 pb-8 px-4 space-y-6 mt-4">
      <div className="flex items-center gap-3 mb-6 px-2">
         <div className="w-10 h-10 rounded-full bg-[#5A1C2C]/20 flex items-center justify-center">
           <Newspaper className="text-foreground/80" size={20} />
         </div>
         <h2 className="text-xl font-black text-foreground tracking-widest uppercase">EAGLES NEWS</h2>
      </div>

      <div className="space-y-6">
        {NEWS.map((post, idx) => (
          <div key={idx} className="bg-subcard rounded-2xl overflow-hidden border border-border/5 hover:border-border/20 transition-all group cursor-pointer block">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-overlay z-10 group-hover:bg-transparent transition-colors" />
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale mix-blend-luminosity opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-[#5A1C2C] text-[#ffffff]/90 text-[10px] font-bold tracking-widest uppercase rounded">
                  {post.tag}
                </span>
              </div>
            </div>
            
            <div className="p-5 relative">
              <p className="text-[10px] text-foreground/40 font-bold tracking-widest uppercase mb-2">
                {post.date}
              </p>
              <h3 className="text-lg font-black text-foreground leading-tight mb-2 uppercase tracking-wide group-hover:text-foreground/70 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-foreground/50 leading-relaxed font-medium mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex items-center text-xs font-bold text-foreground/40 group-hover:text-foreground uppercase tracking-widest transition-colors">
                READ MORE <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
