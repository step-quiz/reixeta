import itertools, math, random, json
from math import gcd
G=4  # 5x5 dots
def X(v): return 12+v*76/G
def dots_svg():
    return ''.join(f'<circle cx="{X(i)}" cy="{X(j)}" r="1.9" fill="#888"/>' for i in range(G+1) for j in range(G+1))
def poly_svg(pts):
    s=' '.join(f'{X(x)},{X(G-y)}' for x,y in pts)
    return dots_svg()+f'<polygon points="{s}" fill="#d9d9d9" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/>'
def sub(a,b): return (a[0]-b[0],a[1]-b[1])
def dot(a,b): return a[0]*b[0]+a[1]*b[1]
def cross(a,b): return a[0]*b[1]-a[1]*b[0]
def L2(a): return dot(a,a)
def area2(pts):
    return abs(sum(cross(pts[i],pts[(i+1)%len(pts)]) for i in range(len(pts))))
def boundary(pts):
    return sum(gcd(abs(sub(pts[(i+1)%len(pts)],pts[i])[0]),abs(sub(pts[(i+1)%len(pts)],pts[i])[1])) for i in range(len(pts)))
def interior(pts):
    A2=area2(pts); B=boundary(pts); return (A2-B+2)//2  # Pick: I=A-B/2+1
D4=[lambda x,y:(x,y),lambda x,y:(-y,x),lambda x,y:(-x,-y),lambda x,y:(y,-x),lambda x,y:(-x,y),lambda x,y:(x,-y),lambda x,y:(y,x),lambda x,y:(-y,-x)]
def canon(pts):
    best=None
    for f in D4:
        q=[f(*p) for p in pts]; mx=min(p[0] for p in q); my=min(p[1] for p in q); q=[(a-mx,b-my) for a,b in q]
        n=len(q)
        for s in range(n):
            for d in (1,-1):
                seq=tuple(q[(s+d*i)%n] for i in range(n))
                if best is None or seq<best: best=seq
    return str(best)
def fmt(props,pbits): return [int(b) for b in pbits]
# ---------------- triangles ----------------
TRI_P=[('rect',"És l'únic triangle rectangle","És l'únic que no té cap angle recte"),
       ('obtus',"És l'únic obtusangle","És l'únic que no té cap angle obtús"),
       ('acut',"És l'únic acutangle (tots els angles aguts)","És l'únic que no és acutangle"),
       ('isos',"És l'únic isòsceles","És l'únic escalè"),
       ('trama',"És l'únic amb algun costat horitzontal o vertical","És l'únic que no té cap costat horitzontal ni vertical"),
       ('dins',"És l'únic amb algun punt de la trama a dins","És l'únic sense cap punt de la trama a dins"),
       ('gran',"És l'únic que fa més de 3 quadrets d'àrea","És l'únic que no passa de 3 quadrets d'àrea")]
def tri_domain(seed=0,per_class=3,g=None,thr=6):
    global G
    if g: G=g
    rng=random.Random(seed); P=[(x,y) for x in range(G+1) for y in range(G+1)]
    classes={}
    for a,b,c in itertools.combinations(P,3):
        if cross(sub(b,a),sub(c,a))==0: continue
        pts=[a,b,c]; key=str(sorted(L2(sub(pts[i],pts[(i+1)%3])) for i in range(3)))
        classes.setdefault(key,[]).append(pts)
    items=[]
    for key,lst in sorted(classes.items()):
        rng.shuffle(lst)
        for pts in lst[:per_class]:
            v=[sub(pts[(i+1)%3],pts[i]) for i in range(3)]
            angs=[dot(sub(pts[(i+1)%3],pts[i]),sub(pts[(i+2)%3],pts[i])) for i in range(3)]
            sides=[L2(x) for x in v]
            p=[any(d==0 for d in angs), any(d<0 for d in angs), all(d>0 for d in angs),
               len(set(sides))<3, any(x[0]==0 or x[1]==0 for x in v), interior(pts)>0, area2(pts)>thr]
            items.append({'k':key,'pts':pts,'p':[int(b) for b in p],'svg':poly_svg(pts)})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in TRI_P]
# ---------------- quadrilaterals ----------------
QUA_P=[('rect4',"És l'únic amb els quatre angles rectes","És l'únic que no té els quatre angles rectes"),
       ('iguals',"És l'únic amb els quatre costats iguals","És l'únic que no té els quatre costats iguals"),
       ('paralelogram',"És l'únic amb els costats paral·lels dos a dos","És l'únic que no té els costats paral·lels dos a dos"),
       ('algunpar',"És l'únic amb algun parell de costats paral·lels","És l'únic sense cap parell de costats paral·lels"),
       ('concau',"És l'únic còncau","És l'únic convex"),
       ('simetria',"És l'únic amb algun eix de simetria","És l'únic sense cap eix de simetria"),
       ('diagperp',"És l'únic amb les diagonals perpendiculars","És l'únic amb les diagonals no perpendiculars"),
       ('trama',"És l'únic amb algun costat horitzontal o vertical","És l'únic que no té cap costat horitzontal ni vertical"),
       ('unrecte',"És l'únic amb algun angle recte","És l'únic sense cap angle recte")]
