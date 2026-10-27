import fs from 'node:fs';
// Compile TypeScript first. The current source uses named imports without side effects.
fs.mkdirSync('dist/assets',{recursive:true});
for(const file of fs.readdirSync('assets'))if(/\.(png|webp|jpg)$/.test(file))fs.copyFileSync('assets/'+file,'dist/assets/'+file);
fs.copyFileSync('index.html','dist/index.html');
const files=['i18n','systems/progress','systems/game','systems/equipment','systems/audio','ui','render/scene','main'];
let js=files.map(name=>fs.readFileSync(`dist/js/${name}.js`,'utf8').replace(/^import .*;\s*$/gm,'').replace(/^export /gm,'')).join('\n');
for(const file of fs.readdirSync('assets'))if(/\.(png|webp|jpg)$/.test(file)){const mime=file.endsWith('.webp')?'image/webp':file.endsWith('.jpg')?'image/jpeg':'image/png';const uri='data:'+mime+';base64,'+fs.readFileSync('assets/'+file).toString('base64');js=js.split("'./assets/"+file+"'").join(JSON.stringify(uri));}
const html=fs.readFileSync('index.html','utf8').replace('<script type="module" src="./js/main.js"></script>',`<script>(()=>{${js}})();</script>`);
fs.writeFileSync('play.html',html);fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/index.html',html);fs.writeFileSync('docs/.nojekyll','');console.log('Built dist/, offline play.html and self-contained GitHub Pages game');
