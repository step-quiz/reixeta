import random, math, json
from collections import Counter
R,C=5,10
import os
W1=float(os.environ.get("W1","10"))
WINS=[(r,c) for r in range(R-1) for c in range(C-1)]
def win_cells(r,c): return [r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1]
def reasons(P,ids,k):
    out=[]
    for j in range(len(P[ids[0]])):
        m=P[ids[k]][j]
        if all(P[ids[i]][j]!=m for i in range(4) if i!=k): out.append((j,m))
    return out
def score(B,P,K,maxrep):
    s=0; perf=0; minr=[]
    for r,c in WINS:
        ids=[B[x] for x in win_cells(r,c)]
        if len(set(K[i] for i in ids))<4: s-=60; minr.append(0); continue
        rs=[reasons(P,ids,k) for k in range(4)]
        n=[len(x) for x in rs]
        if min(n)>=1: perf+=1
        s+=W1*sum(1 for x in n if x>=1)+min(min(n),3)*2+len(set(j for x in rs for j,_ in x))
        minr.append(min(n))
    cnt=Counter(B); s-=40*sum(max(0,v-1) for v in cnt.values())       # same exact item twice
    kc=Counter(K[i] for i in B); s-=25*sum(max(0,v-maxrep) for v in kc.values())
    return s,perf,minr
def anneal(P,K,seed,iters=60000,maxrep=3,decay=0.9998,init=None,T0=5.0):
    rng=random.Random(seed); N=len(P)
    B=init[:] if init else [rng.randrange(N) for _ in range(R*C)]
    cur,_,_=score(B,P,K,maxrep); best=(cur,B[:]); T=T0
    for it in range(iters):
        B2=B[:]
        if rng.random()<.5:
            i,j=rng.randrange(R*C),rng.randrange(R*C); B2[i],B2[j]=B2[j],B2[i]
        else: B2[rng.randrange(R*C)]=rng.randrange(N)
        s2,_,_=score(B2,P,K,maxrep)
        if s2>=cur or rng.random()<math.exp((s2-cur)/T):
            B,cur=B2,s2
            if cur>best[0]: best=(cur,B[:])
        T=max(.05,T*decay)
    s,p,m=score(best[1],P,K,maxrep); return best[1],p,m
def stats(B,P,K):
    perf=0; tot=0; n=0; all2=0; used=set()
    for r,c in WINS:
        ids=[B[x] for x in win_cells(r,c)]
        rs=[reasons(P,ids,k) for k in range(4)]
        if all(rs) and len(set(K[i] for i in ids))==4: perf+=1
        if all(len(x)>=2 for x in rs): all2+=1
        for x in rs:
            tot+=len(x); n+=1; used|=set(x)
    return dict(perfect=perf,avg=round(tot/n,2),all2=all2,distinct_keys=len(set(K[i] for i in B)),distinct_items=len(set(B)),types=len(used))
def run(name,items,props,seeds=(0,1,2),iters=60000,maxrep=3,decay=0.9998):
    P=[it['p'] for it in items]; K=[it['k'] for it in items]; best=None
    for sd in seeds:
        B,p,m=anneal(P,K,sd,iters,maxrep,decay)
        st=stats(B,P,K); print(name,'seed',sd,st,flush=True)
        key=(st['perfect'],st['all2'],st['avg'])
        if best is None or key>best[0]: best=(key,B,st)
    json.dump({'name':name,'items':items,'props':props,'board':best[1],'stats':best[2]},open(f'out_{name}.json','w'),ensure_ascii=False)
    print('SAVED',name,best[2],flush=True)
    return best
