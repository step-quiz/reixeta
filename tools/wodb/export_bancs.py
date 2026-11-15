import json, sys, os, math
from fractions import Fraction as Fr
sys.path.insert(0,'.')
import props9
ROWS,COLS=4,5                      # board: 5 columns x 4 rows = 12 mask positions (owner decision, 2026-11-09)
FULLS='ABCD'                       # fixed sheets per bank
# Banks whose fixed sheets needed the heavy search of fulls.js: "Full nou" (a few seconds) may exceed their cap by this much.
MARGE={}
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
# Round 15 (2026-11-14): "més gran que 50" removed; "triangular" and "suma de les xifres parella" added.
def isprime(n): return n>1 and all(n%q for q in range(2,int(n**.5)+1))
def issq(n): return int(round(n**.5))**2==n
NUM_P=[("És l'únic parell","És l'únic senar",lambda n:n%2==0),
       ("És l'únic múltiple de 3","És l'únic que no és múltiple de 3",lambda n:n%3==0),
       ("És l'únic múltiple de 5","És l'únic que no és múltiple de 5",lambda n:n%5==0),
       ("És l'únic nombre primer","És l'únic que no és primer",isprime),
       ("És l'únic quadrat perfecte","És l'únic que no és un quadrat perfecte",issq),
       ("És l'únic d'una sola xifra","És l'únic de dues xifres",lambda n:n<10),
       ("És l'únic amb les dues xifres iguals","És l'únic que no té dues xifres iguals",lambda n:n>=10 and n%11==0),
       ("És l'únic nombre triangular","És l'únic que no és triangular",lambda n:issq(8*n+1)),
       ("És l'únic amb la suma de les xifres parella","És l'únic amb la suma de les xifres senar",lambda n:sum(map(int,str(n)))%2==0)]
its=[]
for x in D5['num']['items']:
    n=int(x['v']); t=[]
    if n>=10 and n%11==0: t.append('rep')
    if n<10: t.append('one')
    its.append({'k':x['k'],'p':P([int(f(n)) for _,_,f in NUM_P]),'d':x['v'],'t':t})
add('NUM','Nombres','txt',[{'si':a,'no':b} for a,b,_ in NUM_P],its,{'cons':[{'tag':'rep','max':2},{'tag':'one','max':3}]})
# FIG
# Round 15: property 2 ("més de 4 costats") removed; "l'única que no és un quadrilàter" is property 1.
d=D5['fig']; FIG_DROP=2
def dropbit(p,j): return (p&((1<<j)-1))|((p>>(j+1))<<j)
add('FIG','Figures geomètriques','poly',[q for j,q in enumerate(props(d['props'])) if j!=FIG_DROP],[{'k':x['k'],'p':dropbit(x['p'],FIG_DROP),'d':x['v'],'src':x} for x in d['items']])
# FRA (fractions only). Pool: a/b with b in DEN and 1 <= a <= min(2b, 15), plus a few perfect squares.
DEN=(2,3,4,5,6,8,9,10,12); SQ=[(9,4),(16,9),(1,16),(9,16),(4,25),(9,25),(16,25)]
its=[]
for a,b in [(a,b) for b in DEN for a in range(1,min(2*b,15)+1)]+SQ:
    v=Fr(a,b); per=v.denominator
    for q in (2,5):
        while per%q==0: per//=q
    p=[v>1, math.gcd(a,b)>1, a==1, v.denominator==1, per!=1]+[f(a,b) for _,_,f in props9.FRA]   # round 15: "< 1/2" and "between 1/2 and 1" removed
    its.append({'k':f'{a}/{b}','p':P([int(x) for x in p]),'d':[a,b],'t':['int'] if v.denominator==1 else [],'g':f'{v.numerator}/{v.denominator}'})
FRA_P=[{'si':"És l'única més gran que 1",'no':"És l'única que no és més gran que 1"},
       {'si':"És l'única que es pot simplificar",'no':"És l'única irreductible"},
       {'si':"És l'única amb numerador 1",'no':"És l'única que no té numerador 1"},
       {'si':"És l'única que equival a un nombre enter",'no':"És l'única que no equival a un nombre enter"},
       {'si':"És l'única amb decimals periòdics",'no':"És l'única que no té decimals periòdics"}]+[{'si':si,'no':no} for si,no,_ in props9.FRA]
