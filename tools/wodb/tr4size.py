import sys,json,common,thin,dots
R,C=int(sys.argv[1]),int(sys.argv[2]); common.R,common.C=R,C; common.WINS=[(r,c) for r in range(R-1) for c in range(C-1)]
common.win_cells=lambda r,c:[r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1]
it,pr=dots.tri_domain(g=3,thr=4); pr[6]={'id':'gran','yes':"És l'únic que fa més de 2 quadrets d'àrea",'no':"És l'únic que no passa de 2 quadrets d'àrea"}
it=[x for x in it if thin.ok(x['pts'],25,.4)]
P=[x['p'] for x in it]; K=[x['k'] for x in it]; best=None; N=len(common.WINS)
for sd in range(5):
    B,p,m=common.anneal(P,K,80+sd,150000,4,decay=0.99995); print(R,C,'seed',sd,p,'/',N,flush=True)
    if best is None or p>best[0]: best=(p,B)
    if p==N: break
json.dump({'rows':R,'cols':C,'board':best[1],'perfect':best[0],'items':it,'props':pr},open(f'out_tr4_{R}x{C}.json','w'),ensure_ascii=False)
