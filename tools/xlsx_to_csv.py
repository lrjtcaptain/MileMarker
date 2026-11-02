"""Export the master workbook data sheets using Python 3 standard library only."""
import csv,sys,zipfile,xml.etree.ElementTree as E
from pathlib import Path
NS={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
mapping={'Places':'places','Anchors':'anchors','Achievements':'achievements','Settings':'settings','Food sources':'original_sources','Food brands':'original_brands'}
def extract(path,out):
 with zipfile.ZipFile(path) as z:
  strings=[]
  if 'xl/sharedStrings.xml' in z.namelist():
   strings=[''.join(t.itertext()) for t in E.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',NS)]
  rels={r.attrib['Id']:r.attrib['Target'] for r in E.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
  for sheet in E.fromstring(z.read('xl/workbook.xml')).findall('m:sheets/m:sheet',NS):
   name=sheet.attrib['name']
   if name not in mapping:continue
   target=rels[sheet.attrib[R]];target=target.lstrip('/') if target.startswith('/') else 'xl/'+target
   rows=[]
   for row in E.fromstring(z.read(target)).findall('m:sheetData/m:row',NS):
    values={}
    for c in row.findall('m:c',NS):
     if c.find('m:f',NS) is not None:raise ValueError('Data tabs must contain values, not formulas: '+name+' '+c.attrib['r'])
     idx=0
     for char in ''.join(filter(str.isalpha,c.attrib['r'])):idx=idx*26+ord(char.upper())-64
     v=c.find('m:v',NS);val=v.text if v is not None and v.text else ''
     if c.attrib.get('t')=='s':val=strings[int(val)]
     elif c.attrib.get('t')=='inlineStr':val=''.join(c.find('m:is',NS).itertext())
     values[idx-1]=val
    if values:rows.append([values.get(i,'') for i in range(max(values)+1)])
   if not rows:raise ValueError('Empty data sheet: '+name)
   width=len(rows[0]);rows=[r[:width]+['']*max(0,width-len(r)) for r in rows]
   out.mkdir(parents=True,exist_ok=True)
   with (out/(mapping[name]+'.csv')).open('w',newline='',encoding='utf-8') as f:csv.writer(f).writerows(rows)
   print(name,len(rows)-1,'rows exported')
if __name__=='__main__':
 project=Path(__file__).resolve().parents[1];extract(Path(sys.argv[1]) if len(sys.argv)>1 else project/'MileMarker_Data.xlsx',Path(sys.argv[2]) if len(sys.argv)>2 else project/'data')
