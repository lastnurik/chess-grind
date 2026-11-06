import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
for(const directory of ['src','tests','scripts']) {
  for(const file of await readdir(path.join(root,directory))) {
    if(!file.endsWith('.mjs')) continue;
    const check=spawnSync(process.execPath,['--check',path.join(root,directory,file)],{encoding:'utf8'});
    if(check.status!==0) {process.stderr.write(check.stderr);process.exit(1);}
  }
}
const db=JSON.parse(await readFile(path.join(root,'src/openings.json'),'utf8'));
if(!Array.isArray(db)||db.length<3000) throw Error('Opening database is incomplete');
console.log(`Syntax checks passed. ${db.length} opening entries available.`);
