// Dev-only: server-render the real PatientSVG component to a static HTML
// gallery so we can eyeball the integrated avatar (figure + bed/crib +
// blanket + teddy + IV) without booting the app. Bundles the JSX with
// esbuild, renders with react-dom/server.
// Run: node scripts/render-avatar.mjs  -> design-notes/avatar-final-preview.html

import esbuild from "esbuild";
import { writeFile, unlink } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

var root = process.cwd();
var compPath = path.join(root, "src/components/player/PatientSVG.jsx");

var harness = ""
 + "import React from 'react';\n"
 + "import { renderToStaticMarkup } from 'react-dom/server';\n"
 + "import { PatientSVG } from " + JSON.stringify(compPath) + ";\n"
 + "export function renderAll(){\n"
 + "  var V=[\n"
 + "    {t:'Nasal cannula · child boy', p:{ageGroup:'child',status:'declining',emotion:'sad',sex:'male',seed:'Diego Marsh',visuals:['nasal cannula']}},\n"
 + "    {t:'Nasal cannula · infant girl', p:{ageGroup:'infant',status:'declining',emotion:'sad',sex:'female',seed:'Aaliyah Khan',visuals:['nasal cannula']}},\n"
 + "    {t:'Oxygen mask · child girl', p:{ageGroup:'child',status:'declining',emotion:'sad',sex:'female',seed:'Hana Ito',visuals:['oxygen mask']}},\n"
 + "    {t:'Oxygen mask · teen boy', p:{ageGroup:'teen',status:'declining',emotion:'sad',sex:'male',seed:'Marcus Bafter',visuals:['oxygen mask']}},\n"
 + "    {t:'Hives · child boy', p:{ageGroup:'child',status:'declining',emotion:'sad',sex:'male',seed:'Rio Vale',visuals:['hives']}},\n"
 + "    {t:'Hives · teen girl', p:{ageGroup:'teen',status:'declining',emotion:'sad',sex:'female',seed:'Noor Said',visuals:['hives']}},\n"
 + "    {t:'Cast left arm · child boy', p:{ageGroup:'child',status:'stable',emotion:'sad',sex:'male',seed:'Owen Pratt',visuals:['cast left arm']}},\n"
 + "    {t:'Cast right arm · toddler girl', p:{ageGroup:'toddler',status:'stable',emotion:'sad',sex:'female',seed:'Lena Fox',visuals:['cast right arm']}},\n"
 + "    {t:'Cast leg · child boy (jump, blanket off)', p:{ageGroup:'child',status:'stable',emotion:'happy',sex:'male',seed:'Cole Ray',pose:'jump',visuals:['cast leg']}},\n"
 + "    {t:'Arm sling · teen boy', p:{ageGroup:'teen',status:'stable',emotion:'sad',sex:'male',seed:'Jude Amos',visuals:['arm sling']}},\n"
 + "    {t:'Arm sling · child girl', p:{ageGroup:'child',status:'stable',emotion:'sad',sex:'female',seed:'Pia Lund',visuals:['arm sling']}},\n"
 + "    {t:'C-collar · teen boy', p:{ageGroup:'teen',status:'stable',emotion:'sad',sex:'male',seed:'Sam Vpoe',visuals:['c-collar']}},\n"
 + "    {t:'Head bandage · child boy', p:{ageGroup:'child',status:'stable',emotion:'sad',sex:'male',seed:'Kofi Mensah',visuals:['head bandage']}},\n"
 + "    {t:'Head bandage · toddler girl', p:{ageGroup:'toddler',status:'stable',emotion:'sad',sex:'female',seed:'Suri Patel',visuals:['head bandage']}},\n"
 + "    {t:'Eye patch · child girl', p:{ageGroup:'child',status:'stable',emotion:'sad',sex:'female',seed:'Edie Cruz',visuals:['eye patch']}},\n"
 + "    {t:'Wheelchair · child boy', p:{ageGroup:'child',status:'stable',emotion:'neutral',sex:'male',seed:'Theo Park',visuals:['wheelchair']}},\n"
 + "    {t:'Wheelchair · teen girl', p:{ageGroup:'teen',status:'stable',emotion:'neutral',sex:'female',seed:'Ruby Tan',visuals:['wheelchair']}},\n"
 + "    {t:'Flushed cheeks (fever) · child boy', p:{ageGroup:'child',status:'declining',emotion:'sad',sex:'male',seed:'Tomas Reed',visuals:['flushed']}},\n"
 + "    {t:'Diaphoretic (sweat) · teen boy', p:{ageGroup:'teen',status:'declining',emotion:'sad',sex:'male',seed:'Andre Bell',visuals:['diaphoretic']}},\n"
 + "    {t:'Lip swelling · child girl', p:{ageGroup:'child',status:'declining',emotion:'sad',sex:'female',seed:'Ivy Sol',visuals:['lip swelling']}},\n"
 + "    {t:'Petechiae · child boy', p:{ageGroup:'child',status:'critical',emotion:'sad',sex:'male',seed:'Beck Iyer',visuals:['petechiae']}},\n"
 + "    {t:'Wound dressing · toddler girl', p:{ageGroup:'toddler',status:'stable',emotion:'sad',sex:'female',seed:'Nia Ortiz',visuals:['wound dressing']}},\n"
 + "    {t:'Crutches · child boy', p:{ageGroup:'child',status:'stable',emotion:'neutral',sex:'male',seed:'Leo Vance',visuals:['crutches']}},\n"
 + "    {t:'Crutches · teen girl', p:{ageGroup:'teen',status:'stable',emotion:'neutral',sex:'female',seed:'Quinn Ada',visuals:['crutches']}}\n"
 + "  ];\n"
 + "  return V.map(function(v){return '<div class=\"card\"><h2>'+v.t+'</h2>'+renderToStaticMarkup(React.createElement(PatientSVG,v.p))+'</div>';}).join('');\n"
 + "}\n";

var res = await esbuild.build({
  stdin: { contents: harness, resolveDir: root, loader: "jsx", sourcefile: "harness.jsx" },
  bundle: true, format: "cjs", platform: "node", jsx: "automatic", write: false, logLevel: "silent"
});
var tmp = path.join(root, "scripts", "_avatar_render_tmp.cjs");
await writeFile(tmp, res.outputFiles[0].text);
var require = createRequire(import.meta.url);
var mod = require(tmp);
var body = mod.renderAll();
await unlink(tmp);

var html = "<!doctype html><html><head><meta charset='utf-8'><title>Avatar final preview</title>"
 + "<style>body{margin:0;background:#0a0e1a;color:#e8eefb;font-family:-apple-system,Segoe UI,Roboto,sans-serif;padding:24px}"
 + "h1{font-size:20px;font-weight:800}.grid{display:flex;flex-wrap:wrap;gap:18px}"
 + ".card{background:linear-gradient(135deg,#0d1430,#1a1a3e);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px;width:200px;box-shadow:0 6px 20px rgba(0,0,0,.35)}"
 + ".card h2{font-size:11px;font-weight:700;color:#9fb0d0;margin:0 0 8px;height:28px}.card svg{width:170px;height:220px;display:block;margin:0 auto}</style></head>"
 + "<body><h1>Avatar accessories — across ages &amp; genders (server-rendered real component)</h1><div class='grid'>" + body + "</div></body></html>";

await writeFile(path.join(root, "design-notes/avatar-accessories-preview.html"), html);
console.log("Wrote design-notes/avatar-accessories-preview.html");
console.log("Has NaN: " + /NaN/.test(body) + " | Has undefined: " + /undefined/.test(body));
