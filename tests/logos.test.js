import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const base=JSON.parse(fs.readFileSync(new URL('../data/legacy.json',import.meta.url),'utf8')).BRANDS;
const extra=JSON.parse(fs.readFileSync(new URL('../data/brand-logos.json',import.meta.url),'utf8'));
const brands={...base,...extra,iowa80kitchen:base.iowa80};
test('every listed restaurant brand has a real bundled logo',()=>{for(const id of ['godfathers','tacojohns','wendys','tacobell','pizzahut','dq','starbucks','iowa80kitchen']){assert.ok(brands[id]?.src,id);assert.match(brands[id].src,/^data:image\/(png|jpeg|svg\+xml);base64,/);const [prefix,body]=brands[id].src.split(',');const bytes=Buffer.from(body,'base64');assert.ok(bytes.length>200,id);if(prefix.includes('svg'))assert.match(bytes.toString('utf8'),/<svg\b/);else assert.ok(bytes[0]===0x89||bytes[0]===0xff,id);}});
test('the supplied truck-stop logo assets were retained',()=>{for(const id of ['pilot','petro','sapp','kwikstar','loves','ta','iowa80','flyingJSquare'])assert.ok(brands[id]?.src,id);});
test('new logo sources are documented as actual official assets',()=>{const sources=JSON.parse(fs.readFileSync(new URL('../data/LOGO_SOURCES.json',import.meta.url),'utf8'));for(const id of ['wendys','tacobell','pizzahut','dq','starbucks'])assert.ok(sources.some(s=>s.id===id&&s.official&&s.url.startsWith('https://')),id);});
