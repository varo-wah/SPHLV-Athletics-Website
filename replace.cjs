const fs = require('fs');
const files = ['src/screens/SoccerScreen.tsx', 'src/screens/HoopsScreen.tsx', 'src/screens/TrackScreen.tsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/pink-300/g, 'amber-300');
  content = content.replace(/pink-200/g, 'amber-200');
  content = content.replace(/pink-400/g, 'amber-400');
  content = content.replace(/#ffb6c1/g, 'var(--amber-200, #fde68a)');
  fs.writeFileSync(file, content);
});
console.log('Done!');
