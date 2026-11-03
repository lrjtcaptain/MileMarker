import {parseCSV} from './core.js';
try {
 const response=await fetch('./data/legacy.json');if(!response.ok)throw Error('Data failed to load');window.MM_DATA=await response.json();
 const logoResponse=await fetch('./data/brand-logos.json?v=repair4');if(!logoResponse.ok)throw Error('Restaurant logo file failed to load');Object.assign(window.MM_DATA.BRANDS,await logoResponse.json());window.MM_DATA.BRANDS.iowa80kitchen={...window.MM_DATA.BRANDS.iowa80,name:'Iowa 80 Kitchen · campus logo'};
 const read=async name=>{const r=await fetch(`data/${name}.csv`);if(!r.ok)throw Error(name+' failed to load');return parseCSV(await r.text());};
 const [rows,brands,sources]=await Promise.all(['places','original_brands','original_sources'].map(read));const byId=new Map(rows.map(p=>[p.id,p]));
 window.MM_DATA.FOOD_DB.restaurants=window.MM_DATA.FOOD_DB.restaurants.map(p=>{const r=byId.get(p.restaurant_id);return r?{...p,name:r.name,brand_id:r.brand_id,address:r.address,city:r.city,state:r.state,latitude:Number(r.latitude),longitude:Number(r.longitude),source_url:r.source_url,checked_on:r.checked_on,truck_access_status:r.truck_access==='yes'?'documented_on_site':'unknown'}:p;});
 window.MM_DATA.FOOD_DB.brands=brands;window.MM_DATA.FOOD_DB.sources=sources;
 window.MM_DATA.CATALOG.places=window.MM_DATA.CATALOG.places.map(p=>{const r=byId.get(p.place_id);return r?{...p,name:r.name,address:r.address,city:r.city,state:r.state,latitude:Number(r.latitude),longitude:Number(r.longitude)}:p;});
 for(let i=0;i<13;i++){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=`js/legacy-${String(i).padStart(2,'0')}.js`;s.onload=resolve;s.onerror=reject;document.body.append(s);});}
 await import('./app.js?v=repair4');document.body.removeAttribute('data-beta-loading');
}catch(e){document.body.removeAttribute('data-beta-loading');console.error(e);const p=document.createElement('p');p.style.cssText='padding:24px;color:white;background:#071b2e';p.textContent='MileMarker could not load. Serve this folder over HTTP or GitHub Pages, then reload. '+e.message;document.body.prepend(p);}
