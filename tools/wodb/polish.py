import sys, json
from common import anneal, stats
name=sys.argv[1]; maxrep=int(sys.argv[2]); iters=int(sys.argv[3])
D=json.load(open(f'out_{name}.json')); P=[it['p'] for it in D['items']]; K=[it['k'] for it in D['items']]
best=(tuple(D['stats'][x] for x in ('perfect','all2','avg')),D['board'],D['stats'])
base=int(sys.argv[5]) if len(sys.argv)>5 else 100
for sd in range(int(sys.argv[4]) if len(sys.argv)>4 else 3):
    B,p,m=anneal(P,K,base+sd,iters,maxrep,0.99997,init=best[1],T0=2.0)
    st=stats(B,P,K); print(name,'polish',sd,st,flush=True)
    key=(st['perfect'],st['all2'],st['avg'])
    if key>best[0]: best=(key,B,st)
    if st['perfect']==36: break
D['board']=best[1]; D['stats']=best[2]; json.dump(D,open(f'out_{name}'+(sys.argv[6] if len(sys.argv)>6 else '')+'.json','w'),ensure_ascii=False); print('SAVED',name,best[2],flush=True)
