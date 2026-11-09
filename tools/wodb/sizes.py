import sys, json, random, math
import common
import dots
R,C=int(sys.argv[1]),int(sys.argv[2])
common.R,common.C=R,C
common.WINS=[(r,c) for r in range(R-1) for c in range(C-1)]
def wc(r,c): return [r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1]
common.win_cells=wc
it,pr=dots.quad_domain(); keep=[0,1,2,3,4,6,8]
for x in it: x['p']=[x['p'][j] for j in keep]
pr=[pr[j] for j in keep]
P=[x['p'] for x in it]; K=[x['k'] for x in it]
best=None
for sd in range(3):
    B,p,m=common.anneal(P,K,sd+int(sys.argv[3]) if len(sys.argv)>3 else sd,int(sys.argv[4]) if len(sys.argv)>4 else 40000,2,decay=float(sys.argv[5]) if len(sys.argv)>5 else 0.9998)
    print(R,C,'seed',sd,'perfect',p,'of',len(common.WINS),flush=True)
    if best is None or p>best[0]: best=(p,B)
    if p==len(common.WINS): break
json.dump({'rows':R,'cols':C,'board':best[1],'perfect':best[0],'items':it,'props':pr},open(f'out_qua_{R}x{C}'+(sys.argv[6] if len(sys.argv)>6 else '')+'.json','w'),ensure_ascii=False)
