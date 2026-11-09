import math
TH=[25,40,55,70,90,110,125,140,150,180,220,240,270,300]
PHI=[0,15,30,45,60,90,120,150,180,200,225,270,300,330]
def svg(th,phi,l1,l2):
    a1=math.radians(phi); a2=math.radians(phi+th)
    P1=(l1*math.cos(a1),l1*math.sin(a1)); P2=(l2*math.cos(a2),l2*math.sin(a2)); r=.25
    arc=[(r*math.cos(a1+(a2-a1)*i/30),r*math.sin(a1+(a2-a1)*i/30)) for i in range(31)]
    pts=[(0,0),P1,P2]+arc
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]; s=72/max(max(xs)-min(xs),max(ys)-min(ys),.8)
    cx=(max(xs)+min(xs))/2; cy=(max(ys)+min(ys))/2
    T=lambda p:(50+(p[0]-cx)*s,50-(p[1]-cy)*s)
    O=T((0,0)); A=T(P1); B=T(P2)
    o=[]
    if th==90:
        q=.16; u=(math.cos(a1),math.sin(a1)); v=(math.cos(a2),math.sin(a2))
        sq=[T((q*u[0],q*u[1])),T((q*(u[0]+v[0]),q*(u[1]+v[1]))),T((q*v[0],q*v[1]))]
        o.append(f'<polyline points="{O[0]:.1f},{O[1]:.1f} {" ".join(f"{x:.1f},{y:.1f}" for x,y in sq)} {O[0]:.1f},{O[1]:.1f}" fill="#d0d0d0" stroke="#000" stroke-width="1.6"/>')
    else:
        ap=[T(p) for p in arc]
        o.append(f'<path d="M{O[0]:.1f},{O[1]:.1f} '+' '.join(f'L{x:.1f},{y:.1f}' for x,y in ap)+' Z" fill="#d0d0d0" stroke="none"/>')
        o.append(f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in ap)}" fill="none" stroke="#000" stroke-width="1.6"/>')
    o.append(f'<path d="M{A[0]:.1f},{A[1]:.1f} L{O[0]:.1f},{O[1]:.1f} L{B[0]:.1f},{B[1]:.1f}" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
    o.append(f'<circle cx="{O[0]:.1f}" cy="{O[1]:.1f}" r="2.6" fill="#000"/>')
    return ''.join(o)
ANG_P=[('agut',"És l'únic angle agut","És l'únic que no és agut"),
       ('recte',"És l'únic angle recte","És l'únic que no és recte"),
       ('obtus',"És l'únic angle obtús","És l'únic que no és obtús"),
       ('pla',"És l'únic angle pla","És l'únic que no és pla"),
       ('concau',"És l'únic més gran que un angle pla (còncau)","És l'únic convex (no passa d'un angle pla)"),
       ('menys45',"És l'únic més petit que mig angle recte (45°)","És l'únic que no és més petit que 45°"),
       ('mes270',"És l'únic més gran que tres angles rectes (270°)","És l'únic que no és més gran que 270°")]
def ang_domain():
    items=[]
    for th in TH:
        for phi in PHI:
            dirs=[phi%360,(phi+th)%360]
            for l1,l2 in ((1,1),(1,.62)):
                p=[th<90,th==90,90<th<180,th==180,th>180,th<45,th>270]
                items.append({'k':str(th),'p':[int(b) for b in p],'svg':svg(th,phi,l1,l2),'th':th,'phi':phi})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in ANG_P]
if __name__=='__main__':
    it,_=ang_domain(); import random; random.seed(1); sm=random.sample(it,24)
    html='<html><body style="background:#fff">'+''.join(f'<div style="display:inline-block;margin:4px;text-align:center;font:10px sans-serif"><svg viewBox="0 0 100 100" width="110" height="110" style="border:1px solid #ccc">{x["svg"]}</svg><br>{x["th"]}° φ{x["phi"]}</div>' for x in sm)+'</body></html>'
    open('/tmp/ang.html','w').write(html); print(len(it))
