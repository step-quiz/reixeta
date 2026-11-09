import json, sys
from fractions import Fraction as Fr
sys.path.insert(0,'.'); sys.path.insert(0,'.')
D5=json.load(open('data5.json'))
def P(p): return p if isinstance(p,int) else sum(b<<j for j,b in enumerate(p))
def props(L): return [{'si':x['yes'],'no':x['no']} for x in L]
def load(n): return json.load(open(f'{n}.json'))
BANCS={}
def add(code,nom,tipus,props_,items,board,gen,extra=None):
    b={'code':code,'nom':nom,'tipus':tipus,'props':props_,'items':items,'fulls':{'A':board},'gen':gen}
    if extra: b.update(extra)
    BANCS[code]=b
# NUM
d=D5['num']; its=[]
for x in d['items']:
    n=int(x['v']); t=[]
    if n>=10 and n%11==0: t.append('rep')
    if n<10: t.append('one')
    its.append({'k':x['k'],'p':x['p'],'d':x['v'],'t':t})
add('NUM','Nombres','txt',props(d['props']),its,d['board'],{'maxrep':1,'cons':[{'tag':'rep','max':5},{'tag':'one','max':6}]})
# FIG
d=D5['fig']; add('FIG','Figures geomètriques','poly',props(d['props']),[{'k':x['k'],'p':x['p'],'d':x['v']} for x in d['items']],d['board'],{'maxrep':3})
# FRA (només fraccions)
import math
its=[]
for b in (2,3,4,5,6,8,10,12):
    for a in range(1,min(2*b,15)+1):
        v=Fr(a,b); per=v.denominator
        for q in (2,5):
            while per%q==0: per//=q
        p=[v>1, v<Fr(1,2), Fr(1,2)<v<1, math.gcd(a,b)>1, a==1, v.denominator==1, per!=1]
        its.append({'k':f'{a}/{b}','p':P([int(x) for x in p]),'d':[a,b],'t':['int'] if v.denominator==1 else [],'g':f'{v.numerator}/{v.denominator}'})
FRA_P=[{'si':"És l'única més gran que 1",'no':"És l'única que no és més gran que 1"},
       {'si':"És l'única més petita que 1/2",'no':"És l'única que no és més petita que 1/2"},
       {'si':"És l'única entre 1/2 i 1",'no':"És l'única que no és entre 1/2 i 1"},
       {'si':"És l'única que es pot simplificar",'no':"És l'única que no es pot simplificar"},
       {'si':"És l'única amb numerador 1",'no':"És l'única que no té numerador 1"},
       {'si':"És l'única que equival a un nombre enter",'no':"És l'única que no equival a un nombre enter"},
       {'si':"És l'única amb decimals periòdics",'no':"És l'única que no té decimals periòdics"}]
import os
FB=json.load(open('fulls_bal.json')) if os.path.exists('fulls_bal.json') else {}
add('FRA','Fraccions','fra',FRA_P,its,FB.get('FRA',[0]*50),{'maxrep':1,'gmax':2,'cons':[{'tag':'int','max':4}]})
# BLO / BLB
d=D5['blo']; its=[{'k':x['k'],'p':x['p'],'d':x['v']} for x in d['items']]
add('BLO','Blocs lògics (color)','blo',props(d['props']),its,d['board'],{'maxrep':2},{'bn':False})
pb=props(d['props'])
REN={"vermell":"ratllat","blau":"quadriculat","groc":"puntejat"}
for p in pb:
    for a,b in REN.items(): p['si']=p['si'].replace(a,b); p['no']=p['no'].replace(a,b)
    if p['si']=="És l'únic ple": p['si']="És l'únic amb el contorn gruixut"; p['no']="És l'únic amb el contorn prim"
add('BLB','Blocs lògics (blanc i negre)','blo',pb,its,d['board'],{'maxrep':2},{'bn':True})
# LLE
from letters import F
L=load('out_let9'); perm=[0,1,2,3,4,5,7,8]   # sense «d'un sol traç» (índex 6)
its=[{'k':x['k'],'p':P([x['p'][j] for j in perm]),'d':F[x['ch']]} for x in L['items']]
add('LLE','Lletres','let',[{'si':L['props'][j]['yes'],'no':L['props'][j]['no']} for j in perm],its,L['board'],{'maxrep':3})
# ANG
from angles import ang_domain
A=load('out_ang2'); base,_=ang_domain(); assert len(base)==len(A['items'])
its=[{'k':x['k'],'p':P(x['p']),'d':[x['th'],x['phi'],1 if i%2==0 else .62]} for i,x in enumerate(A['items'])]
add('ANG','Angles','ang',props(A['props']),its,A['board'],{'maxrep':3})
# triangles / quadrilàters
for code,src,nom,g in (('TR5','out_tri_g','Triangles (trama 5×5)',4),('TR4','out_tr4_5x9','Triangles (trama 4×4)',3),('QUA',sys.argv[1] if len(sys.argv)>1 else 'out_qua2','Quadrilàters',4)):
    S=load(src); its=[{'k':x['k'],'p':P(x['p']),'d':[g]+[c for pt in x['pts'] for c in pt]} for x in S['items']]
    ex={'rows':S['rows'],'cols':S['cols']} if 'rows' in S else None
    add(code,nom,'dots',props(S['props']),its,S['board'],{'maxrep':2,'w1':40,'iters':150000,'decay':0.99995,'tries':2} if code=='QUA' else ({'maxrep':3,'w1':40,'iters':120000,'decay':0.99995,'tries':2} if code=='TR4' else {'maxrep':2}),ex)
# POL
S=load('out_pol_b'); add('POL','Poliòmins','cells',props(S['props']),[{'k':x['k'],'p':P(x['p']),'d':x['cells']} for x in S['items']],S['board'],{'maxrep':4,'w1':40,'iters':200000,'decay':0.99997,'tries':1})
# COS
S=load('out_sol2'); add('COS','Cossos geomètrics','svg',props(S['props']),[{'k':x['k'],'p':P(x['p']),'d':x['svg']} for x in S['items']],S['board'],{'maxrep':5})
for c,bd in FB.items():
    if c in BANCS: BANCS[c]['fulls']['A']=bd
for c in BANCS: BANCS[c]['gen']['cap']=1
ORDER=['NUM','FIG','FRA','BLO','BLB','LLE','ANG','TR5','TR4','QUA','POL','COS']
out={c:BANCS[c] for c in ORDER}
js='/* Reixeta · WODB — bancs d\'elements, propietats i fulls fixos. Generat automàticament. */\nwindow.BANCS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\nwindow.BANCS_ORDRE='+json.dumps(ORDER)+';\n'
open('../../wodb/bancs.js','w',encoding='utf-8').write(js)
print('bytes',len(js),{c:len(BANCS[c]['items']) for c in ORDER})
