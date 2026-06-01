export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 mb-6 rounded-full bg-[#5A1C2C]/20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#5A1C2C]/50 border-t-foreground animate-spin" />
      </div>
      <h3 className="text-xl font-black text-foreground mb-3 tracking-widest uppercase">{title} UPDATES COMING SOON</h3>
      <p className="text-sm text-foreground/50 leading-relaxed max-w-xs font-medium">
        We are currently preparing the schedule and roster for the upcoming season. Check back later.
      </p>
    </div>
  );
}
