export const FOOD_TYPES=[['any','Any food'],['american','American'],['chinese','Chinese'],['sandwich','Sandwiches'],['mexican','Mexican'],['healthy','Healthy / lighter choices'],['greasy_spoon','Diner / greasy spoon'],['pizza','Pizza'],['coffee','Coffee / café']];
export function foodTypeMatches(place,type='any'){
 if(type==='any'||!type)return true;
 const types=String(place.food_style||stylesFromCuisine(place.cuisine||'',place.brand||place.name||'')).split(/[;,|]/).map(x=>x.trim());
 return types.includes(type);
}
export function stylesFromCuisine(cuisine='',brand=''){
 const s=(cuisine+';'+brand).toLowerCase();const out=[];
 if(/american|burger|barbecue|steak|wendy|dairy queen|iowa 80 kitchen/.test(s))out.push('american');
 if(/chinese|cantonese|sichuan|szechuan/.test(s))out.push('chinese');
 if(/sandwich|subway|deli|panini|bagel/.test(s))out.push('sandwich');
 if(/mexican|tex.mex|taco|burrito/.test(s))out.push('mexican');
 if(/salad|health.food|healthy|vegetarian|vegan/.test(s))out.push('healthy');
 if(/diner|pancake|greasy.spoon/.test(s))out.push('greasy_spoon');
 if(/pizza|godfather/.test(s))out.push('pizza');
 if(/coffee|cafe|café|starbucks/.test(s))out.push('coffee');
 return [...new Set(out)].join(';');
}
