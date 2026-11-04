import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {parseCSV,available} from '../js/core.js';
import {mergeIowaPlaces,mergeIowaLegacy,hasFoodCoordinates,compareFoodOffers} from '../js/iowa-food.js';
import {foodPreferenceMatches} from '../js/planner.js';
const inventory=JSON.parse(fs.readFileSync(new URL('../data/iowa-food.json',import.meta.url),'utf8'));
const base=parseCSV(fs.readFileSync(new URL('../data/places.csv',import.meta.url),'utf8'));
test('Iowa inventory reaches both routed places and inherited Food browser',()=>{
 const merged=mergeIowaPlaces(base,inventory),data=JSON.parse(fs.readFileSync(new URL('../data/legacy.json',import.meta.url),'utf8'));
 mergeIowaLegacy(data,inventory,merged);
 for(const query of ['Pizza Counter','Pizza King',"Barley's"]){assert(merged.some(p=>p.name.includes(query)));assert(data.FOOD_DB.restaurants.some(p=>p.name.includes(query)));}
 assert.equal(data.FOOD_DB.restaurants.filter(p=>p.user_favorite).length,2);
 assert.equal(new Set(merged.map(p=>p.id)).size,merged.length);
 assert.equal(mergeIowaPlaces(merged,inventory).length,merged.length);
});
test('Council Bluffs favorites remain separate locations with researched addresses',()=>{
 const pc=inventory.restaurants.filter(p=>p.brand_id==='pizzacounter');assert.equal(pc.length,2);
 assert(pc.every(p=>p.city==='Council Bluffs'&&p.user_favorite&&p.food_style==='pizza'));
 assert(pc.some(p=>p.address.includes('225 West Broadway')));assert(pc.some(p=>p.address.includes('610 Veterans Memorial')));
});
test('unknown Barleys pin cannot become a zero-coordinate route candidate',()=>{
 const p=inventory.restaurants.find(p=>p.id==='IA-LOCAL-CB-BARLEYS');assert.equal(hasFoodCoordinates(p),false);
 assert.equal(available(p,'truck',false),false);assert(p.address.includes('114 West Broadway'));
});
test('base truck access and coordinates survive the Iowa overlay',()=>{
 const overlay={restaurants:[{id:base[0].id,latitude:'0',longitude:'0',truck_access:'unknown',food_style:'pizza'}]};
 const p=mergeIowaPlaces(base,overlay)[0];assert.equal(p.truck_access,base[0].truck_access);assert.equal(p.latitude,base[0].latitude);
});
test('generic rankings respect timing bands and explicit requests',()=>{
 const offer=(brand,seconds)=>({p:{brand_id:brand},seconds});
 assert(compareFoodOffers(offer('godfathers',11000),offer('other',10800),10800,'pizza')<0);
 assert(compareFoodOffers(offer('tacojohns',11000),offer('tacobell',10800),10800,'mexican')<0);
 assert(compareFoodOffers(offer('godfathers',14400),offer('other',10800),10800,'pizza')>0);
 const pc=inventory.restaurants.find(p=>p.brand_id==='pizzacounter');assert(foodPreferenceMatches(pc,{query:'Pizza Counter'}));assert(!foodPreferenceMatches(pc,{query:'Pizza King'}));
});
