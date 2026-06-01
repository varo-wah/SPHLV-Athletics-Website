const fs = require('fs');

const files = ['src/screens/HoopsScreen.tsx', 'src/screens/SoccerScreen.tsx', 'src/screens/TrackScreen.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace various amber classes with white or maroon equivalents
  content = content.replace(/text-amber-200/g, 'text-white/80');
  content = content.replace(/text-amber-300/g, 'text-white');
  content = content.replace(/text-amber-400/g, 'text-white/60');
  
  content = content.replace(/bg-amber-300\/80/g, 'bg-white/80');
  content = content.replace(/border-amber-400/g, 'border-white/20');
  content = content.replace(/border-amber-300/g, 'border-white/20');
  content = content.replace(/border-amber-400\/50/g, 'border-white/20');
  
  content = content.replace(/hover:text-amber-300/g, 'hover:text-white');
  content = content.replace(/hover:text-amber-200/g, 'hover:text-white');
  
  content = content.replace(/hover:bg-amber-400\/10/g, 'hover:bg-white/10');
  
  content = content.replace(/var\(--amber-200,#cfbaa3\)/g, 'white');

  fs.writeFileSync(file, content);
});

console.log('Done!');
