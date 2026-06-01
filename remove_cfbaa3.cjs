const fs = require('fs');

const files = [
  'src/screens/HoopsScreen.tsx',
  'src/screens/SoccerScreen.tsx',
  'src/screens/TrackScreen.tsx',
  'src/components/Sidebar.tsx',
  'src/components/GenderSelectionModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-\[#cfbaa3\]/g, 'text-white/60');
  content = content.replace(/border-\[#cfbaa3\]/g, 'border-white/40');
  fs.writeFileSync(file, content);
});

console.log('Done cfbaa3!');
