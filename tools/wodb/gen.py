import random, json, math, sys
from domains import DOMAINS
R,C=5,10
WINS=[(r,c) for r in range(R-1) for c in range(C-1)]
def win_cells(r,c): return [r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1]
def reasons(P,ids,k):
    out=[]
    for j in range(len(P[ids[0]])):
        mine=P[ids[k]][j]; others=[P[ids[i]][j] for i in range(4) if i!=k]
        if all(o!=mine for o in others): out.append((j,mine))
    return out
def score_board(B,items,keyf,global_unique):
    P=[it['p'] for it in items]; perfect=0; s=0; minr=[]
    for r,c in WINS:
        ids=[B[x] for x in win_cells(r,c)]
        keys=[keyf(items[i]) for i in ids]
        if len(set(keys))<4: s-=50; continue
        rs=[reasons(P,ids,k) for k in range(4)]
        n=[len(x) for x in rs]
        if min(n)>=1: perfect+=1
        s+=10*sum(1 for x in n if x>=1)+min(min(n),3)*2+len(set(j for x in rs for j,_ in x))
        minr.append(min(n))
    if global_unique and len(set(B))<len(B): s-=200*(len(B)-len(set(B)))
    return s,perfect,minr
def anneal(name,seed,iters,global_unique):
    items,props=DOMAINS[name](); rng=random.Random(seed)
    keyf=(lambda it:it.get('base',json.dumps(it['v'])))
    N=len(items)
    B=rng.sample(range(N),R*C) if (global_unique and N>=R*C) else [rng.randrange(N) for _ in range(R*C)]
    cur,perf,_=score_board(B,items,keyf,global_unique); best=(cur,B[:])
    T=5.0
    for it in range(iters):
        B2=B[:]
        if rng.random()<.5:
            i,j=rng.randrange(R*C),rng.randrange(R*C); B2[i],B2[j]=B2[j],B2[i]
        else:
            B2[rng.randrange(R*C)]=rng.randrange(N)
        s2,p2,_=score_board(B2,items,keyf,global_unique)
        if s2>=cur or rng.random()<math.exp((s2-cur)/T):
            B,cur=B2,s2
            if cur>best[0]: best=(cur,B[:])
        T=max(.05,T*0.9995)
    s,perf,minr=score_board(best[1],items,keyf,global_unique)
    return best[1],perf,minr,items,props
if __name__=='__main__':
  out={}
  for name,gu in (('num',True),('fra',True),('fig',False),('blo',False),('let',False)):
      bestB=None
      for seed in range(4):
          B,perf,minr,items,props=anneal(name,seed,30000,gu)
          tot=sum(minr)
          print(name,'seed',seed,'perfect',perf,'/36','min reasons per window avg',round(tot/max(1,len(minr)),2),'windows with every item >=2 reasons',sum(1 for m in minr if m>=2))
          cand=(perf,sum(1 for m in minr if m>=2),B)
          if bestB is None or cand[:2]>bestB[:2]: bestB=cand
      out[name]={'board':bestB[2],'items':items,'props':props}
      sys.stdout.flush()
  json.dump(out,open('wodb.json','w'))
