import math
h=math.sqrt(3)/2; s3=math.sqrt(3)
def tr(P,v): return [(x+v[0],y+v[1]) for x,y in P]
def reg(c,n,R,a0): return [(c[0]+R*math.cos(a0+2*math.pi*k/n),c[1]+R*math.sin(a0+2*math.pi*k/n)) for k in range(n)]
def lat(a,b,cell,N=7):
    out=[]
    for i in range(-N,N+1):
        for j in range(-N,N+1):
            v=(i*a[0]+j*b[0],i*a[1]+j*b[1])
            for P,tag in cell: out.append((tr(P,v),tag))
    return out
def T_square(): return lat((1,0),(0,1),[([(0,0),(1,0),(1,1),(0,1)],4)])
def T_tri(): return lat((1,0),(.5,h),[([(0,0),(1,0),(.5,h)],3),([(1,0),(1.5,h),(.5,h)],3)])
def T_hex(): return lat((s3,0),(s3/2,1.5),[(reg((0,0),6,1,math.pi/6),6)])
def T_trihex(): return lat((2,0),(1,s3),[(reg((0,0),6,1,0),6),([(1,0),(1.5,h),(.5,h)],3),([(1,0),(.5,-h),(1.5,-h)],3)])
def T_488():
    w=1+math.sqrt(2); return lat((w,0),(0,w),[(reg((0,0),8,1/(2*math.sin(math.pi/8)),math.pi/8),8),(reg((w/2,w/2),4,math.sqrt(2)/2,0),4)])
def T_3464():
    d=1+s3; a=(d*math.cos(math.pi/6),d*math.sin(math.pi/6)); b=(0,d)
    H=reg((0,0),6,1,0); cell=[(H,6)]
    V=lambda k:(math.cos(k*math.pi/3),math.sin(k*math.pi/3)); U=lambda deg:(math.cos(math.radians(deg)),math.sin(math.radians(deg)))
    for k,deg in ((0,30),(1,90),(2,150)):
        p,q=V(k),V(k+1); u=U(deg); cell.append(([p,q,(q[0]+u[0],q[1]+u[1]),(p[0]+u[0],p[1]+u[1])],4))
    for k,(d1,d2) in ((1,(30,90)),(2,(90,150))):
        p=V(k); u1=U(d1); u2=U(d2); cell.append(([p,(p[0]+u1[0],p[1]+u1[1]),(p[0]+u2[0],p[1]+u2[1])],3))
    return lat(a,b,cell)
def T_31212():
    r=(2+s3)/2; R=1/(2*math.sin(math.pi/12)); a=(2*r,0); b=(r,2*r*h)
    cell=[(reg((0,0),12,R,math.pi/12),12)]
    for deg in (30,90):
        t=math.radians(deg); p=(R*math.cos(t-math.pi/12),R*math.sin(t-math.pi/12)); q=(R*math.cos(t+math.pi/12),R*math.sin(t+math.pi/12))
        m=((p[0]+q[0])/2,(p[1]+q[1])/2); apex=(m[0]+h*math.cos(t),m[1]+h*math.sin(t)); cell.append(([p,q,apex],3))
    return lat(a,b,cell)
def T_4612():
    r=(2+s3)/2; R=1/(2*math.sin(math.pi/12)); D=2*r+1; a=(D,0); b=(D/2,D*h)
    cell=[(reg((0,0),12,R,math.pi/12),12)]
    for deg in (0,60,120):
        t=math.radians(deg); p=(R*math.cos(t-math.pi/12),R*math.sin(t-math.pi/12)); q=(R*math.cos(t+math.pi/12),R*math.sin(t+math.pi/12))
        u=(math.cos(t),math.sin(t)); cell.append(([p,q,(q[0]+u[0],q[1]+u[1]),(p[0]+u[0],p[1]+u[1])],4))
    for deg in (30,90):
        t=math.radians(deg); c=((r+h)*math.cos(t),(r+h)*math.sin(t)); cell.append((reg(c,6,1,t+math.pi/6),6))
    return lat(a,b,cell)
def T_33344(): return lat((1,0),(.5,1+h),[([(0,0),(1,0),(1,1),(0,1)],4),([(0,1),(1,1),(.5,1+h)],3),([(1,1),(1.5,1+h),(.5,1+h)],3)])
def T_brick(): return lat((2,0),(1,1),[([(0,0),(2,0),(2,1),(0,1)],'r')])
def T_rhombille():
    H=reg((0,0),6,1,math.pi/6); cell=[([(0,0),H[(2*i)%6],H[(2*i+1)%6],H[(2*i+2)%6]],'rh%d'%i) for i in range(3)]
    return lat((s3,0),(s3/2,1.5),cell)
