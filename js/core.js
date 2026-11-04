export const MILE=1609.344;
export function parseCSV(text){
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(Boolean))rows.push(row);row=[];field='';}else field+=c;}
 if(quoted)throw Error('Unclosed CSV quote');if(field||row.length){row.push(field);rows.push(row);}const headers=rows.shift()||[];
 return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h.replace(/^\uFEFF/,''),r[i]??''])));
}
export function haversine(a,b){const r=Math.PI/180,la=(b[1]-a[1])*r,lo=(b[0]-a[0])*r;return 6371000*2*Math.asin(Math.min(1,Math.sqrt(Math.sin(la/2)**2+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin(lo/2)**2)));}
export const point=p=>[Number(p.longitude),Number(p.latitude)];
export function normalizeRoute(raw){
 if(!raw||!raw.geometry?.coordinates?.length||!Number.isFinite(raw.distance)||!Number.isFinite(raw.duration))throw Error('Routing returned incomplete road data.');
 const coords=raw.geometry.coordinates;const steps=raw.legs.flatMap(l=>l.steps||[]);const distances=raw.legs.flatMap(l=>l.annotation?.distance||[]),durations=raw.legs.flatMap(l=>l.annotation?.duration||[]);
 let cum=[0],time=[0];for(let i=1;i<coords.length;i++){cum.push(cum[i-1]+(distances[i-1]??haversine(coords[i-1],coords[i])));time.push(time[i-1]+(durations[i-1]??0));}
 if(cum.at(-1)>0){const factor=raw.distance/cum.at(-1);cum=cum.map(x=>x*factor);}if(time.at(-1)>0){const factor=raw.duration/time.at(-1);time=time.map(x=>x*factor);}else time=cum.map(x=>raw.distance?x/raw.distance*raw.duration:0);
 const runs=[];for(const s of steps){const refs=(s.ref||'').split(';').map(x=>x.trim().replace(/^I\s+(\d+)/,'I-$1').replace(/^US\s+(\d+)/,'US-$1')).filter(x=>/^(I-|US-|IL |IA )\d+/.test(x));const ref=refs.find(x=>/^I-/.test(x))||refs.find(x=>/^US-/.test(x))||refs[0];if(!ref)continue;if(runs.at(-1)?.ref===ref)runs.at(-1).distance+=s.distance;else runs.push({ref,distance:s.distance});}const highways=runs.filter(x=>x.distance>=3*MILE).map(x=>x.ref).filter((x,i,a)=>!i||x!==a[i-1]);
 return {...raw,coords,cum,time,highways};
}
export function project(route,p){let best={offset:Infinity};const lat=p[1]*Math.PI/180,sx=Math.cos(lat)*111320,sy=111320;
 for(let i=1;i<route.coords.length;i++){const a=route.coords[i-1],b=route.coords[i],dx=(b[0]-a[0])*sx,dy=(b[1]-a[1])*sy,px=(p[0]-a[0])*sx,py=(p[1]-a[1])*sy,t=Math.max(0,Math.min(1,(px*dx+py*dy)/(dx*dx+dy*dy||1))),offset=Math.hypot(px-t*dx,py-t*dy);
 if(offset<best.offset){const angle=Math.atan2(dx,dy)*180/Math.PI;best={offset,index:i,t,meters:route.cum[i-1]+t*(route.cum[i]-route.cum[i-1]),seconds:route.time[i-1]+t*(route.time[i]-route.time[i-1]),bearing:(angle+360)%360};}}
 return best;
}
export function directionMatches(direction,bearing){if(!direction)return false;return ({EB:bearing>=45&&bearing<135,SB:bearing>=135&&bearing<225,WB:bearing>=225&&bearing<315,NB:bearing>=315||bearing<45})[direction]===true;}
export function available(p,mode,optIn){if(/closed/i.test(p.status)&&!/parking lot open/i.test(p.status))return false;if(p.category==='attraction')return mode==='roadtrip'&&optIn;if(mode==='truck'&&p.truck_access!=='yes')return false;return true;}
export function candidates(places,route,{mode='truck',optIn=false,category='all',after=0,maxOffset=5*MILE}={}){return places.filter(p=>available(p,mode,optIn)&&(category==='all'||p.category===category||(category==='fuel'&&p.category==='truck_stop'))).map(p=>({p,...project(route,point(p))})).filter(x=>x.offset<maxOffset&&x.meters>after+100&&x.meters<route.distance-100&&(x.p.category!=='rest_area'&&x.p.category!=='parking'||directionMatches(x.p.direction,x.bearing)&&route.highways.includes(x.p.highway))).sort((a,b)=>a.meters-b.meters);}
export function progressFix(route,fix,previous=0){if(!fix||fix.accuracy>100||Date.now()-fix.timestamp>30000)return {valid:false,reason:'GPS accuracy low or fix stale'};const p=project(route,[fix.longitude,fix.latitude]);if(p.offset>Math.max(150,fix.accuracy*2))return {valid:false,reason:'Off route · recalculate from current location'};if(Number.isFinite(fix.heading)&&fix.speed>3&&Math.abs(((fix.heading-p.bearing+540)%360)-180)>100)return {valid:false,reason:'Travel direction differs from planned route · recalculate'};if(p.meters+300<previous)return {valid:false,reason:'Position moved backward · check route direction'};return {valid:true,...p};}
export function navigationURL(provider,p){const [lon,lat]=point(p),q=encodeURIComponent(p.name);switch(provider){case 'waze':return `https://waze.com/ul?ll=${lat},${lon}&navigate=yes`;case 'apple':return `https://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`;case 'truckerpath':return `https://truckerpath.com/`;default:return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;}}
export function dieselLabel(p){if(!p.diesel_price||!p.diesel_timestamp||!/^https:\/\//.test(p.diesel_source||'')||!Number.isFinite(Date.parse(p.diesel_timestamp))||Number(p.diesel_price)<=0)return 'Diesel —';return `Diesel $${Number(p.diesel_price).toFixed(3)} · ${p.diesel_timestamp}`;}
export function itineraryRows(route,stops,departure){let pause=0;return stops.map((s,i)=>{const leg=route.legs[i];const drive=route.legs.slice(0,i+1).reduce((n,l)=>n+l.duration,0);const miles=route.legs.slice(0,i+1).reduce((n,l)=>n+l.distance,0)/MILE;const eta=new Date(departure+drive*1000+pause*60000);pause+=Number(s.visit_minutes)||15;return {...s,driveSeconds:drive,miles,eta,leave:new Date(eta.getTime()+(Number(s.visit_minutes)||15)*60000),legSeconds:leg.duration};});}
