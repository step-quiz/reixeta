import math, itertools
from fractions import Fraction as Fr
# ---------------- NOMBRES ----------------
def isprime(n): return n>1 and all(n%d for d in range(2,int(n**.5)+1))
NUM_PROPS=[('parell',lambda n:n%2==0,"És l'únic parell","És l'únic senar"),
 ('mult3',lambda n:n%3==0,"És l'únic múltiple de 3","És l'únic que no és múltiple de 3"),
 ('mult5',lambda n:n%5==0,"És l'únic múltiple de 5","És l'únic que no és múltiple de 5"),
 ('primer',isprime,"És l'únic nombre primer","És l'únic que no és primer"),
 ('quadrat',lambda n:int(round(n**.5))**2==n,"És l'únic quadrat perfecte","És l'únic que no és un quadrat perfecte"),
 ('unaxifra',lambda n:n<10,"És l'únic d'una sola xifra","És l'únic de dues xifres"),
 ('gran',lambda n:n>50,"És l'únic més gran que 50","És l'únic que no passa de 50"),
 ('iguals',lambda n:n>=10 and n%11==0,"És l'únic amb les dues xifres iguals","És l'únic que no té dues xifres iguals")]
def num_domain():
    items=[{'t':'txt','v':str(n),'key':n} for n in range(1,100)]
    for it in items: it['p']=[int(bool(f(it['key']))) for _,f,_,_ in NUM_PROPS]
    return items,[{'id':a,'yes':y,'no':n} for a,_,y,n in NUM_PROPS]
# ---------------- FRACCIONS I DECIMALS ----------------
def fra_domain():
    items=[]
    for b in (2,3,4,5,6,8,10,12):
        for a in range(1,2*b+1):
            if a>15: continue
            items.append({'t':'frac','v':[a,b],'val':Fr(a,b),'fmt':'f'})
    decs=[('0,1',Fr(1,10)),('0,2',Fr(1,5)),('0,25',Fr(1,4)),('0,3',Fr(3,10)),('0,4',Fr(2,5)),('0,5',Fr(1,2)),('0,6',Fr(3,5)),('0,75',Fr(3,4)),('0,8',Fr(4,5)),('0,125',Fr(1,8)),
          ('1,2',Fr(6,5)),('1,25',Fr(5,4)),('1,5',Fr(3,2)),('1,75',Fr(7,4)),('2,5',Fr(5,2)),('0,333…',Fr(1,3)),('0,666…',Fr(2,3)),('1,333…',Fr(4,3)),('0,1666…',Fr(1,6)),('2,25',Fr(9,4))]
    for s,v in decs: items.append({'t':'txt','v':s,'val':v,'fmt':'d'})
    def periodic(v):
        d=v.denominator
        for p in (2,5):
            while d%p==0: d//=p
        return d!=1
    P=[('mesgran1',lambda it:it['val']>1,"És l'únic més gran que 1","És l'únic que no és més gran que 1"),
       ('mespetit',lambda it:it['val']<Fr(1,2),"És l'únic més petit que 1/2","És l'únic que no és més petit que 1/2"),
       ('decimal',lambda it:it['fmt']=='d',"És l'únic escrit amb decimals","És l'únic escrit en forma de fracció"),
       ('periodic',lambda it:periodic(it['val']),"És l'únic amb infinits decimals","És l'únic amb un nombre finit de decimals"),
       ('simplif',lambda it:it['fmt']=='f' and math.gcd(*it['v'])>1,"És l'única fracció que es pot simplificar","És l'únic que no es pot simplificar"),
       ('enter',lambda it:it['val'].denominator==1,"És l'únic que és un nombre enter","És l'únic que no és un nombre enter"),
       ('unitaria',lambda it:it['fmt']=='f' and it['v'][0]==1,"És l'única fracció amb numerador 1","És l'únic que no és una fracció amb numerador 1")]
    for it in items: it['p']=[int(bool(f(it))) for _,f,_,_ in P]
    for it in items: it.pop('val')
    return items,[{'id':a,'yes':y,'no':n} for a,_,y,n in P]
