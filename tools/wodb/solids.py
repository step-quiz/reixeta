import numpy as np, math
from scipy.spatial import ConvexHull
def rot(yaw,pitch):
    a=math.radians(yaw); b=math.radians(pitch)
    Ry=np.array([[math.cos(a),0,math.sin(a)],[0,1,0],[-math.sin(a),0,math.cos(a)]])
    Rx=np.array([[1,0,0],[0,math.cos(b),-math.sin(b)],[0,math.sin(b),math.cos(b)]])
    return Rx@Ry
def hull_faces(V):
    V=np.array(V,float); h=ConvexHull(V); faces=[]
    eq=h.equations; groups={}
    for simp,e in zip(h.simplices,eq):
        key=tuple(np.round(e,5)); groups.setdefault(key,set()).update(simp.tolist())
    for key,idx in groups.items():
        n=np.array(key[:3]); idx=list(idx); P=V[idx]; c=P.mean(0)
        u=P[0]-c; u/=np.linalg.norm(u); w=np.cross(n,u)
        idx.sort(key=lambda i: math.atan2(np.dot(V[i]-c,w),np.dot(V[i]-c,u)))
        faces.append((idx,n))
    return V,faces
def poly_svg(V,faces,yaw,pitch,hidden=True):
    R=rot(yaw,pitch); W=(R@V.T).T   # view direction: +z towards viewer
    xs=W[:,0]; ys=-W[:,1]
    s=78/max(xs.max()-xs.min(),ys.max()-ys.min()); cx=(xs.max()+xs.min())/2; cy=(ys.max()+ys.min())/2
    P=[(50+(x-cx)*s,50+(y-cy)*s) for x,y in zip(xs,ys)]
    vis=[]; out=[]
    edges={}
    for fi,(idx,n) in enumerate(faces):
        nz=(R@n)[2]; vis.append(nz>1e-6)
        for a,b in zip(idx,idx[1:]+idx[:1]):
            edges.setdefault(tuple(sorted((a,b))),[]).append(fi)
    L=np.array([-.4,.7,.6]); L/=np.linalg.norm(L)
    for fi,(idx,n) in enumerate(faces):
        if not vis[fi]: continue
        rn=R@n; sh=0.55+0.45*max(0,float(np.dot(rn,L))); g=int(150+105*sh) if sh<1 else 255; g=min(255,max(170,int(170+85*sh)))
        pts=' '.join(f'{P[i][0]:.1f},{P[i][1]:.1f}' for i in idx)
        out.append(f'<polygon points="{pts}" fill="rgb({g},{g},{g})" stroke="none"/>')
    for (a,b),fs in edges.items():
        if hidden and not any(vis[f] for f in fs):
            out.append(f'<line x1="{P[a][0]:.1f}" y1="{P[a][1]:.1f}" x2="{P[b][0]:.1f}" y2="{P[b][1]:.1f}" stroke="#444" stroke-width="1.4" stroke-dasharray="3.5 3"/>')
    for (a,b),fs in edges.items():
        if any(vis[f] for f in fs):
            out.append(f'<line x1="{P[a][0]:.1f}" y1="{P[a][1]:.1f}" x2="{P[b][0]:.1f}" y2="{P[b][1]:.1f}" stroke="#000" stroke-width="2.2" stroke-linecap="round"/>')
    return ''.join(out)