add('FRA','Fraccions','fra',FRA_P,its,{'gmax':1,'cons':[{'tag':'int','max':2}]})
# BLO / BLB
d=D5['blo']; its=[{'k':x['k'],'p':x['p'],'d':x['v']} for x in d['items']]
pa=props(d['props'])
for p in pa:   # round 15: every block carries a dimension (1 or 2) instead of the relative words gran / petit
    if p['si']=="És l'únic gran": p['si']="És l'únic de mida 2"; p['no']="És l'únic de mida 1"
add('BLO','Blocs lògics (color)','blo',pa,its,None,{'bn':False,'caixa':24})   # round 16: 24 mm drawing box in the 30 mm cell (the small block would be 7 mm with the default)
pb=[dict(p) for p in pa]
REN={"vermell":"ratllat","blau":"quadriculat","groc":"puntejat"}
for p in pb:
    for a,b in REN.items(): p['si']=p['si'].replace(a,b); p['no']=p['no'].replace(a,b)
    if p['si']=="És l'únic ple": p['si']="És l'únic amb el contorn gruixut"; p['no']="És l'únic amb el contorn prim"
add('BLB','Blocs lògics (blanc i negre)','blo',pb,[dict(x) for x in its],None,{'bn':True,'caixa':24})
# LIN (round 15, 2026-11-14): line figures on an invisible 3x3 grid, replacing the letters. Built by linies.py.
S=load('out_lin'); add('LIN','Línies','lin',props(S['props']),[{'k':x['k'],'p':P(x['p']),'d':[x['off'][0],x['off'][1],x['d']]} for x in S['items']])
# ANG
from angles import ang_domain
A=load('out_ang2'); base,_=ang_domain(); assert len(base)==len(A['items'])
its=[{'k':x['k'],'p':P(x['p']),'d':[x['th'],x['phi']]} for i,x in enumerate(A['items']) if i%2==0]   # round 15: both rays equal, so the long/short variant (odd items) is gone
add('ANG','Angles','ang',props(A['props']),its,None,{'caixa':23})   # drawing box of 23 mm in the 30 mm cell (2 mm to the hole edge; round 16): angles are drawn at one fixed scale
# quadrilaterals (TR5 and TR4 were removed in round 15: without the two rejected properties no sheet exists)
for code,src,nom,g in (('QUA',sys.argv[1] if len(sys.argv)>1 else 'out_qua_g','Quadrilàters',4),):
    def maxang(pts):   # round 16: quadrilaterals with an angle above 160° are dropped (they look like a badly drawn triangle)
        m=0
        for i in range(4):
            a,b,c=pts[i-1],pts[i],pts[(i+1)%4]; u=(a[0]-b[0],a[1]-b[1]); v=(c[0]-b[0],c[1]-b[1])
            m=max(m,math.degrees(math.acos((u[0]*v[0]+u[1]*v[1])/math.hypot(*u)/math.hypot(*v))))
        return m
    S=load(src); its=[{'k':x['k'],'p':P(x['p']),'d':[g]+[c for pt in x['pts'] for c in pt],'src':x} for x in S['items'] if maxang(x['pts'])<=160]
    add(code,nom,'dots',props(S['props']),its)
# POL and COS were removed in round 15 (2026-11-14): the owner rejected most of their properties.
ORDER=['NUM','FIG','FRA','BLO','BLB','LIN','ANG','QUA']
out={c:BANCS[c] for c in ORDER}
js='/* Reixeta · WODB — bancs d\'elements, propietats i fulls fixos. Generat automàticament. */\nwindow.BANCS='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\nwindow.BANCS_ORDRE='+json.dumps(ORDER)+';\n'
open('../../wodb/bancs.js','w',encoding='utf-8').write(js)
print('bytes',len(js),{c:(len(BANCS[c]['items']),len(BANCS[c]['props']),''.join(BANCS[c]['fulls'])) for c in ORDER})
