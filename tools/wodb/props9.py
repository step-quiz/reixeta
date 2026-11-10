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
def has45(pts):       # cos 45° = u·v / (|u||v|)  <=>  u·v > 0 and 2 (u·v)² = |u|² |v|²
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

TRI = [("És l'únic que fa un nombre enter de quadrets d'àrea", "És l'únic que no fa un nombre enter de quadrets d'àrea", lambda x: area2(T(x)) % 2 == 0),
       ("És l'únic amb un angle de 45°", "És l'únic sense cap angle de 45°", lambda x: has45(T(x)))]
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

# ---------- LLE: from the stroke font (letters.F) ----------
def _arc(p0, rx, ry, large, sweep, p1, n=600):
    """SVG elliptical arc (x-axis-rotation 0) -> polyline."""
    x1, y1 = (p0[0] - p1[0]) / 2, (p0[1] - p1[1]) / 2
    lam = x1 * x1 / (rx * rx) + y1 * y1 / (ry * ry)
    if lam > 1: rx *= math.sqrt(lam); ry *= math.sqrt(lam)
    num = max(0, rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1); den = rx * rx * y1 * y1 + ry * ry * x1 * x1
    k = (-1 if large == sweep else 1) * math.sqrt(num / den) if den else 0
    cxp, cyp = k * rx * y1 / ry, -k * ry * x1 / rx
    cx, cy = cxp + (p0[0] + p1[0]) / 2, cyp + (p0[1] + p1[1]) / 2
    a0 = math.atan2((y1 - cyp) / ry, (x1 - cxp) / rx); a1 = math.atan2((-y1 - cyp) / ry, (-x1 - cxp) / rx); da = a1 - a0
    if sweep and da < 0: da += 2 * math.pi
    if not sweep and da > 0: da -= 2 * math.pi
    return [(cx + rx * math.cos(a0 + da * i / n), cy + ry * math.sin(a0 + da * i / n)) for i in range(n + 1)]
def strokes(d):
    """Path (M, L, H, V, A absolute) -> list of (kind, polyline); kind 'l' = straight, 'a' = curved."""
    tok = re.findall(r'[MLHVA]|-?\d+\.?\d*', d); i = 0; cur = None; out = []
    while i < len(tok):
        c = tok[i]; i += 1
        if c == 'M': cur = (float(tok[i]), float(tok[i + 1])); i += 2
        elif c == 'L': p = (float(tok[i]), float(tok[i + 1])); i += 2; out.append(('l', [cur, p])); cur = p
        elif c == 'H': p = (float(tok[i]), cur[1]); i += 1; out.append(('l', [cur, p])); cur = p
        elif c == 'V': p = (cur[0], float(tok[i])); i += 1; out.append(('l', [cur, p])); cur = p
        elif c == 'A':
            rx, ry, _, lg, sw, x, y = [float(t) for t in tok[i:i + 7]]; i += 7; p = (x, y)
            out.append(('a', _arc(cur, rx, ry, int(lg), int(sw), p))); cur = p
    return out
def branches(d, r=4.0):
    """Largest number of line branches leaving one point of the letter: count how many times the strokes
    cross a small circle centred on each candidate point (stroke ends and stroke intersections)."""
    S = []
    for k, pl in strokes(d):
        if k == 'l':
            (x0, y0), (x1, y1) = pl; m = max(2, int(math.dist(pl[0], pl[1]) / .2)); pl = [(x0 + (x1 - x0) * t / m, y0 + (y1 - y0) * t / m) for t in range(m + 1)]
        S.append(pl)
    cands = [pl[0] for pl in S] + [pl[-1] for pl in S]
    for a in range(len(S)):
        for b in range(a + 1, len(S)):
            for p in S[a][::3]:
                if min(math.dist(p, q) for q in S[b]) < .35: cands.append(p)
    best = 0
    for c in cands:
        n = 0
        for pl in S:
            ins = [math.dist(p, c) < r for p in pl]
            n += sum(1 for u, v in zip(ins, ins[1:]) if u != v)
        best = max(best, n)
    return best
def _path(x):
    from letters import F
    return F[x['ch']]