# ---------------- FIGURES ----------------
SHAPES={
 'equilater':[(0,0),(1,0),(.5,math.sqrt(3)/2)],
 'rect_isos':[(0,0),(1,0),(0,1)],
 'rect_esc':[(0,0),(4,0),(0,3)],
 'isos_agut':[(0,0),(1,0),(.5,1.6)],
 'obtus':[(0,0),(3,0),(3.8,1.1)],
 'obtus_isos':[(0,0),(3,0),(1.5,.7)],
 'quadrat':[(0,0),(1,0),(1,1),(0,1)],
 'rectangle':[(0,0),(2,0),(2,1),(0,1)],
 'rombe':[(0,.6),(1,0),(2,.6),(1,1.2)],
 'paralelogram':[(0,0),(2,0),(2.7,1),(.7,1)],
 'trapezi_isos':[(0,0),(3,0),(2.2,1.2),(.8,1.2)],
 'trapezi_rect':[(0,0),(3,0),(2,1.3),(0,1.3)],
 'estel':[(1,0),(1.8,.9),(1,2.6),(.2,.9)],
 'fletxa4':[(0,0),(1,.8),(2,0),(1,2.2)],
 'quadrilater':[(0,0),(2.2,.3),(1.8,1.6),(.3,1.1)],
 'trapezi_esc':[(0,0),(3,0),(2.4,1.2),(.5,1.2)],
 'pentagon':[(math.cos(math.radians(90+72*k)),math.sin(math.radians(90+72*k))) for k in range(5)],
 'casa':[(0,0),(2,0),(2,1.4),(1,2.4),(0,1.4)],
 'pentagon_irr':[(0,0),(2,.2),(2.5,1.4),(1.2,2.2),(-.3,1.3)],
 'pentagon_conc':[(0,0),(2,0),(2,2),(1,1),(0,2)],
 'hexagon':[(math.cos(math.radians(60*k)),math.sin(math.radians(60*k))) for k in range(6)],
 'ela':[(0,0),(2,0),(2,1),(1,1),(1,3),(0,3)],
 'hexagon_irr':[(0,0),(2,0),(3,1),(2.4,2.2),(.6,2.4),(-.5,1.1)],
 'chevron':[(0,0),(1,1),(2,0),(2,1),(1,2),(0,1)],
 'fletxa':[(0,1),(2,1),(2,0),(3.3,1.5),(2,3),(2,2),(0,2)],
 'creu':[(1,0),(2,0),(2,1),(3,1),(3,2),(2,2),(2,3),(1,3),(1,2),(0,2),(0,1),(1,1)],
 'te':[(0,0),(3,0),(3,1),(2,1),(2,3),(1,3),(1,1),(0,1)],
 'octagon':[(math.cos(math.radians(22.5+45*k)),math.sin(math.radians(22.5+45*k))) for k in range(8)],
 'estrella':[((1 if k%2==0 else .42)*math.cos(math.radians(90+36*k)),(1 if k%2==0 else .42)*math.sin(math.radians(90+36*k))) for k in range(10)],
 'zeta':[(0,0),(2,0),(2,1),(1,1),(1,2),(-1,2),(-1,1),(0,1)],
}
def props_shape(P):
    n=len(P); E=1e-6
    vec=[(P[(i+1)%n][0]-P[i][0],P[(i+1)%n][1]-P[i][1]) for i in range(n)]
    L=[math.hypot(*v) for v in vec]
    cross=[vec[i-1][0]*vec[i][1]-vec[i-1][1]*vec[i][0] for i in range(n)]
    convex=all(c>E for c in cross) or all(c<-E for c in cross)
    right=any(abs(vec[i-1][0]*vec[i][0]+vec[i-1][1]*vec[i][1])<E*10 for i in range(n))
    eq=max(L)-min(L)<1e-6
    par=any(abs(vec[i][0]*vec[j][1]-vec[i][1]*vec[j][0])<1e-6 for i in range(n) for j in range(i+1,n))
    cx=sum(p[0] for p in P)/n; cy=sum(p[1] for p in P)/n
    cands=[]
    for i in range(n):
        cands.append(P[i]); cands.append(((P[i][0]+P[(i+1)%n][0])/2,(P[i][1]+P[(i+1)%n][1])/2))
    sym=False
    for q in cands:
        dx,dy=q[0]-cx,q[1]-cy; d=math.hypot(dx,dy)
        if d<1e-9: continue
        ux,uy=dx/d,dy/d
        def refl(p):
            vx,vy=p[0]-cx,p[1]-cy; t=vx*ux+vy*uy
            return (cx+2*t*ux-vx,cy+2*t*uy-vy)
        if all(any(math.hypot(refl(p)[0]-r[0],refl(p)[1]-r[1])<1e-6 for r in P) for p in P): sym=True;break
    return {'tri':n==3,'quad':n==4,'mes4':n>4,'recte':right,'iguals':eq,'concava':not convex,'simetria':sym,'paral':par}
