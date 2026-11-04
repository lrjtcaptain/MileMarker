// The supplied Plan DOM remains the visible UI. Beta 2 works behind its controls.
export function restoreOriginalPlan(api){
 const q=s=>document.querySelector(s),host=q('.legacy-plan'),newPanel=q('.simple-plan');
 host.classList.remove('legacy-plan');newPanel.classList.add('hidden');
 q('#clockTitle').textContent='How many hours you got on your clocks?';
 const hours=q('#clockHours'),budget=hours.closest('.clock-budget');
 hours.disabled=false;hours.readOnly=false;hours.setAttribute('inputmode','decimal');hours.setAttribute('aria-label','Driving hours left');
 const title=q('#clockTitle');title.after(budget);
 const decrease=document.createElement('button'),increase=document.createElement('button');
 decrease.type=increase.type='button';decrease.textContent='−';increase.textContent='+';
 decrease.setAttribute('aria-label','Decrease driving hours');increase.setAttribute('aria-label','Increase driving hours');
 decrease.className=increase.className='clock-step';
 const adjust=delta=>{const value=Number(hours.value);hours.value=String(Math.min(Number(hours.max)||24,Math.max(Number(hours.min)||0.25,(Number.isFinite(value)?value:4)+delta)));hours.dispatchEvent(new Event('input',{bubbles:true}));hours.dispatchEvent(new Event('change',{bubbles:true}));};
 decrease.onclick=()=>adjust(-0.25);increase.onclick=()=>adjust(0.25);
 hours.before(decrease);hours.after(increase);
 const help=budget.querySelector('p');if(help)help.textContent='Tap the number to type your hours, or use − / +.';
 const modes=document.createElement('div');modes.className='mm2';modes.append(q('.mode-switch'));host.prepend(modes);
 const result=q('#clockResults');result.classList.add('mm2');
 result.replaceChildren(q('#mmChoicesHeading'),q('#mmResultStages'),q('#mmApply'),q('#mmItinerary'));
 result.before(q('#mmStatus'));
 const highways=document.createElement('details');highways.className='mm2';highways.innerHTML='<summary>Route & highways</summary>';highways.append(q('#mmPlanRoute'));result.before(highways);
 const opt=q('#mmOptLabel');q('#clockForm').append(opt);opt.classList.add('mm2');
 const modeChange=()=>{api.refreshMode();};
 q('#mmTruckMode').onclick=()=>{api.setMode('truck');modeChange();};
 q('#mmRoadTripMode').onclick=()=>{api.setMode('roadtrip');modeChange();};
 const optChange=q('#mmOpt').onchange;q('#mmOpt').onchange=()=>{optChange();api.refreshMode();};
 q('#clockForm').onsubmit=async e=>{e.preventDefault();const states=[...q('#clockForm').querySelectorAll('button,input,select')].map(el=>[el,el.disabled]);states.forEach(([el])=>el.disabled=true);try{await api.findFromOriginal();}finally{states.forEach(([el,disabled])=>el.disabled=disabled);}};
 api.watchState(()=>{if(api.hasChoices())result.classList.remove('hidden');});
 q('#mmApply').addEventListener('click',()=>{result.classList.remove('hidden');});
 q('#clockForm').addEventListener('input',()=>{result.classList.add('hidden');q('#mmApply').hidden=true;});
 q('#clockForm').addEventListener('change',()=>{result.classList.add('hidden');q('#mmApply').hidden=true;});
 const invalidateHours=()=>{result.classList.add('hidden');q('#mmApply').hidden=true;};
 hours.addEventListener('input',invalidateHours);hours.addEventListener('change',invalidateHours);
 api.refreshMode();
}
