import math
def angles(pts):
    n=len(pts); out=[]
    # interior angles (degrees) of a simple polygon, orientation-aware
    A2=sum(pts[i][0]*pts[(i+1)%n][1]-pts[(i+1)%n][0]*pts[i][1] for i in range(n)); s=1 if A2>0 else -1
    for i in range(n):
        p,q,r=pts[i-1],pts[i],pts[(i+1)%n]
        a=math.atan2(p[1]-q[1],p[0]-q[0]); b=math.atan2(r[1]-q[1],r[0]-q[0])
        d=math.degrees((a-b)*s)%360
        out.append(d)
    return out
def area(pts):
    n=len(pts); return abs(sum(pts[i][0]*pts[(i+1)%n][1]-pts[(i+1)%n][0]*pts[i][1] for i in range(n)))/2
def perim(pts):
    n=len(pts); return sum(math.dist(pts[i],pts[(i+1)%n]) for i in range(n))
def fat(pts): return 4*math.pi*area(pts)/perim(pts)**2   # 1 = circle; square .785; equilateral .605
def ok(pts,minang,minfat):
    ang=angles(pts); return min(ang)>=minang and fat(pts)>=minfat