def T_par(): return lat((1.4,0),(.6,1),[([(0,0),(1.4,0),(2.0,1),(.6,1)],'p')])
def T_isos(): return lat((1,0),(.5,1.3),[([(0,0),(1,0),(.5,1.3)],'i'),([(1,0),(1.5,1.3),(.5,1.3)],'i2')])
def T_houses(): return lat((1,0),(.5,2.5),[([(0,0),(1,0),(1,1),(.5,1.5),(0,1)],5),([(.5,1.5),(1,1),(1.5,1.5),(1.5,2.5),(.5,2.5)],5)])
def T_pyth(): return lat((2,1),(-1,2),[([(0,0),(2,0),(2,2),(0,2)],4),([(2,0),(3,0),(3,1),(2,1)],4)])
#            iguals regulars tri quad hex gran tres pent
TILINGS={
 'quadrats':(T_square,2.0,[1,1,0,1,0,0,0,0,1,1,1]),
 'triangles':(T_tri,1.7,[1,1,1,0,0,0,0,0,0,0,1]),
 'hexagons':(T_hex,2.4,[1,1,0,0,1,0,1,0,0,0,0]),
 'trihexagonal':(T_trihex,3.0,[0,1,1,0,1,0,0,0,1,0,1]),
 '4.8.8':(T_488,2.6,[0,1,0,1,0,1,1,0,0,1,0]),
 '3.4.6.4':(T_3464,3.0,[0,1,1,1,1,0,0,0,1,1,0]),
 '3.12.12':(T_31212,3.6,[0,1,1,0,0,1,1,0,0,0,0]),
 '4.6.12':(T_4612,4.6,[0,1,0,1,1,1,1,0,0,1,0]),
 '3.3.3.4.4':(T_33344,2.0,[0,1,1,1,0,0,0,0,0,1,1]),
 'maons':(T_brick,2.5,[1,0,0,0,0,0,1,0,0,1,1]),
 'rombes':(T_rhombille,2.0,[1,0,0,0,0,0,0,0,0,0,0]),
 'paral·lelograms':(T_par,2.0,[1,0,0,0,0,0,0,0,1,0,1]),
 'isòsceles':(T_isos,1.8,[1,0,1,0,0,0,0,0,0,0,1]),
 'cases':(T_houses,2.0,[1,0,0,0,0,0,0,1,0,1,1]),
 'pitagòric':(T_pyth,3.0,[0,1,0,1,0,0,1,0,0,1,0]),
}
MOS_P=[('iguals',"És l'únic on totes les peces són iguals","És l'únic on no totes les peces són iguals"),
       ('regulars',"És l'únic on totes les peces són polígons regulars","És l'únic amb peces que no són polígons regulars"),
       ('tri',"És l'únic amb triangles","És l'únic sense triangles"),
       ('quad',"És l'únic amb quadrats","És l'únic sense quadrats"),
       ('hex',"És l'únic amb hexàgons","És l'únic sense hexàgons"),
       ('gran',"És l'únic amb peces de més de 6 costats","És l'únic sense peces de més de 6 costats"),
       ('tres',"És l'únic on a cada vèrtex hi arriben exactament 3 peces","És l'únic on no a tots els vèrtexs hi arriben 3 peces"),
       ('pent',"És l'únic amb pentàgons","És l'únic sense pentàgons"),
       ('quatre',"És l'únic on a cada vèrtex hi arriben exactament 4 peces","És l'únic on no a tots els vèrtexs hi arriben 4 peces"),
       ('angrecte',"És l'únic amb peces que tenen angles rectes","És l'únic sense cap angle recte"),
       ('linia',"És l'únic amb línies rectes que travessen tot el mosaic","És l'únic sense cap línia recta que travessi tot el mosaic")]
FILL={3:'#bdbdbd',4:'#ffffff',5:'#dedede',6:'#cfcfcf',8:'#ebebeb',12:'#f5f5f5','r':'#ffffff','p':'#ffffff','i':'#c8c8c8','i2':'#ffffff','rh0':'#ffffff','rh1':'#bdbdbd','rh2':'#7d7d7d'}
def clip(P,lo,hi):
    def cl(P,inside,inter):
        out=[]
        for i in range(len(P)):
            A,B=P[i-1],P[i]
            if inside(B):
                if not inside(A): out.append(inter(A,B))
                out.append(B)
            elif inside(A): out.append(inter(A,B))
        return out
    for ax in (0,1):
        for bound,sg in ((lo,1),(hi,-1)):
            if not P: return P
            ins=lambda p,ax=ax,bound=bound,sg=sg: sg*(p[ax]-bound)>=0
            def it(A,B,ax=ax,bound=bound):
                t=(bound-A[ax])/(B[ax]-A[ax]); return (A[0]+t*(B[0]-A[0]),A[1]+t*(B[1]-A[1]))
            P=cl(P,ins,it)
    return P
def svg(name,rot=0.0,scale=1.0):
    gen,span,_=TILINGS[name]; polys=gen(); span*=scale
    c,s=math.cos(rot),math.sin(rot); k=88/(2*span)
    out=[]
    for P,tag in polys:
        Q=[(50+k*(x*c-y*s),50-k*(x*s+y*c)) for x,y in P]
        Q=clip(Q,6,94)
        if len(Q)<3: continue
        out.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in Q)}" fill="{FILL[tag]}" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>')
    out.append('<rect x="6" y="6" width="88" height="88" fill="none" stroke="#000" stroke-width="2.2"/>')
    return ''.join(out)
def mos_domain():
    items=[]
    for name,(g,span,p) in TILINGS.items():
        for rot,sc in ((0.0,1.0),(math.radians(30) if name not in ('quadrats','pitagòric','maons') else math.radians(20),1.15)):
            items.append({'k':name,'p':p,'svg':svg(name,rot,sc)})
    return items,[{'id':a,'yes':y,'no':n} for a,y,n in MOS_P]
if __name__=='__main__':
    it,_=mos_domain()
    html='<html><body style="background:#fff">'+''.join(f'<div style="display:inline-block;margin:4px;text-align:center;font:10px sans-serif"><svg viewBox="0 0 100 100" width="120" height="120">{x["svg"]}</svg><br>{x["k"]}</div>' for x in it)+'</body></html>'
    open('/tmp/mos.html','w').write(html); print(len(it))
