export function hasFoodCoordinates(p){return p.latitude!==''&&p.longitude!==''&&p.latitude!=null&&p.longitude!=null&&Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude));}
export function mergeIowaPlaces(base,inventory){
 const result=new Map(base.map(p=>[p.id,{...p}]));
 for(const p of inventory.restaurants){const prior=result.get(p.id);result.set(p.id,prior?{...p,...prior,food_style:prior.food_style||p.food_style,cuisine:prior.cuisine||p.cuisine,priority_rank:p.priority_rank,user_favorite:p.user_favorite,phone:prior.phone||p.phone}:{...p});}
 return [...result.values()];
}
export function mergeIowaLegacy(data,inventory,places){
 const byId=new Map(places.map(p=>[p.id,p])),old=new Map(data.FOOD_DB.restaurants.map(r=>[r.restaurant_id,r]));
 const brands=new Map(data.FOOD_DB.brands.map(b=>[b.brand_id,b]));
 for(const imported of inventory.restaurants){const p=byId.get(imported.id),prior=old.get(p.id);
  if(prior){Object.assign(prior,{food_style:p.food_style,cuisine:p.cuisine,priority_rank:p.priority_rank,user_favorite:p.user_favorite,has_coordinates:hasFoodCoordinates(p)});continue;}
  brands.set(p.brand_id,{brand_id:p.brand_id,name:p.brand||p.name});
  old.set(p.id,{restaurant_id:p.id,name:p.name,brand_id:p.brand_id,brand:p.brand||p.name,address:p.address,city:p.city||'City not mapped',state:p.state,latitude:hasFoodCoordinates(p)?Number(p.latitude):null,longitude:hasFoodCoordinates(p)?Number(p.longitude):null,phone:p.phone||'',hours:[],source_id:'iowa_inventory',source_url:p.source_url,source_record_id:imported.id,location_status:p.status,checked_on:p.checked_on,coordinate_status:p.coordinate_status,corridor_distance_miles:null,corridor_branch:'Iowa statewide',corridor_progress_miles:null,in_beta_corridor:false,truck_access_status:'unknown',live_open_status:'not_checked',verified_stop_id:p.host_stop_id||'',food_style:p.food_style,cuisine:p.cuisine,priority_rank:p.priority_rank,user_favorite:p.user_favorite,has_coordinates:hasFoodCoordinates(p)});
 }
 // Older records also need this flag for the statewide browser's meal button.
 for(const r of old.values())if(r.has_coordinates===undefined)r.has_coordinates=hasFoodCoordinates(r);
 data.FOOD_DB.restaurants=[...old.values()];data.FOOD_DB.brands=[...brands.values()];
 data.FOOD_DB.sources.push({source_id:'iowa_inventory',publisher:'OSM contributors / official restaurant websites',url:'https://www.openstreetmap.org/copyright',access_method:'offline_extract_and_official_listing',checked_on:'2026-11-03'});
}
export function compareFoodOffers(a,b,targetSeconds,type='any'){
 const da=Math.abs(a.seconds-targetSeconds),db=Math.abs(b.seconds-targetSeconds);
 const band=Math.floor(da/900)-Math.floor(db/900);if(band)return band;
 const rank=p=>type==='pizza'&&p.brand_id==='godfathers'?100:type==='mexican'&&p.brand_id==='tacojohns'?90:0;
 return rank(b.p)-rank(a.p)||da-db;
}
