function resetToday(){
 stopGps();originGpsVersion++;originGpsPoint=null;originReady=false;clockStages=[];trip=[];
 clockPlan={start:'Chicago',direction:'west',branch:'I-80 IL',hours:4,pace:60,breakMinutes:30,needs:[{kind:'park',hours:4}],foodBrand:'any',selectionEdited:true,dayEmpty:true};
 state.search='';state.amenities.clear();state.listedOnly=false;state.showExcluded=false;state.type='all';state.direction='both';state.sort='route';state.from='Chicago';state.to='Council Bluffs';state.via='both';state.selected=null;state.limit=25;$('#search').value='';$('#from').value='Chicago';$('#to').value='Council Bluffs';$('#via').value='both';$('#typeFilter').value='all';$('#direction').value='both';$('#sort').value='route';$('#listedOnly').checked=false;$('#showExcluded').checked=false;
 journey={from:'Chicago',to:'Council Bluffs',via:'I-80 IL',origin:'',destination:''};
 writeLocal(CLOCK_KEY,clockPlan);writeLocal('milemarker.journey.v1',journey);persist();
 for(const k of ['origin','destination']){searchSerial[k]++;placeMatches[k]=[];$('#'+k+'Search').value='';$('#'+k+'Matches').innerHTML=''}
 $('#originStatus').textContent='Start a new day: use current location or search a starting town.';$('#originStatus').classList.remove('origin-warning');$('#destinationStatus').textContent='Search and choose today’s destination.';$('#destinationStatus').classList.remove('origin-warning');
 $('#mealBrand').value='any';$('#branchChoice').value='I-80 IL';$('#clockResults').innerHTML='';$('#clockResults').classList.add('hidden');$('#savedDayStatus').classList.add('hidden');$('#savedDayStatus').textContent='';paintClock();render();paintDrive();setView('trip');notify('New day ready. Garage, favorites and stop notes kept.');
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b?.hasAttribute('data-reset-day'))return;if(confirm('Reset today’s route, timing targets and planned stops? Your Garage, favorite stops and stop notes will be kept.'))resetToday()});
const daySyncJourney=syncJourney;syncJourney=function(){daySyncJourney();if(clockPlan.dayEmpty&&!clockPlan.destinationCity){$('#planDestination').textContent='Choose destination';$('#driveDestination').textContent='Not set';}if(clockPlan.dayEmpty&&!originReady){$('#planOrigin').textContent='Use current location';$('#driveOrigin').textContent='Not set';}if(clockPlan.dayEmpty){$('#journeyTitle').textContent='Plan today’s run';$('#journeySub').textContent='Set your starting point, destination, and stops.'}};
const newDaySubmit=$('#clockForm').onsubmit;$('#clockForm').onsubmit=e=>{if(originReady&&clockPlan.destinationCity)clockPlan.dayEmpty=false;newDaySubmit(e)};
syncJourney();
