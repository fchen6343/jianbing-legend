import fs from 'node:fs';
fs.mkdirSync('dist/assets',{recursive:true});fs.copyFileSync('assets/street.png','dist/assets/street.png');fs.copyFileSync('index.html','dist/index.html');
// The source has only named imports. Compile first, then assemble a dependency-ordered IIFE for offline play.
const files=['systems/game','systems/audio','render/scene','main'];
let js=files.map(name=>fs.readFileSync(`dist/js/${name}.js`,'utf8').replace(/^import .*;\s*$/gm,'').replace(/^export /gm,'')).join('\n');
const image='data:image/png;base64,'+fs.readFileSync('assets/street.png').toString('base64');js=js.replace("'./assets/street.png'",JSON.stringify(image));
const html=fs.readFileSync('index.html','utf8').replace('<script type="module" src="./js/main.js"></script>',`<script>(()=>{${js}})();</script>`);
fs.writeFileSync('play.html',html);console.log('Built dist/ and standalone play.html');