# Owner decision (2026-11-10): the Q does not count as a junction letter, although its tail crosses the oval (4 branches).
NO_JUNCTION = {'Q'}
LLE = [("És l'única amb algun punt d'on surten tres línies o més", "És l'única sense cap punt d'on surtin tres línies o més", lambda x: branches(_path(x)) >= 3 and x['ch'] not in NO_JUNCTION),
       ("És l'única que barreja línies rectes i corbes", "És l'única que no barreja línies rectes i corbes", lambda x: {k for k, _ in strokes(_path(x))} == {'l', 'a'})]

# ---------- COS: face lists (number of sides of every flat face); round solids have no polygonal faces ----------
FACES = {'cub': [4] * 6, 'ortoedre': [4] * 6, 'prisma3': [3, 3, 4, 4, 4], 'prisma5': [5, 5] + [4] * 5, 'prisma6': [6, 6] + [4] * 6,
         'tetraedre': [3] * 4, 'piramide4': [4] + [3] * 4, 'piramide5': [5] + [3] * 5, 'piramide6': [6] + [3] * 6, 'octaedre': [3] * 8,
         'cilindre': [], 'con': [], 'esfera': [], 'semiesfera': []}
COS = [("És l'únic amb cares planes de dues formes diferents", "És l'únic que no té cares planes de dues formes diferents", lambda x: len(set(FACES[x['k']])) == 2),
       ("És l'únic amb exactament 5 cares", "És l'únic que no té exactament 5 cares", lambda x: len(FACES[x['k']]) == 5)]

# ---------- FRA: x = (a, b) as written ----------
def one_decimal(a, b): v = Fr(a, b); return (v * 10).denominator == 1 and v.denominator != 1
def perfect_square(a, b): v = Fr(a, b); return issquare(v.numerator) and issquare(v.denominator)
FRA = [("És l'única amb un sol decimal", "És l'única que no té un sol decimal", lambda a, b: one_decimal(a, b)),            # 3/5 = 0,6
       ("És l'única amb els dos termes parells", "És l'única que no té els dos termes parells", lambda a, b: a % 2 == 0 and b % 2 == 0),
       ("És l'única amb els dos termes primers", "És l'única que no té els dos termes primers", lambda a, b: isprime(a) and isprime(b)),
       ("És l'única que és un quadrat perfecte", "És l'única que no és un quadrat perfecte", lambda a, b: perfect_square(a, b))]

# ---------- POL (review of 2026-11-10, point E2): with these two, POL reaches the 5/12 rule ----------
def _cells(x): return {tuple(c) for c in x['cells']}
def _norm(S): mx = min(a for a, _ in S); my = min(b for _, b in S); return frozenset((a - mx, b - my) for a, b in S)
def pol_diag(x): S = _cells(x); return _norm(S) == _norm({(b, a) for a, b in S}) or _norm(S) == _norm({(-b, -a) for a, b in S})
def pol_tips(x): S = _cells(x); return sum(1 for a, b in S if sum((a + da, b + db) in S for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1))) == 1)
POL = [("És l'únic amb un eix de simetria en diagonal", "És l'únic sense cap eix de simetria en diagonal", pol_diag),
       ("És l'únic amb exactament dos quadrats que només en toquen un", "És l'únic que no té exactament dos quadrats que només en toquen un", lambda x: pol_tips(x) == 2)]
# Tried and rejected for COS: "more than 10 edges" (cap 5 was never reached in 600 heavy searches, with or without it).

EXTRA = {'TR5': TRI, 'TR4': TRI, 'QUA': QUA, 'FIG': FIG, 'LLE': LLE, 'COS': COS, 'POL': POL}

if __name__ == '__main__':
    from letters import F
    from domains import SHAPES
    print('LLE junction (3+ branches, minus NO_JUNCTION):', ''.join(ch for ch in F if branches(F[ch]) >= 3 and ch not in NO_JUNCTION), {ch: branches(F[ch]) for ch in F})
    print('LLE straight+curved:', ''.join(ch for ch in F if {k for k, _ in strokes(F[ch])} == {'l', 'a'}))
    for k, P in SHAPES.items():
        a = fig_angles(P); print(f'FIG {k:14s} obtuse={int(any(90+1e-6<x<180-1e-6 for x in a))} equal={int(max(a)-min(a)<1e-6)} axes={fig_axes(P)}')
    for k, f in FACES.items(): print(f'COS {k:10s} faces={len(f)} two_shapes={int(len(set(f))==2)}')
