// The supplied Plan DOM remains the visible UI. Beta 2 works behind its controls.
export function restoreOriginalPlan(api){
 const q=s=>document.querySelector(s),host=q('.legacy-plan'),newPanel=q('.simple-plan');
 host.classList.remove('legacy-plan');newPanel.classList.add('hidden');
 q('#clockTitle').textContent='How many hours you got on your clocks?';
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
 api.refreshMode();
}
