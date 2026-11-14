"""Round-9 properties (owner's choice, 2026-11-09). Each one is computed from the item's own data.
export_bancs.py appends them to the existing bitmasks: EXTRA[code] = [(si, no, test(item)), ...]."""
import math, re
from fractions import Fraction as Fr

def isprime(n): return n > 1 and all(n % d for d in range(2, int(n ** .5) + 1))
def issquare(n): return int(round(n ** .5)) ** 2 == n

# ---------- lattice polygons (TR5, TR4, QUA): exact integer arithmetic ----------
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def cross(a, b): return a[0] * b[1] - a[1] * b[0]
def L2(a): return dot(a, a)
def area2(pts): return abs(sum(cross(pts[i], pts[(i + 1) % len(pts)]) for i in range(len(pts))))
def orient(pts): return 1 if sum(cross(pts[i], pts[(i + 1) % len(pts)]) for i in range(len(pts))) > 0 else -1
def corners(pts):
    """(u, v, convex) for every vertex: u, v = vectors to the previous and next vertex."""
    n = len(pts); s = orient(pts); out = []
    for i in range(n):
        p, q, r = pts[i - 1], pts[i], pts[(i + 1) % n]
        out.append((sub(p, q), sub(r, q), cross(sub(q, p), sub(r, q)) * s > 0))
    return out
    return any(cv and dot(u, v) > 0 and 2 * dot(u, v) ** 2 == L2(u) * L2(v) for u, v, cv in corners(pts))
def has_obtuse(pts):  # interior angle strictly between 90° and 180° (a reflex angle is not obtuse)
    return any(cv and dot(u, v) < 0 for u, v, cv in corners(pts))
def reflect(p, a, b):
    d = sub(b, a); t = Fr(dot(sub(p, a), d), L2(d)); f = (a[0] + t * d[0], a[1] + t * d[1])
    return (2 * f[0] - p[0], 2 * f[1] - p[1])
def quad_axis(q):     # exact (fractions); same test as dots.has_axis
    q = [tuple(Fr(c) for c in p) for p in q]
    for i in range(4):
        if reflect(q[(i + 1) % 4], q[i], q[(i + 2) % 4]) == q[(i + 3) % 4]: return True
    for i in range(2):
        m1 = ((q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2)
        m2 = ((q[i + 2][0] + q[(i + 3) % 4][0]) / 2, (q[i + 2][1] + q[(i + 3) % 4][1]) / 2)
        if m1 != m2 and reflect(q[i], m1, m2) == q[i + 1] and reflect(q[i + 2], m1, m2) == q[(i + 3) % 4]: return True
    return False
def T(x): return [tuple(p) for p in x['pts']]

QUA = [("És l'únic amb algun eix de simetria", "És l'únic sense cap eix de simetria", lambda x: quad_axis(T(x))),
       ("És l'únic amb les diagonals iguals", "És l'únic amb les diagonals diferents", lambda x: L2(sub(T(x)[2], T(x)[0])) == L2(sub(T(x)[3], T(x)[1]))),
       ("És l'únic amb algun parell de costats iguals", "És l'únic amb tots els costats diferents", lambda x: len({L2(sub(T(x)[(i + 1) % 4], T(x)[i])) for i in range(4)}) < 4),
       ("És l'únic amb algun angle obtús", "És l'únic sense cap angle obtús", lambda x: has_obtuse(T(x)))]

# ---------- FIG: from the exact coordinates in domains.SHAPES (item key = shape name) ----------
def fig_angles(P):
    n = len(P); s = 1 if sum(P[i][0] * P[(i + 1) % n][1] - P[(i + 1) % n][0] * P[i][1] for i in range(n)) > 0 else -1; out = []
    for i in range(n):
        p, q, r = P[i - 1], P[i], P[(i + 1) % n]
        a = math.atan2(p[1] - q[1], p[0] - q[0]); b = math.atan2(r[1] - q[1], r[0] - q[0])
        out.append(math.degrees((a - b) * s) % 360)
    return out
def fig_axes(P):
    """Number of symmetry axes (they all pass through the centroid of the vertices)."""
    n = len(P); cx = sum(p[0] for p in P) / n; cy = sum(p[1] for p in P) / n; dirs = []
    cands = [P[i] for i in range(n)] + [((P[i][0] + P[(i + 1) % n][0]) / 2, (P[i][1] + P[(i + 1) % n][1]) / 2) for i in range(n)]
    for q in cands:
        dx, dy = q[0] - cx, q[1] - cy; d = math.hypot(dx, dy)
        if d < 1e-9: continue
        ux, uy = dx / d, dy / d
        def refl(p):
            vx, vy = p[0] - cx, p[1] - cy; t = vx * ux + vy * uy
            return (cx + 2 * t * ux - vx, cy + 2 * t * uy - vy)
        Q = [refl(p) for p in P]   # the mirror image must be the same polygon: same vertices, in reverse cyclic order
        if any(all(math.hypot(Q[(s - i) % n][0] - P[i][0], Q[(s - i) % n][1] - P[i][1]) < 1e-6 for i in range(n)) for s in range(n)):
            ang = math.atan2(uy, ux) % math.pi
            if not any(min(abs(ang - a), math.pi - abs(ang - a)) < 1e-6 for a in dirs): dirs.append(ang)
    return len(dirs)
def _shape(x):
    from domains import SHAPES
    return SHAPES[x['k']]
FIG = [("És l'única amb algun angle obtús", "És l'única sense cap angle obtús", lambda x: any(90 + 1e-6 < a < 180 - 1e-6 for a in fig_angles(_shape(x)))),
       ("És l'única amb tots els angles iguals", "És l'única que no té tots els angles iguals", lambda x: max(fig_angles(_shape(x))) - min(fig_angles(_shape(x))) < 1e-6),
       ("És l'única amb més d'un eix de simetria", "És l'única que no té més d'un eix de simetria", lambda x: fig_axes(_shape(x)) > 1)]

# ---------- FRA: x = (a, b) as written ----------
def one_decimal(a, b): v = Fr(a, b); return (v * 10).denominator == 1 and v.denominator != 1
def perfect_square(a, b): v = Fr(a, b); return issquare(v.numerator) and issquare(v.denominator)
FRA = [("És l'única amb un sol decimal", "És l'única que no té un sol decimal", lambda a, b: one_decimal(a, b)),            # 3/5 = 0,6
       ("És l'única amb els dos termes parells", "És l'única que no té els dos termes parells", lambda a, b: a % 2 == 0 and b % 2 == 0),
       ("És l'única amb els dos termes primers", "És l'única que no té els dos termes primers", lambda a, b: isprime(a) and isprime(b)),
       ("És l'única que és un quadrat perfecte", "És l'única que no és un quadrat perfecte", lambda a, b: perfect_square(a, b))]

# Round 15 (2026-11-14): LLE (letters), TR5/TR4 (triangles), POL and COS were removed; their properties went with them.
EXTRA = {'QUA': QUA, 'FIG': FIG}

if __name__ == '__main__':
    from domains import SHAPES
    for k, P in SHAPES.items():
        a = fig_angles(P); print(f'FIG {k:14s} obtuse={int(any(90+1e-6<x<180-1e-6 for x in a))} equal={int(max(a)-min(a)<1e-6)} axes={fig_axes(P)}')
