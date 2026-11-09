import json, sys, random, math, os
from collections import Counter
src=open('../../wodb/bancs.js',encoding='utf-8').read()
BANCS=json.loads(src[src.index('window.BANCS=')+13:src.index(';\nwindow.BANCS_ORDRE')])
code=sys.argv[1]; B=BANCS[code]; o=B['gen']
R,C=B.get('rows',5),B.get('cols',10); NC=R*C
W=[[r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1] for r in range(R-1) for c in range(C-1)]; N=len(W); CAP=(N*int(os.environ.get('CAPN','1')))//int(os.environ.get('CAPD','3'))
P=[x['p'] for x in B['items']]; K=[x['k'] for x in B['items']]; NP=len(B['props']); ALL=(1<<NP)-1
kid={}; KI=[kid.setdefault(k,len(kid)) for k in K]
T=[x.get('t',[]) for x in B['items']]; G=[x.get('g') for x in B['items']]
W1=float(os.environ.get('W1',o.get('w1',10))); maxrep=o.get('maxrep',3); cons=o.get('cons',[]); gmax=o.get('gmax',0)
def win(ids):
    ms=[]
    for k in range(4):
        m=ALL
        for i in range(4):
            if i!=k: m&=P[ids[k]]^P[ids[i]]
        ms.append(m)
    return ms
def score(Bd):
    s=0; perf=0; tc=Counter()
    for w in W:
        ids=[Bd[i] for i in w]
        if len({KI[i] for i in ids})<4: s-=60; continue
        ms=win(ids); n1=sum(1 for m in ms if m); mn=min(bin(m).count('1') for m in ms)
        if mn>=1: perf+=1
        s+=W1*n1+min(mn,3)*2
        types=set()
        for k,m in enumerate(ms):
            for j in range(NP):
                if (m>>j)&1: types.add((j,(P[ids[k]]>>j)&1))
        tc.update(types)
    over=sum(max(0,v-CAP) for v in tc.values()); s-=float(os.environ.get('BALW','20'))*over
    cnt=Counter(Bd); s-=40*sum(v-1 for v in cnt.values() if v>1)
    kc=Counter(KI[i] for i in Bd); s-=25*sum(v-maxrep for v in kc.values() if v>maxrep)
    for ct in cons:
        n=sum(1 for i in Bd if ct['tag'] in T[i])
        CW=float(os.environ.get('CONW','1'))
        if 'min' in ct and n<ct['min']: s-=20*CW*(ct['min']-n)
        if 'max' in ct and n>ct['max']: s-=20*CW*(n-ct['max'])
    if gmax:
        gc=Counter(G[i] for i in Bd if G[i] is not None); s-=30*float(os.environ.get('CONW','1'))*sum(v-gmax for v in gc.values() if v>gmax)
    return s,perf,max(tc.values()) if tc else 0,over
def anneal(seed,iters,init=None,T0=5.0,decay=0.99995):
    rng=random.Random(seed); Nn=len(P)
    Bd=init[:] if init else [rng.randrange(Nn) for _ in range(NC)]
    cur=score(Bd)[0]; best=(cur,Bd[:]); Tt=T0
    for _ in range(iters):
        B2=Bd[:]
        if rng.random()<.5:
            i,j=rng.randrange(NC),rng.randrange(NC); B2[i],B2[j]=B2[j],B2[i]
        else: B2[rng.randrange(NC)]=rng.randrange(Nn)
        s2=score(B2)[0]
        if s2>=cur or rng.random()<math.exp((s2-cur)/Tt):
            Bd,cur=B2,s2
            if cur>best[0]: best=(cur,Bd[:])
        Tt=max(.05,Tt*decay)
    return best[1]
IT=os.environ.get('INIT','');init=json.load(open(f'bal{IT}_{code}.json'))[code] if os.path.exists(f'bal{IT}_{code}.json') and code in json.load(open(f'bal{IT}_{code}.json')) else (B['fulls']['A'] if sum(B['fulls']['A']) else None)
s0=score(init) if init else None
print(code,'N',N,'cap',CAP,'start',s0[1:] if s0 else None,flush=True)
best=None
iters=int(sys.argv[2]) if len(sys.argv)>2 else 120000
for sd in range(int(sys.argv[3]) if len(sys.argv)>3 else 3):
    Bd=anneal(sd,iters,init if sd%2==0 else None,T0=3.0 if (init and sd%2==0) else 5.0)
    s,perf,mx,over=score(Bd); print(code,'seed',sd,'perfect',perf,'/',N,'maxtype',mx,'over',over,flush=True)
    key=(perf==N,-over,perf,-mx)
    if best is None or key>best[0]: best=(key,Bd,perf,mx,over)
    if perf==N and over==0: break
out={}
res={}
if best[2]==N: out[code]=best[1]
res[code]={'N':N,'cap':CAP,'perfect':best[2],'maxtype':best[3],'over':best[4]}
tag=os.environ.get('TAG','');json.dump(out,open(f'bal{tag}_{code}.json','w')); json.dump(res,open(f'balres{tag}_{code}.json','w'))
print('SAVED',code,res[code],flush=True)
