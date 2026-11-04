export const FOOD_TYPES=[['any','Any food'],['american','American'],['chinese','Chinese'],['sandwich','Sandwiches'],['mexican','Mexican'],['healthy','Healthy / lighter choices'],['greasy_spoon','Diner / greasy spoon'],['pizza','Pizza'],['coffee','Coffee / café'],['italian','Italian'],['steakhouse','Steakhouses'],['seafood','Seafood'],['barbecue','Barbecue'],['thai','Thai'],['indian','Indian'],['japanese','Japanese / sushi'],['vietnamese','Vietnamese'],['korean','Korean'],['bar_and_grill','Bar & grill']];
export function foodTypeMatches(place,type='any'){
 if(type==='any'||!type)return true;
 const types=String([place.food_style,stylesFromCuisine(place.cuisine||'',place.brand||place.name||'')].filter(Boolean).join(';')).split(/[;,|]/).map(x=>x.trim());
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
 for(const [pattern,type] of [[/italian/,'italian'],[/steak/,'steakhouse'],[/seafood/,'seafood'],[/barbecue|bbq/,'barbecue'],[/thai/,'thai'],[/indian/,'indian'],[/japanese|sushi/,'japanese'],[/vietnamese/,'vietnamese'],[/korean/,'korean'],[/bar.and.grill/,'bar_and_grill']])if(pattern.test(s))out.push(type);return [...new Set(out)].join(';');
}
