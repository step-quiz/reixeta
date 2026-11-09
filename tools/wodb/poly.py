import random
def norm(cells):
    mx=min(x for x,y in cells); my=min(y for x,y in cells); return tuple(sorted((x-mx,y-my) for x,y in cells))
TR=[lambda x,y:(x,y),lambda x,y:(-y,x),lambda x,y:(-x,-y),lambda x,y:(y,-x),lambda x,y:(-x,y),lambda x,y:(x,-y),lambda x,y:(y,x),lambda x,y:(-y,-x)]
def forms(cells): return {norm([f(*c) for c in cells]) for f in TR}
def canon(cells): return min(forms(cells))
def free(n):
    cur={((0,0),)}
    for _ in range(n-1):
        nxt=set()
        for s in cur:
            S=set(s)
            for x,y in s:
                for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    c=(x+dx,y+dy)
                    if c not in S: nxt.add(canon(list(S|{c})))
        cur=nxt
    return sorted(cur)
def has_axis(c): s=norm(c); return any(norm([f(*p) for p in c])==s for f in TR[4:])
def half(c): s=norm(c); return norm([TR[2](*p) for p in c])==s
def nb(c,p): return sum((p[0]+dx,p[1]+dy) in c for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))
def branch(c): S=set(c); return any(nb(S,p)>=3 for p in c)
def block(c): S=set(c); return any({(x+1,y),(x,y+1),(x+1,y+1)}<=S for x,y in c)
def line(c,k):
    S=set(c)
    return any(all((x+i,y) in S for i in range(k)) or all((x,y+i) in S for i in range(k)) for x,y in c)
def cube_net(c):
    S=set(c); start=c[0]
    OPP={0:5,1:4,2:3,3:2,4:1,5:0}
    st={start:(0,1,2)}  # down, north, east
    q=[start]
    while q:
        p=q.pop(); d,n,e=st[p]
        for (dx,dy),ns in (((1,0),(e,n,OPP[d])),((-1,0),(OPP[e],n,d)),((0,1),(n,OPP[d],e)),((0,-1),(OPP[n],d,e))):
            r=(p[0]+dx,p[1]+dy)
            if r in S and r not in st: st[r]=ns; q.append(r)
    return len({v[0] for v in st.values()})==6
def svg(cells):
    w=max(x for x,y in cells)+1; h=max(y for x,y in cells)+1; s=min(84/w,84/h,20)
    ox=50-w*s/2; oy=50-h*s/2
    return ''.join(f'<rect x="{ox+x*s:.1f}" y="{oy+(h-1-y)*s:.1f}" width="{s:.1f}" height="{s:.1f}" fill="#d9d9d9" stroke="#000" stroke-width="2.2"/>' for x,y in cells)
POL_P=[('cinc',"És l'únic de 5 quadrats","És l'únic de 4 quadrats"),
       ('eix',"És l'únic amb algun eix de simetria","És l'únic sense cap eix de simetria"),
       ('mitja',"És l'únic que queda igual si el gires mitja volta","És l'únic que canvia si el gires mitja volta"),
       ('branca',"És l'únic amb un quadrat que en toca tres d'altres","És l'únic on cap quadrat no en toca tres d'altres"),
       ('bloc',"És l'únic que conté un quadrat de 2×2","És l'únic que no conté cap quadrat de 2×2"),
       ('tres',"És l'únic amb tres quadrats en línia","És l'únic sense tres quadrats en línia"),
       ('quatre',"És l'únic amb quatre quadrats en línia","És l'únic sense quatre quadrats en línia"),
       ('perim',"És l'únic amb un perímetre de 12 costats de quadret","És l'únic que no té un perímetre de 12"),
       ('cap3',"És l'únic que cap dins un quadrat de 3×3","És l'únic que no cap dins un quadrat de 3×3"),
       ('domino',"És l'únic que es pot cobrir amb fitxes de dòmino","És l'únic que no es pot cobrir amb fitxes de dòmino")]
def domino(c):
    S=set(c)
    def rec(S):
        if not S: return True
        p=min(S)
        for q in ((p[0]+1,p[1]),(p[0],p[1]+1)):
            if q in S and rec(S-{p,q}): return True
        return False
    return rec(frozenset(S))
def perim(c): S=set(c); return sum(4-nb(S,p) for p in c)
def bbox(c): return (max(x for x,y in c)-min(x for x,y in c)+1, max(y for x,y in c)-min(y for x,y in c)+1)
def pol_domain(seed=0,per=3):
    rng=random.Random(seed); items=[]
    for n in (4,5):
        for c in free(n):
            fs=sorted(forms(c)); rng.shuffle(fs)
            p=[n==5,has_axis(c),half(c),branch(c),block(c),line(c,3),line(c,4),perim(c)==12,max(bbox(c))<=3,domino(c)]
            for f in fs[:per]: items.append({'k':str(c),'cells':f,'p':[int(b) for b in p],'svg':svg(f)})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in POL_P]
HEX_P=[('cub',"És l'únic que es pot plegar en un cub","És l'únic que no es pot plegar en un cub"),
       ('eix',"És l'únic amb algun eix de simetria","És l'únic sense cap eix de simetria"),
       ('mitja',"És l'únic que queda igual si el gires mitja volta","És l'únic que canvia si el gires mitja volta"),
       ('quatre',"És l'únic amb quatre quadrats en línia","És l'únic sense quatre quadrats en línia"),
       ('bloc',"És l'únic que conté un quadrat de 2×2","És l'únic que no conté cap quadrat de 2×2"),
       ('branca',"És l'únic amb un quadrat que en toca tres d'altres","És l'únic on cap quadrat no en toca tres d'altres"),
       ('estret',"És l'únic que cap en una tira de 2 quadrats d'amplada","És l'únic que no cap en una tira de 2 quadrats d'amplada")]
def hex_domain(seed=0,per=3):
    rng=random.Random(seed); items=[]
    for c in free(6):
        fs=sorted(forms(c)); rng.shuffle(fs)
        w=max(x for x,y in c)+1; h=max(y for x,y in c)+1
        p=[cube_net(c),has_axis(c),half(c),line(c,4),block(c),branch(c),min(w,h)<=2]
        for f in fs[:per]: items.append({'k':str(c),'cells':f,'p':[int(b) for b in p],'svg':svg(f)})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in HEX_P]
if __name__=='__main__':
    print([len(free(n)) for n in range(1,7)])
    print('cube nets',sum(cube_net(c) for c in free(6)))
    for f in (pol_domain,hex_domain):
        it,pr=f(); ks=sorted(set(x['k'] for x in it))
        print(f.__name__,len(it),len(ks))
        for j,p in enumerate(pr): print('  ',p['id'],sum(1 for k in ks if next(x for x in it if x['k']==k)['p'][j]),'/',len(ks))