def ngon(n,r=1,z=0,ph=0): return [(r*math.cos(2*math.pi*i/n+ph),z,r*math.sin(2*math.pi*i/n+ph)) for i in range(n)]
def prism(n,h=1.6,r=1): return ngon(n,r,0,math.pi/n if n%2==0 else math.pi/2)+ngon(n,r,h,math.pi/n if n%2==0 else math.pi/2)
def pyramid(n,h=1.6,r=1): return ngon(n,r,0,math.pi/n if n%2==0 else math.pi/2)+[(0,h,0)]
phi=(1+5**.5)/2
SOL={
 'cub':([(x,y,z) for x in (0,1) for y in (0,1) for z in (0,1)],dict(tri=0,quad=1,punta=0,bases=1,regular=1,faces=6)),
 'ortoedre':([(x,y,z) for x in (0,2.2) for y in (0,1) for z in (0,1.1)],dict(tri=0,quad=1,punta=0,bases=1,regular=0,faces=6)),
 'prisma3':(prism(3,1.7),dict(tri=1,quad=1,punta=0,bases=1,regular=0,faces=5)),
 'prisma5':(prism(5,1.5),dict(tri=0,quad=1,punta=0,bases=1,regular=0,faces=7)),
 'prisma6':(prism(6,1.4),dict(tri=0,quad=1,punta=0,bases=1,regular=0,faces=8)),
 'tetraedre':(pyramid(3,2**.5),dict(tri=1,quad=0,punta=1,bases=0,regular=1,faces=4)),
 'piramide4':(pyramid(4,1.7),dict(tri=1,quad=1,punta=1,bases=0,regular=0,faces=5)),
 'piramide5':(pyramid(5,1.7),dict(tri=1,quad=0,punta=1,bases=0,regular=0,faces=6)),
 'piramide6':(pyramid(6,1.6),dict(tri=1,quad=0,punta=1,bases=0,regular=0,faces=7)),
 'octaedre':([(1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1)],dict(tri=1,quad=0,punta=0,bases=0,regular=1,faces=8)),
 'icosaedre':([(0,a,b*phi) for a in (1,-1) for b in (1,-1)]+[(a,b*phi,0) for a in (1,-1) for b in (1,-1)]+[(b*phi,0,a) for a in (1,-1) for b in (1,-1)],dict(tri=1,quad=0,punta=0,bases=0,regular=1,faces=20)),
 'dodecaedre':([(x,y,z) for x in (1,-1) for y in (1,-1) for z in (1,-1)]+[(0,a/phi,b*phi) for a in (1,-1) for b in (1,-1)]+[(a/phi,b*phi,0) for a in (1,-1) for b in (1,-1)]+[(b*phi,0,a/phi) for a in (1,-1) for b in (1,-1)],dict(tri=0,quad=0,punta=0,bases=0,regular=1,faces=12)),
}
def ell(cx,cy,rx,ry,a0,a1,n=40):
    return ' '.join(f'{cx+rx*math.cos(a0+(a1-a0)*i/n):.1f},{cy+ry*math.sin(a0+(a1-a0)*i/n):.1f}' for i in range(n+1))
def curved(kind,tilt=0.32):
    o=[]; S='stroke="#000" stroke-width="2.2" fill="none"'; D='stroke="#555" stroke-width="1.4" stroke-dasharray="3.5 3" fill="none"'
    if kind=='cilindre':
        rx,ry=26,26*tilt; top,bot=20,80
        o.append(f'<path d="M{50-rx},{top} L{50-rx},{bot} A{rx},{ry} 0 0 0 {50+rx},{bot} L{50+rx},{top} Z" fill="#d9d9d9" stroke="none"/>')
        o.append(f'<polyline points="{ell(50,bot,rx,ry,math.pi,2*math.pi)}" {D}/>')
        o.append(f'<polyline points="{ell(50,bot,rx,ry,0,math.pi)}" {S}/>')
        o.append(f'<line x1="{50-rx}" y1="{top}" x2="{50-rx}" y2="{bot}" {S}/><line x1="{50+rx}" y1="{top}" x2="{50+rx}" y2="{bot}" {S}/>')
        o.append(f'<ellipse cx="50" cy="{top}" rx="{rx}" ry="{ry:.1f}" fill="#f2f2f2" stroke="#000" stroke-width="2.2"/>')
    elif kind=='con':
        rx,ry=30,30*tilt; ap,bot=12,80
        o.append(f'<path d="M50,{ap} L{50-rx},{bot} A{rx},{ry} 0 0 0 {50+rx},{bot} Z" fill="#d9d9d9" stroke="none"/>')
        o.append(f'<polyline points="{ell(50,bot,rx,ry,math.pi,2*math.pi)}" {D}/>')
        o.append(f'<polyline points="{ell(50,bot,rx,ry,0,math.pi)}" {S}/>')
        o.append(f'<line x1="50" y1="{ap}" x2="{50-rx}" y2="{bot}" {S} stroke-linecap="round"/><line x1="50" y1="{ap}" x2="{50+rx}" y2="{bot}" {S} stroke-linecap="round"/>')
    elif kind=='esfera':
        r=36; o.append(f'<circle cx="50" cy="50" r="{r}" fill="#e3e3e3" stroke="#000" stroke-width="2.2"/>')
        o.append(f'<polyline points="{ell(50,50,r,r*tilt,math.pi,2*math.pi)}" {D}/>')
        o.append(f'<polyline points="{ell(50,50,r,r*tilt,0,math.pi)}" stroke="#000" stroke-width="1.6" fill="none"/>')
        o.append('<ellipse cx="38" cy="36" rx="8" ry="5" fill="#fff" opacity=".8"/>')
    elif kind=='semiesfera':
        r=38; cy=66
        o.append(f'<path d="M{50-r},{cy} A{r},{r} 0 0 1 {50+r},{cy} A{r},{r*tilt} 0 0 1 {50-r},{cy} Z" fill="#e3e3e3" stroke="none"/>')
        o.append(f'<path d="M{50-r},{cy} A{r},{r} 0 0 1 {50+r},{cy}" {S}/>')
        o.append(f'<polyline points="{ell(50,cy,r,r*tilt,math.pi,2*math.pi)}" {D}/>')
        o.append(f'<polyline points="{ell(50,cy,r,r*tilt,0,math.pi)}" {S}/>')
    return ''.join(o)