def segs_cross(p1,p2,p3,p4):
    d1=cross(sub(p4,p3),sub(p1,p3)); d2=cross(sub(p4,p3),sub(p2,p3)); d3=cross(sub(p2,p1),sub(p3,p1)); d4=cross(sub(p2,p1),sub(p4,p1))
    return ((d1>0)!=(d2>0)) and ((d3>0)!=(d4>0)) and d1*d2<0 and d3*d4<0
def reflect(p,a,b):
    ax,ay=a; bx,by=b; dx,dy=bx-ax,by-ay; t=((p[0]-ax)*dx+(p[1]-ay)*dy)/(dx*dx+dy*dy)
    fx,fy=ax+t*dx,ay+t*dy; return (2*fx-p[0],2*fy-p[1])
def close(p,q): return abs(p[0]-q[0])<1e-9 and abs(p[1]-q[1])<1e-9
def has_axis(q):
    for i in range(4):
        a,b=q[i],q[(i+2)%4]
        if close(reflect(q[(i+1)%4],a,b),q[(i+3)%4]): return True
    for i in range(2):
        m1=((q[i][0]+q[i+1][0])/2,(q[i][1]+q[i+1][1])/2); m2=((q[i+2][0]+q[(i+3)%4][0])/2,(q[i+2][1]+q[(i+3)%4][1])/2)
        if close(m1,m2): continue
        if close(reflect(q[i],m1,m2),q[i+1]) and close(reflect(q[i+2],m1,m2),q[(i+3)%4]): return True
    return False
def quad_domain(seed=0,pool=700):
    rng=random.Random(seed); P=[(x,y) for x in range(G+1) for y in range(G+1)]
    seen=set(); byclass={}
    for a,b,c,d in itertools.permutations(P,4):
        if a!=min((a,b,c,d)): continue
        q=[a,b,c,d]
        if any(cross(sub(q[(i+1)%4],q[i]),sub(q[(i+2)%4],q[(i+1)%4]))==0 for i in range(4)): continue
        if segs_cross(q[0],q[1],q[2],q[3]) or segs_cross(q[1],q[2],q[3],q[0]): continue
        cyc=frozenset([tuple(q),tuple([q[0],q[3],q[2],q[1]])])
        k1=tuple(q); k2=(q[0],q[3],q[2],q[1])
        if k2 in seen: continue
        seen.add(k1)
        key=canon(q); byclass.setdefault(key,[]).append(q)
    classes=list(byclass.items()); rng.shuffle(classes)
    def props(q):
        e=[sub(q[(i+1)%4],q[i]) for i in range(4)]
        turns=[cross(e[i],e[(i+1)%4]) for i in range(4)]
        concave=not(all(t>0 for t in turns) or all(t<0 for t in turns))
        angs=[dot(e[i],e[(i+1)%4]) for i in range(4)]
        par=[cross(e[0],e[2])==0, cross(e[1],e[3])==0]
        sides=[L2(x) for x in e]
        d1=sub(q[2],q[0]); d2=sub(q[3],q[1])
        return [all(x==0 for x in angs), len(set(sides))==1, all(par), any(par), concave, has_axis([tuple(map(float,p)) for p in q]),
                dot(d1,d2)==0, any(x[0]==0 or x[1]==0 for x in e), any(x==0 for x in angs)]
    # stratify: group classes by property vector, pick up to n per vector
    byvec={}
    for key,lst in classes:
        v=tuple(int(b) for b in props(lst[0]))
        byvec.setdefault(v,[]).append((key,lst))
    items=[]; per=max(2,pool//len(byvec))
    for v,cl in byvec.items():
        for key,lst in cl[:per]:
            # choose up to 2 placements, prefer centred
            rng.shuffle(lst)
            for q in lst[:2]:
                pv=[int(b) for b in props(q)]
                items.append({'k':key,'pts':q,'p':pv,'svg':poly_svg(q)})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in QUA_P]
if __name__=='__main__':
    it,pr=tri_domain(); print('tri',len(it),len(set(x['k'] for x in it)))
    from collections import Counter
    for j,p in enumerate(pr): print('  ',p['id'],sum(x['p'][j] for x in it))
    it,pr=quad_domain(); print('quad',len(it),len(set(x['k'] for x in it)))
    for j,p in enumerate(pr): print('  ',p['id'],sum(x['p'][j] for x in it))
