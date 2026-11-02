"""Fetch real OSM candidate POIs for review. Does not overwrite the live catalog."""
import argparse,json,urllib.request,urllib.parse
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--output',default='osm_candidates.json');args=parser.parse_args()
query='[out:json][timeout:120];(nwr["tourism"~"^(museum|attraction|hotel)$"]["name"](41.1,-96.0,42.0,-87.4););out center tags;'
request=urllib.request.Request('https://overpass-api.de/api/interpreter',data=urllib.parse.urlencode({'data':query}).encode(),headers={'Accept':'application/json','User-Agent':'MileMarkerBeta2 research'})
with urllib.request.urlopen(request,timeout=150) as response:data=json.load(response)
Path(args.output).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print(len(data.get('elements',[])),'candidate objects saved. Review state, source, duplicates and coordinates before adding to Places. OSM attribution/ODbL applies.')