FIG_PROPS=[('tri',"És l'únic triangle","És l'única figura que no és un triangle"),
 ('quad',"És l'únic quadrilàter","És l'única figura que no és un quadrilàter"),
 ('mes4',"És l'única amb més de 4 costats","És l'única amb 4 costats o menys"),
 ('recte',"És l'única amb algun angle recte","És l'única sense cap angle recte"),
 ('iguals',"És l'única amb tots els costats iguals","És l'única que no té tots els costats iguals"),
 ('concava',"És l'única còncava","És l'única convexa"),
 ('simetria',"És l'única amb algun eix de simetria","És l'única sense cap eix de simetria"),
 ('paral',"És l'única amb costats paral·lels","És l'única sense costats paral·lels")]
def norm_pts(P,angle):
    a=math.radians(angle); Q=[(x*math.cos(a)-y*math.sin(a),x*math.sin(a)+y*math.cos(a)) for x,y in P]
    xs=[q[0] for q in Q]; ys=[q[1] for q in Q]; s=max(max(xs)-min(xs),max(ys)-min(ys))
    ox=(min(xs)+max(xs))/2; oy=(min(ys)+max(ys))/2
    return [[round(.5+.78*(x-ox)/s,4),round(.5-.78*(y-oy)/s,4)] for x,y in Q]  # flip y for screen
def fig_domain():
    items=[]
    for name,P in SHAPES.items():
        pr=props_shape(P)
        for ang in (0,35):
            items.append({'t':'poly','v':norm_pts(P,ang),'base':name,'p':[int(pr[k]) for k,_,_ in FIG_PROPS]})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in FIG_PROPS]
# ---------------- BLOCS LÒGICS ----------------
BLO_PROPS=[('cercle',"És l'únic cercle","És l'únic que no és un cercle"),('quadrat',"És l'únic quadrat","És l'únic que no és un quadrat"),
 ('triangle',"És l'únic triangle","És l'únic que no és un triangle"),('rectangle',"És l'únic rectangle","És l'únic que no és un rectangle"),
 ('vermell',"És l'únic vermell","És l'únic que no és vermell"),('blau',"És l'únic blau","És l'únic que no és blau"),('groc',"És l'únic groc","És l'únic que no és groc"),
 ('gran',"És l'únic gran","És l'únic petit"),('ple',"És l'únic ple","És l'únic buit")]
def blo_domain():
    items=[]
    for s in ('cercle','quadrat','triangle','rectangle'):
        for col in ('vermell','blau','groc'):
            for g in (1,0):
                for f in (1,0):
                    items.append({'t':'blo','v':[s,col,g,f],'p':[int(s=='cercle'),int(s=='quadrat'),int(s=='triangle'),int(s=='rectangle'),int(col=='vermell'),int(col=='blau'),int(col=='groc'),g,f]})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in BLO_PROPS]
# ---------------- LLETRES ----------------
LET_PROPS=[('vocal',set('AEIOU'),"És l'única vocal","És l'única consonant"),
 ('vert',set('AHIMOTUVWXY'),"És l'única amb un eix de simetria vertical","És l'única sense eix de simetria vertical"),
 ('hor',set('BCDEHIKOX'),"És l'única amb un eix de simetria horitzontal","És l'única sense eix de simetria horitzontal"),
 ('forats',set('ABDOPQR'),"És l'única amb forats","És l'única sense forats"),
 ('rectes',set('AEFHIKLMNTVWXYZ'),"És l'única feta només de línies rectes","És l'única que té corbes"),
 ('central',set('HINOSXZ'),"És l'única que queda igual si la gires mitja volta","És l'única que canvia si la gires mitja volta"),
 ('primera',set('ABCDEFGHIJKLM'),"És l'única de la primera meitat de l'abecedari (A-M)","És l'única de la segona meitat de l'abecedari (N-Z)")]
def let_domain():
    items=[{'t':'let','v':ch,'p':[int(ch in S) for _,S,_,_ in LET_PROPS]} for ch in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
    return items,[{'id':a,'yes':y,'no':n} for a,_,y,n in LET_PROPS]
DOMAINS={'num':num_domain,'fra':fra_domain,'fig':fig_domain,'blo':blo_domain,'let':let_domain}
if __name__=='__main__':
    items,props=fig_domain()
    seen=set()
    for it in items:
        if it['base'] in seen: continue
        seen.add(it['base']); print(f"{it['base']:14s}",dict(zip([p['id'] for p in props],it['p'])))
