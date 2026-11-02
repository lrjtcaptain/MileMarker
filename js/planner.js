export function validateStopTargets(targets,budgetHours){
 if(!Number.isFinite(budgetHours)||budgetHours<0.25||budgetHours>48)throw Error('Enter how many driving hours you have left.');
 if(!targets.length)throw Error('Add a food, diesel or parking stop.');
 if(targets.some(t=>t.hours>budgetHours))throw Error('A stop is later than your hours left. Move it earlier or increase your hours.');
 if(targets.some((t,i)=>!Number.isFinite(t.hours)||t.hours<=0||t.hours>48||!Number.isFinite(t.pause)||t.pause<0||t.pause>1440||(i>0&&t.hours<=targets[i-1].hours)))throw Error('Give each stop a later driving time than the one before it.');
 return targets;
}
export function fitsDrivingTarget(kind,seconds,targetHours,budgetHours){
 const parking=['park','fuelpark','hotel'].includes(kind);
 return Number.isFinite(seconds)&&seconds>=0&&seconds<=budgetHours*3600&&seconds<=targetHours*3600+(parking?0:1800)&&(parking||Math.abs(seconds-targetHours*3600)<=3600);
}
