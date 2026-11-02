import test from 'node:test';import assert from 'node:assert/strict';
import {validateStopTargets,fitsDrivingTarget} from '../js/planner.js';
test('hours-left budget rejects later stops',()=>assert.throws(()=>validateStopTargets([{kind:'fuel',hours:5,pause:20}],4),/later than your hours left/));
test('four hours and parking is a valid simple plan',()=>assert.equal(validateStopTargets([{kind:'park',hours:4,pause:30}],4).length,1));
test('food then diesel and parking uses driving hours',()=>assert.equal(validateStopTargets([{kind:'food',hours:3,pause:30},{kind:'fuelpark',hours:9,pause:30}],9).length,2));
test('parking is never offered after target or driving budget',()=>{assert.equal(fitsDrivingTarget('park',4*3600+1,4,9),false);assert.equal(fitsDrivingTarget('fuelpark',5*3600,6,4),false);assert.equal(fitsDrivingTarget('park',2*3600,4,4),true);});
test('meal and diesel allow thirty minutes late only within budget',()=>{assert.equal(fitsDrivingTarget('food',3.5*3600,3,4),true);assert.equal(fitsDrivingTarget('food',3.5*3600+1,3,4),false);assert.equal(fitsDrivingTarget('fuel',4.25*3600,4,4),false);});
test('invalid and empty stop plans are explained',()=>{assert.throws(()=>validateStopTargets([],4),/Add a/);assert.throws(()=>validateStopTargets([{kind:'food',hours:NaN,pause:30}],4));assert.throws(()=>validateStopTargets([{kind:'food',hours:3,pause:30},{kind:'fuel',hours:2,pause:30}],4));});