CUR={'cilindre':dict(tri=0,quad=0,punta=0,bases=1,regular=0,faces=3),'con':dict(tri=0,quad=0,punta=1,bases=0,regular=0,faces=2),
     'esfera':dict(tri=0,quad=0,punta=0,bases=0,regular=0,faces=1),'semiesfera':dict(tri=0,quad=0,punta=0,bases=0,regular=0,faces=2)}
SOL_P=[('corba',"És l'únic amb alguna superfície corba","És l'únic que és un poliedre"),
       ('tri',"És l'únic amb alguna cara triangular","És l'únic sense cap cara triangular"),
       ('quad',"És l'únic amb alguna cara quadrada o rectangular","És l'únic sense cap cara quadrada ni rectangular"),
       ('punta',"És l'únic que és una piràmide o un con","És l'únic que no és ni una piràmide ni un con"),
       ('bases',"És l'únic que és un prisma o un cilindre","És l'únic que no és ni un prisma ni un cilindre"),
       ('regular',"És l'únic poliedre regular","És l'únic que no és un poliedre regular"),
       ('mes6',"És l'únic poliedre de més de 6 cares","És l'únic que no és un poliedre de més de 6 cares"),
       ('cara5',"És l'únic amb alguna cara pentagonal o hexagonal","És l'únic sense cares pentagonals ni hexagonals"),
       ('vertex',"És l'únic sense cap vèrtex","És l'únic que té algun vèrtex")]
C5={'prisma5','prisma6','piramide5','piramide6','dodecaedre'}
def sol_domain():
    items=[]
    views=[(25,22),(-40,30)]
    for k,(V,pr) in SOL.items():
        Vn,faces=hull_faces(V)
        Vn=Vn-Vn.mean(0)
        for yaw,pitch in (views if k!='prisma3' else [(40,26),(-15,30)]):
            if k=='ortoedre' and yaw<0: yaw,pitch=-28,26
            p=[0,pr['tri'],pr['quad'],pr['punta'],pr['bases'],pr['regular'],int(pr['faces']>6),int(k in C5),0]
            nf=len(faces); assert nf==pr['faces'],(k,nf)
            items.append({'k':k,'p':p,'svg':poly_svg(Vn,faces,yaw,pitch,k not in ('icosaedre','dodecaedre'))})
    for k,pr in CUR.items():
        for t in (0.30,0.38):
            p=[1,0,0,pr['punta'],pr['bases'],0,0,0,int(k!='con')]
            items.append({'k':k,'p':p,'svg':curved(k,t)})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in SOL_P]
if __name__=='__main__':
    it,pr=sol_domain(); print(len(it))
    html='<html><body style="background:#fff">'+''.join(f'<div style="display:inline-block;margin:4px;text-align:center;font:10px sans-serif"><svg viewBox="0 0 100 100" width="110" height="110" style="border:1px solid #ccc">{x["svg"]}</svg><br>{x["k"]}</div>' for x in it)+'</body></html>'
    open('/tmp/solids.html','w').write(html)
