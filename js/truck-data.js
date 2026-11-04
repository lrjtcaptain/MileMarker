export function overnightEligible(p){
 const count=p.parking_capacity;
 if(count!==''&&count!=null&&Number.isFinite(Number(count)))return Number(count)>0;
 return false;
}
export function listedAmenities(p){
 const out=[];
 if(Number(p.parking_capacity)>0)out.push(`Parking: ${p.parking_capacity} spaces`);
 if(Number(p.shower_count)>0)out.push(`Showers: ${p.shower_count}`);
 else if(p.showers===true&&p.shower_count!==0&&p.shower_count!=='0')out.push('Showers');
 for(const [field,label]of [['diesel','Diesel'],['bulk_def','DEF'],['laundry','Laundry'],['truck_wash','Truck wash'],['repair','Repairs'],['food','Food']])if(p[field]===true)out.push(field==='food'&&p.restaurant_names?p.restaurant_names:label);
 if(p.scale&&p.scale!=='No'&&p.scale!=='0')out.push(p.scale==='CAT'?'CAT Scale':'Scale');
 const extra=String(p.amenities_raw||'').split(',').map(s=>s.trim()).filter(Boolean);
 for(const label of extra){
  const t=label.toLowerCase();
  if(/^(?:no|not|0)\b/.test(t))continue;
  if(/^parking$|truck parking|reserved parking|paid parking/.test(t)&&p.parking_capacity!=null&&Number(p.parking_capacity)<=0)continue;
  if(t==='parking'&&Number(p.parking_capacity)>0)continue;
  if(/showers?/.test(t)&&!(Number(p.shower_count)>0))continue;
  if(/diesel|bulk\s*def|(?:cat|certified).*scales?|scales?.*(?:cat|certified)|^laundry$|truck wash|truck repairs?|^restaurant$|^food$/.test(t))continue;
  if(p.restaurant_names&&p.restaurant_names.toLowerCase().includes(t))continue;
  if(!out.some(s=>s.toLowerCase()===t))out.push(label);
 }
 return out;
}
export function mergeTruckPlaces(base,inventory){
 const result=new Map(base.map(p=>[p.id,{...p}]));
 for(const s of inventory.stops){
  const p=result.get(s.id)||{};
  result.set(s.id,{...p,...s,category:'truck_stop',visit_minutes:p.visit_minutes||30,truck_access:'yes',status:p.status||'directory_listed',source_url:s.amenities_source_url||s.source_url,notes:[p.notes,`Directory listing ${s.directory_id}. Coordinates refer to the business, not a surveyed truck entrance.`].filter(Boolean).join(' ')});
 }
 return [...result.values()];
}
export function mergeTruckLegacy(data,inventory){
 const places=new Map(data.CATALOG.places.map(p=>[p.place_id,p]));
 const model=Object.fromEntries(Object.keys(data.CATALOG.places[0]).map(k=>[k,null]));
 for(const s of inventory.stops){
  const old=places.get(s.id)||{};const sourceId='directory_'+s.directory_id;
  const p={...model,...old,...s,place_id:s.id,place_type:'truck_stop',record_status:'directory_listed',country:'US',branch:s.highway,exit_or_milepost:s.exit,travel_direction:'not_direction_restricted_in_source',identity_source_id:sourceId,truck_access_verified:false,truck_parking:Number(s.parking_capacity)>0,showers:Number(s.shower_count)>0,notes:old.notes||'Directory-reported location. Check the entrance before arrival.',parking_public_reported:old.parking_public_reported??null};
  places.set(s.id,p);
  data.CATALOG.sources.push({source_id:sourceId,publisher:'Truck Stops and Services / retained operator record',url:s.amenities_source_url||s.source_url,access_method:'directory_reported',locator:s.amenities_status||'Directory listing'});
 }
 data.CATALOG.places=[...places.values()];
}
