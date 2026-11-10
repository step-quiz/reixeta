import json, sys, os, math
from fractions import Fraction as Fr
sys.path.insert(0,'.')
import props9
ROWS,COLS=4,5                      # board: 5 columns x 4 rows = 12 mask positions (owner decision, 2026-11-09)
FULLS='ABCD'                       # fixed sheets per bank
# Banks whose fixed sheets needed the heavy search of fulls.js: "Full nou" (a few seconds) may exceed their cap by this much.
MARGE={'POL':1,'COS':1}
D5=json.load(open('data5.json'))
def P(p): return p if isinstance(p,int) else sum(b<<j for j,b in enumerate(p))
def props(L): return [{'si':x['yes'],'no':x['no']} for x in L]
def load(n): return json.load(open(f'{n}.json'))
BANCS={}
FB=json.load(open('fulls_bal.json')) if os.path.exists('fulls_bal.json') else {}
def add(code,nom,tipus,props_,items,gen=None,extra=None):
    props_=list(props_)
    for si,no,test in props9.EXTRA.get(code,[]):      # round-9 properties: appended as new bits
        j=len(props_); props_.append({'si':si,'no':no})
        for x in items:
            if test(x['src']): x['p']|=1<<j
    for x in items: x.pop('src',None)
    nk=len({x['k'] for x in items}); g={'maxrep':max(1,math.ceil(ROWS*COLS/nk))}; g.update(gen or {})
    if code in MARGE: g['marge']=MARGE[code]
    fulls=FB.get('BLO' if code=='BLB' else code) or {'A':list(range(ROWS*COLS))}   # placeholder until fulls.js has run
    b={'code':code,'nom':nom,'tipus':tipus,'props':props_,'items':items,'rows':ROWS,'cols':COLS,'fulls':fulls,'gen':g}
    if extra: b.update(extra)
    BANCS[code]=b
# NUM
d=D5['num']; its=[]
for x in d['items']:
    n=int(x['v']); t=[]
    if n>=10 and n%11==0: t.append('rep')
    if n<10: t.append('one')
    its.append({'k':x['k'],'p':x['p'],'d':x['v'],'t':t})
add('NUM','Nombres','txt',props(d['props']),its,{'cons':[{'tag':'rep','max':2},{'tag':'one','max':3}]})
# FIG
d=D5['fig']; add('FIG','Figures geomètriques','poly',props(d['props']),[{'k':x['k'],'p':x['p'],'d':x['v'],'src':x} for x in d['items']])
# FRA (fractions only). Pool: a/b with b in DEN and 1 <= a <= min(2b, 15), plus a few perfect squares.
DEN=(2,3,4,5,6,8,9,10,12); SQ=[(9,4),(16,9),(1,16),(9,16),(4,25),(9,25),(16,25)]
its=[]
for a,b in [(a,b) for b in DEN for a in range(1,min(2*b,15)+1)]+SQ:
    v=Fr(a,b); per=v.denominator
    for q in (2,5):
        while per%q==0: per//=q
    p=[v>1, v<Fr(1,2), Fr(1,2)<v<1, math.gcd(a,b)>1, a==1, v.denominator==1, per!=1]+[f(a,b) for _,_,f in props9.FRA]
    its.append({'k':f'{a}/{b}','p':P([int(x) for x in p]),'d':[a,b],'t':['int'] if v.denominator==1 else [],'g':f'{v.numerator}/{v.denominator}'})
FRA_P=[{'si':"És l'única més gran que 1",'no':"És l'única que no és més gran que 1"},
       {'si':"És l'única més petita que 1/2",'no':"És l'única que no és més petita que 1/2"},
       {'si':"És l'única entre 1/2 i 1",'no':"És l'única que no és entre 1/2 i 1"},
       {'si':"És l'única que es pot simplificar",'no':"És l'única irreductible"},
       {'si':"És l'única amb numerador 1",'no':"És l'única que no té numerador 1"},
       {'si':"És l'única que equival a un nombre enter",'no':"És l'única que no equival a un nombre enter"},
       {'si':"És l'única amb decimals periòdics",'no':"És l'única que no té decimals periòdics"}]+[{'si':si,'no':no} for si,no,_ in props9.FRA]
add('FRA','Fraccions','fra',FRA_P,its,{'gmax':1,'cons':[{'tag':'int','max':2}]})
# BLO / BLB
d=D5['blo']; its=[{'k':x['k'],'p':x['p'],'d':x['v']} for x in d['items']]
add('BLO','Blocs lògics (color)','blo',props(d['props']),its,None,{'bn':False})
pb=props(d['props'])
REN={"vermell":"ratllat","blau":"quadriculat","groc":"puntejat"}
for p in pb:
    for a,b in REN.items(): p['si']=p['si'].replace(a,b); p['no']=p['no'].replace(a,b)
    if p['si']=="És l'únic ple": p['si']="És l'únic amb el contorn gruixut"; p['no']="És l'únic amb el contorn prim"
add('BLB','Blocs lògics (blanc i negre)','blo',pb,[dict(x) for x in its],None,{'bn':True})
# LLE
from letters import F
L=load('out_let9'); perm=[0,1,2,3,4,5,7,8]   # sense «d'un sol traç» (índex 6)
its=[{'k':x['k'],'p':P([x['p'][j] for j in perm]),'d':F[x['ch']],'src':x} for x in L['items']]
add('LLE','Lletres','let',[{'si':L['props'][j]['yes'],'no':L['props'][j]['no']} for j in perm],its)
# ANG
from angles import ang_domain
A=load('out_ang2'); base,_=ang_domain(); assert len(base)==len(A['items'])
its=[{'k':x['k'],'p':P(x['p']),'d':[x['th'],x['phi'],1 if i%2==0 else .62]} for i,x in enumerate(A['items'])]
add('ANG','Angles','ang',props(A['props']),its,None,{'caixa':31})   # drawing box of 31 mm (3 mm to the hole edge): angles are drawn at one fixed scale
# triangles / quadrilàters
for code,src,nom,g in (('TR5','out_tri_g','Triangles (trama 5×5)',4),('TR4','out_tr4_5x9','Triangles (trama 4×4)',3),('QUA',sys.argv[1] if len(sys.argv)>1 else 'out_qua_g','Quadrilàters',4)):
    S=load(src); its=[{'k':x['k'],'p':P(x['p']),'d':[g]+[c for pt in x['pts'] for c in pt],'src':x} for x in S['items']]
    add(code,nom,'dots',props(S['props']),its)
# POL
S=load('out_pol_b'); add('POL','Poliòmins','cells',props(S['props']),[{'k':x['k'],'p':P(x['p']),'d':x['cells'],'src':x} for x in S['items']])
# COS
S=load('out_sol2'); add('COS','Cossos geomètrics','svg',props(S['props']),[{'k':x['k'],'p':P(x['p']),'d':x['svg'],'src':x} for x in S['items']])
ORDER=['NUM','FIG','FRA','BLO','BLB','LLE','ANG','TR5','TR4','QUA','POL','COS']
out={c:BANCS[c] for c in ORDER}
js='/* Reixeta · WODB — bancs d\'elements, propietats i fulls fixos. Generat automàticament. */\nwindow.BANCS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\nwindow.BANCS_ORDRE='+json.dumps(ORDER)+';\n'
open('../../wodb/bancs.js','w',encoding='utf-8').write(js)
print('bytes',len(js),{c:(len(BANCS[c]['items']),len(BANCS[c]['props']),''.join(BANCS[c]['fulls'])) for c in ORDER})
