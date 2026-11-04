export function validateStopTargets(targets,budgetHours){
 if(!Number.isFinite(budgetHours)||budgetHours<0.25||budgetHours>48)throw Error('Enter how many driving hours you have left.');
 if(!targets.length)throw Error('Add a food, diesel or parking stop.');
 if(targets.some(t=>t.hours>budgetHours))throw Error('A stop is later than your hours left. Move it earlier or increase your hours.');
 if(targets.some(t=>!Number.isFinite(t.hours)||t.hours<=0||t.hours>48||!Number.isFinite(t.pause)||t.pause<0||t.pause>1440))throw Error('Enter a valid number of hours for each stop.');
 return targets.map(t=>({...t})).sort((a,b)=>a.hours-b.hours);
}
export function fitsDrivingTarget(kind,seconds,targetHours,budgetHours){
 const parking=['park','fuelpark','hotel'].includes(kind);
 return Number.isFinite(seconds)&&seconds>=0&&seconds<=budgetHours*3600&&seconds<=targetHours*3600+(parking?0:1800)&&(parking||Math.abs(seconds-targetHours*3600)<=3600);
}
export function foodPreferenceMatches(place,{brandId='any',query='',placeId=''}={}){
 const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
 if(placeId&&place.id!==placeId)return false;
 if(brandId&&brandId!=='any'&&place.brand_id!==brandId)return false;
 const needle=normalize(query);return !needle||normalize([place.name,place.brand,place.brand_id,place.city,place.address].join(' ')).includes(needle);
}
export function foodOfferTiming(actualSeconds,targetHours){
 const delta=Math.round((actualSeconds-targetHours*3600)/60);
 return {deltaMinutes:delta,needsTimeConfirmation:delta>5,suggestedHours:Math.ceil(actualSeconds/900)/4,label:delta===0?'At your requested time':`${Math.abs(delta)} min ${delta>0?'later':'earlier'} than requested`};
}
