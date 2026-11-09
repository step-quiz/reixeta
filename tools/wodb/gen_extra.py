import random, json, math, sys
from fractions import Fraction as Fr
from collections import Counter
from gen import WINS, win_cells, reasons
from domains import num_domain
R,C=5,10
def periodic(v):
    d=v.denominator
    for p in (2,5):
        while d%p==0: d//=p
    return d!=1
def fra_build():
    items=[]
    for b in (2,3,4,5,6,8,10,12):
        for a in range(1,2*b+1):
            if a>15: continue
            items.append({'t':'frac','v':[a,b],'val':Fr(a,b),'fmt':'f'})
    decs=[('0,1',Fr(1,10)),('0,2',Fr(1,5)),('0,25',Fr(1,4)),('0,3',Fr(3,10)),('0,4',Fr(2,5)),('0,5',Fr(1,2)),('0,6',Fr(3,5)),('0,75',Fr(3,4)),('0,8',Fr(4,5)),('0,125',Fr(1,8)),
          ('1,2',Fr(6,5)),('1,25',Fr(5,4)),('1,5',Fr(3,2)),('1,75',Fr(7,4)),('2,5',Fr(5,2)),('0,333…',Fr(1,3)),('0,666…',Fr(2,3)),('1,333…',Fr(4,3)),('0,1666…',Fr(1,6)),('2,25',Fr(9,4)),
          ('0,7',Fr(7,10)),('0,9',Fr(9,10)),('1,1',Fr(11,10)),('1,4',Fr(7,5)),('0,375',Fr(3,8)),('3,5',Fr(7,2)),('0,05',Fr(1,20)),('0,8333…',Fr(5,6)),('0,111…',Fr(1,9)),('1,666…',Fr(5,3)),('0,35',Fr(7,20)),('1,8',Fr(9,5))]
    for s,v in decs: items.append({'t':'txt','v':s,'val':v,'fmt':'d'})
    P=[('mesgran1',lambda it:it['val']>1,"És l'únic més gran que 1","És l'únic que no és més gran que 1"),
       ('mespetit',lambda it:it['val']<Fr(1,2),"És l'únic més petit que 1/2","És l'únic que no és més petit que 1/2"),
       ('decimal',lambda it:it['fmt']=='d',"És l'únic escrit amb decimals","És l'únic escrit en forma de fracció"),
       ('periodic',lambda it:periodic(it['val']),"És l'únic amb infinits decimals","És l'únic amb un nombre finit de decimals"),
       ('simplif',lambda it:it['fmt']=='f' and math.gcd(*it['v'])>1,"És l'única fracció que es pot simplificar","És l'únic que no es pot simplificar"),
       ('enter',lambda it:it['val'].denominator==1,"És l'únic que és un nombre enter","És l'únic que no és un nombre enter"),
       ('unitaria',lambda it:it['fmt']=='f' and it['v'][0]==1,"És l'única fracció amb numerador 1","És l'únic que no és una fracció amb numerador 1")]
    for it in items: it['p']=[int(bool(f(it))) for _,f,_,_ in P]
    meta=[{'val':it.pop('val'),'fmt':it.pop('fmt')} for it in items]
    return items,[{'id':a,'yes':y,'no':n} for a,_,y,n in P],meta

def base_score(B,items):
    P=[it['p'] for it in items]; perfect=0; s=0; minr=[]
    for r,c in WINS:
        ids=[B[x] for x in win_cells(r,c)]
        if len(set(ids))<4: s-=50; continue
        rs=[reasons(P,ids,k) for k in range(4)]
        n=[len(x) for x in rs]
        if min(n)>=1: perfect+=1
        s+=10*sum(1 for x in n if x>=1)+min(min(n),3)*2+len(set(j for x in rs for j,_ in x))
        minr.append(min(n))
    s-=200*(len(B)-len(set(B)))
    return s,perfect,minr

def fra_pen(B,items,meta):
    pen=0; vc=Counter(meta[i]['val'] for i in B)
    pen+=30*sum(max(0,n-2) for n in vc.values())
    import os
    nd=sum(1 for i in B if meta[i]['fmt']=='d'); pen+=20*max(0,int(os.environ.get('MIND','15'))-nd)
    npd=sum(1 for i in B if meta[i]['fmt']=='d' and periodic(meta[i]['val'])); pen+=20*max(0,3-npd)
    nint=sum(1 for i in B if meta[i]['val'].denominator==1); pen+=20*max(0,nint-int(os.environ.get('MAXI','4')))
    return pen
def num_pen(B,items):
    rep=sum(1 for i in B if int(items[i]['v'])>=10 and int(items[i]['v'])%11==0)
    one=sum(1 for i in B if int(items[i]['v'])<10)
    return 30*max(0,rep-5)+20*max(0,one-6)

def anneal(items,pen,seed,iters,decay=0.9997):
    rng=random.Random(seed); N=len(items)
    B=rng.sample(range(N),R*C)
    def sc(B):
        s,p,m=base_score(B,items); return s-pen(B),p,m
    cur,_,_=sc(B); best=(cur,B[:]); T=5.0
    for it in range(iters):
        B2=B[:]
        if rng.random()<.5:
            i,j=rng.randrange(R*C),rng.randrange(R*C); B2[i],B2[j]=B2[j],B2[i]
        else:
            B2[rng.randrange(R*C)]=rng.randrange(N)
        s2,_,_=sc(B2)
        if s2>=cur or rng.random()<math.exp((s2-cur)/T):
            B,cur=B2,s2
            if cur>best[0]: best=(cur,B[:])
        T=max(.05,T*decay)
    s,p,m=sc(best[1]); return best[1],p,m,pen(best[1])

if __name__=='__main__':
    which=sys.argv[1]
    if which=='fra':
        items,props,meta=fra_build(); pen=lambda B:fra_pen(B,items,meta)
    else:
        items,props=num_domain(); pen=lambda B:num_pen(B,items)
    res=None
    import os
    seeds=[int(x) for x in os.environ.get('SEEDS','0,1,2,3,4').split(',')]
    for seed in seeds:
        B,p,m,pn=anneal(items,pen,1000+seed,int(os.environ.get('ITERS','60000')),float(os.environ.get('DECAY','0.9997')))
        k=(p,pn==0,sum(1 for x in m if x>=2))
        print(which,'seed',seed,'perfect',p,'pen',pn,'all>=2 windows',k[2]); sys.stdout.flush()
        if res is None or (p,-pn,k[2])>res[0]: res=((p,-pn,k[2]),B)
    json.dump({'board':res[1],'items':items,'props':props},open(f'./extra_{which}'+os.environ.get('TAG','')+'.json','w'))
    print('saved',res[0])
