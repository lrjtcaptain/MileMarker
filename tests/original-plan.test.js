import test from 'node:test';import assert from 'node:assert/strict';
import {restoreOriginalPlan} from '../js/original-plan-bridge.js';
function setup(){
 const nodes=new Map();
 class Node{constructor(){this.classes=new Set();this.classList={add:x=>this.classes.add(x),remove:x=>this.classes.delete(x),contains:x=>this.classes.has(x)};this.children=[];this.handlers={};this.disabled=false;this.hidden=false;this.value='4';}prepend(x){this.children.unshift(x);}append(x){this.children.push(x);}replaceChildren(...xs){this.children=xs;}before(x){this.beforeNode=x;}addEventListener(event,fn){this.handlers[event]=fn;}querySelectorAll(){return [nodes.get('#clockHours')];}}
 globalThis.document={querySelector:s=>{if(!nodes.has(s))nodes.set(s,new Node());return nodes.get(s);},createElement:()=>new Node()};
 let mode,called=0,refreshes=0,watch;const api={setMode:m=>mode=m,refreshMode:()=>refreshes++,findFromOriginal:async()=>{called++;},watchState:fn=>watch=fn,hasChoices:()=>true};
 document.querySelector('#mmOpt').onchange=()=>{};document.querySelector('#clockHours');const host=document.querySelector('.legacy-plan');host.classList.add('legacy-plan');
 restoreOriginalPlan(api);return {nodes,api,get mode(){return mode;},get called(){return called;},get refreshes(){return refreshes;},watch:()=>watch()};
}
test('original clocks form is revealed and replacement form hidden',()=>{const x=setup();assert.equal(x.nodes.get('.legacy-plan').classList.contains('legacy-plan'),false);assert.equal(x.nodes.get('.simple-plan').classList.contains('hidden'),true);assert.equal(x.nodes.get('#clockTitle').textContent,'How many hours you got on your clocks?');});
test('original Find button submits to routed planner without altering hours input',async()=>{const x=setup();const hours=x.nodes.get('#clockHours');hours.value='9';await x.nodes.get('#clockForm').onsubmit({preventDefault(){}});assert.equal(x.called,1);assert.equal(hours.value,'9');assert.equal(hours.disabled,false);});
test('both visible mode buttons change the engine mode',()=>{const x=setup();x.nodes.get('#mmRoadTripMode').onclick();assert.equal(x.mode,'roadtrip');x.nodes.get('#mmTruckMode').onclick();assert.equal(x.mode,'truck');assert.equal(x.refreshes,3);});
test('routed choices are mounted in original result container',()=>{const x=setup();const result=x.nodes.get('#clockResults');assert.ok(result.children.includes(x.nodes.get('#mmResultStages')));result.classList.add('hidden');x.watch();assert.equal(result.classList.contains('hidden'),false);});
test('original fields invalidate visible choices when edited',()=>{const x=setup();x.nodes.get('#clockForm').handlers.input();assert.equal(x.nodes.get('#clockResults').classList.contains('hidden'),true);assert.equal(x.nodes.get('#mmApply').hidden,true);});
