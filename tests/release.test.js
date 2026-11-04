import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
import {mergeTruckPlaces,mergeTruckLegacy,listedAmenities,overnightEligible} from '../js/truck-data.js';
import {mergeIowaPlaces,mergeIowaLegacy} from '../js/iowa-food.js';
import {parseCSV} from '../js/core.js';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),json=p=>JSON.parse(read(p));
const stops=json('data/truck-stops.json'),food=json('data/iowa-food.json'),base=parseCSV(read('data/places.csv'));
test('release contains rebuilt amenities rather than the missing-file placeholder',()=>{
 assert(stops.latest_amenities_loaded);assert.equal(stops.processed_pages,498);assert.equal(stops.parking_counts,464);
 assert.equal(stops.stops.filter(p=>p.parking_capacity===0).length,78);
 assert.equal(stops.stops.filter(p=>p.parking_capacity==null).length,41);
 assert(!read('README.md').includes('latest amenities file is supplied'));
});
test('nearby services do not become on-site amenities',()=>{
 const p=stops.stops.find(p=>p.directory_id==='10649');assert(p.nearby_services_raw.includes('MECHANIC'));assert.notEqual(p.repair,true);assert.notEqual(p.laundry,true);
 const zero=stops.stops.find(p=>p.directory_id==='10063');assert.equal(zero.parking_capacity,0);assert(!overnightEligible(zero));assert(!listedAmenities(zero).some(s=>/^Parking|Showers/.test(s)));
});
test('source-named Monroe Center food is available to the food route planner',()=>{
 const host=stops.stops.find(p=>p.directory_id==='57644');
 const entries=food.restaurants.filter(p=>p.host_stop_id===host.id);assert(entries.some(p=>p.brand_id==='godfathers'));assert(entries.some(p=>p.brand_id==='subway'));
 const places=mergeTruckPlaces(mergeIowaPlaces(base,food),stops);const legacy=json('data/legacy.json');mergeTruckLegacy(legacy,stops);mergeIowaLegacy(legacy,food,places);
 const record=legacy.FOOD_DB.restaurants.find(p=>p.restaurant_id===entries.find(p=>p.brand_id==='godfathers').id);assert.equal(record.verified_stop_id,host.id);
 const pizza=places.find(p=>p.id===record.restaurant_id);assert.equal(pizza.category,'food');assert.equal(pizza.food_style,'pizza');assert.equal(pizza.truck_access,'yes');
});
test('classic app scripts compile together and keep both data loaders',()=>{
 new vm.Script(Array.from({length:13},(_,i)=>read('js/legacy-'+String(i).padStart(2,'0')+'.js')).join('\n'));
 const boot=read('js/bootstrap.js');assert(boot.includes('mergeTruckLegacy(window.MM_DATA,truckInventory)'));assert(boot.includes('mergeIowaLegacy(window.MM_DATA,inventory,rows)'));
});
test('upload root contains every local HTML asset and relative module import',()=>{
 const index=read('index.html');for(const m of index.matchAll(/(?:src|href)="((?:css|js)\/[^"?]+)(?:\?[^\"]*)?"/g))assert(fs.existsSync(new URL(m[1],root)),m[1]);
 for(const file of fs.readdirSync(new URL('js/',root)).filter(p=>p.endsWith('.js'))){for(const m of read('js/'+file).matchAll(/(?:from\s*|import\()['"]\.\/([^'"?]+)(?:\?[^'"]*)?['"]/g))assert(fs.existsSync(new URL('js/'+m[1],root)),file+' -> '+m[1]);}
 for(const p of ['legacy.json','brand-logos.json','places.csv','original_brands.csv','original_sources.csv','truck-stops.json','iowa-food.json','anchors.csv','achievements.csv','settings.csv'])assert(fs.existsSync(new URL('data/'+p,root)));
});
