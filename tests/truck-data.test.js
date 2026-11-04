import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {parseCSV,available} from '../js/core.js';
import {mergeTruckPlaces,mergeTruckLegacy,overnightEligible,listedAmenities} from '../js/truck-data.js';
const inventory=JSON.parse(fs.readFileSync(new URL('../data/truck-stops.json',import.meta.url),'utf8'));
const base=parseCSV(fs.readFileSync(new URL('../data/places.csv',import.meta.url),'utf8'));
test('all original 505 directory records survive with coordinates and stable distinct IDs',()=>{
 assert.equal(inventory.stops.length,505);assert.equal(new Set(inventory.stops.map(p=>p.id)).size,505);
 assert.equal(inventory.stops.filter(p=>p.state==='IL').length,316);assert.equal(inventory.stops.filter(p=>p.state==='IA').length,189);
 assert(inventory.stops.every(p=>Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&p.source_url.includes(p.directory_id)));
 const merged=mergeTruckPlaces(base,inventory);for(const p of inventory.stops)assert(merged.some(r=>r.id===p.id));for(const p of base)assert(merged.some(r=>r.id===p.id));
 assert.equal(mergeTruckPlaces(merged,inventory).length,merged.length);
});
test('overnight uses a positive count; zero and absent counts do not qualify',()=>{
 for(const parking_capacity of [0,'0',null,'',undefined,'unknown'])assert.equal(overnightEligible({parking_capacity}),false);
 assert(overnightEligible({parking_capacity:70}));assert(overnightEligible({parking_capacity:'1'}));
 const fuel={...inventory.stops[0],parking_capacity:0,diesel:true};const p=mergeTruckPlaces([],{stops:[fuel]})[0];assert.equal(overnightEligible(p),false);assert.equal(available(p,'truck',false),true);
});
test('only positive/listed amenities are shown; restaurant names retained',()=>{
 assert.deepEqual(listedAmenities({parking_capacity:0,shower_count:0,diesel:false,laundry:null,scale:null}),[]);
 assert.deepEqual(listedAmenities({parking_capacity:70,shower_count:6,diesel:true,food:true,restaurant_names:"Godfather's Pizza; Subway"}),['Parking: 70 spaces','Showers: 6','Diesel',"Godfather's Pizza; Subway"]);
});
test('Monroe Center is usable away from the original I-80 corridor',()=>{
 const p=inventory.stops.find(p=>p.directory_id==='57644');assert(p);assert.equal(p.highway,'I-39');assert.equal(p.parking_capacity,70);assert.equal(p.shower_count,6);assert(p.restaurant_names.includes("Godfather's"));
});
test('the inherited Stops browser receives every directory record',()=>{
 const data=JSON.parse(fs.readFileSync(new URL('../data/legacy.json',import.meta.url),'utf8'));mergeTruckLegacy(data,inventory);
 for(const s of inventory.stops)assert(data.CATALOG.places.some(p=>p.place_id===s.id&&p.directory_id===s.directory_id));
});
test('rest-area button, controls and deferred map stay in their existing locations',()=>{
 const code=fs.readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
 assert(code.includes('id="mmRest"'));assert(code.includes("$2('#mmRest').onclick=nextRest"));assert(code.includes('direction-matched state rest area'));
 assert(code.includes("['park','fuelpark'].includes(t.kind)"));assert(!code.includes('maps.googleapis.com'));assert(code.includes('mmGoogleMapsKey'));
});
