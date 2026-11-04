import {normalizeRoute} from './core.js?v=20261103-final';
export class Router{
 constructor(base='https://router.project-osrm.org/route/v1/driving'){this.base=base;this.cache=new Map();this.queue=Promise.resolve();this.last=0;}
 async route(points){if(points.length<2||points.some(p=>p.length!==2||!p.every(Number.isFinite)||p[0]<-180||p[0]>180||p[1]<-90||p[1]>90))throw Error('Choose valid route coordinates.');
 const key=points.map(p=>p.map(n=>n.toFixed(6)).join(',')).join(';');if(this.cache.has(key))return this.cache.get(key);
 const task=this.queue.then(async()=>{if(this.cache.has(key))return this.cache.get(key);await new Promise(r=>setTimeout(r,Math.max(0,1100-(Date.now()-this.last))));this.last=Date.now();
 const u=`${this.base}/${key}?overview=full&geometries=geojson&steps=true&annotations=distance,duration&continue_straight=true`;const response=await fetch(u,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error('Road routing unavailable ('+response.status+'). Retry when connected.');const data=await response.json();if(data.code!=='Ok'||!data.routes?.[0])throw Error('No road route found for those points.');const r=normalizeRoute(data.routes[0]);r.fetched_at=new Date().toISOString();this.cache.set(key,r);return r;});this.queue=task.catch(()=>{});return task;
 }
}
