import {FOOD_TYPES,foodTypeMatches} from './food-types.js';
export function installFoodPicker({places,onPreferenceChange}){
 const q=s=>document.querySelector(s);const records=new Map(places.filter(p=>p.category==='food').map(p=>[p.id,p]));
 const options=FOOD_TYPES.map(([id,label])=>`<option value="${id}">${label}</option>`).join('');
 const label=document.createElement('label');label.htmlFor='mmFoodType';label.textContent='WHAT KIND OF FOOD?';
 const select=document.createElement('select');select.id='mmFoodType';select.innerHTML=options;select.value=clockPlan.foodStyle||'any';
 q('#mealBrandText').before(label,select);q('#mealBrandText').placeholder='Restaurant name or town';
 const browseLabel=document.createElement('label');browseLabel.htmlFor='mmBrowseFoodType';browseLabel.textContent='Food type';
 const browse=document.createElement('select');browse.id='mmBrowseFoodType';browse.innerHTML=options;
 q('#foodBrowseBrand').before(browseLabel,browse);
 const originalRows=foodListRows;foodListRows=function(query,brand,statewide){return originalRows(query,brand,statewide).filter(p=>foodTypeMatches(records.get(p.restaurant_id)||p,browse.value));};
 const updateSummary=updateMealSummary;updateMealSummary=function(){updateSummary();const matches=FOOD_DB.restaurants.filter(p=>mealMatches(p)&&foodTypeMatches(records.get(p.restaurant_id)||p,select.value));q('#mealBrandStatus').textContent=matches.length+' collected matches · browse the food database to choose a location.';};
 select.onchange=()=>{clockPlan.foodStyle=select.value;clockPlan.foodBrand='any';clockPlan.foodQuery='';q('#mealBrand').value='any';q('#mealBrandText').value='';delete clockPlan.foodPlaceId;ensureMealStage();onPreferenceChange();writeLocal(CLOCK_KEY,clockPlan);updateMealSummary();};
 const clearType=()=>{clockPlan.foodStyle='any';select.value='any';writeLocal(CLOCK_KEY,clockPlan);};
 q('#mealBrand').addEventListener('change',clearType);q('#mealBrandText').addEventListener('input',clearType);
 browse.onchange=()=>{foodLimit=20;paintFoodBrowser();};
 const button=[...q('#mealBrandText').closest('.meal-preference').querySelectorAll('button')].find(b=>b.textContent.includes('Browse'));
 if(button){button.textContent='Browse all food →';button.onclick=()=>{browse.value=select.value;q('#foodStatewide').checked=true;setView('food');paintFoodBrowser();};}
 updateMealSummary();
}
