"""LIN bank (round 15, 2026-11-14): line figures on an invisible 3x3 grid of nodes, replacing the letters (LLE).

Pieces (unit level, all endpoints are grid nodes):
  's'  unit segment: horizontal, vertical or diagonal of a unit square
  'h'  semicircle of radius 1/2 on a horizontal or vertical unit segment (bulging to one side)
  'q'  quarter circle of radius 1 centred at a node (endpoints at distance 1, perpendicular)
A figure is a connected set of pieces whose pieces meet only at grid nodes (no interior crossings or overlaps),
so it is a plane graph: holes = E - V + 1. Coordinates are DOUBLED (grid nodes 0, 2, 4) so every transform used
below (mirror about x = c, y = c, the diagonals, half turn) stays in integers and comparisons are exact.

Usage: python3 linies.py  ->  writes out_lin.json (items with properties) and lin_mostra.html (contact sheet)."""
import json, math, random, itertools, sys
N = [(x, y) for x in (0, 2, 4) for y in (0, 2, 4)]
def key_piece(p):
    t, a, b = p[0], p[1], p[2]
    e = tuple(sorted([a, b]))
    return (t, e) + tuple(p[3:])
PIECES = []
for a in N:
    for b in N:
        if a >= b: continue
        dx, dy = b[0] - a[0], b[1] - a[1]
        if (abs(dx), abs(dy)) in ((2, 0), (0, 2), (2, 2)): PIECES.append(('s', a, b))
        if (abs(dx), abs(dy)) in ((2, 0), (0, 2)):
            mx, my = (a[0] + b[0]) // 2, (a[1] + b[1]) // 2
            nx, ny = (0, 1) if dy == 0 else (1, 0)
            for s in (1, -1): PIECES.append(('h', a, b, (mx + s * nx, my + s * ny)))
        if (abs(dx), abs(dy)) == (2, 2):
            for c in ((a[0], b[1]), (b[0], a[1])):
                if c in N: PIECES.append(('q', a, b, c))
PIECES = [key_piece(p) for p in PIECES]
def samples(p, n=40):
    t, (a, b) = p[0], p[1]
    if t == 's': return [(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n) for i in range(n + 1)]
    if t == 'h':
        m = p[2]; cx, cy = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2; r = 1.0
        a0 = math.atan2(a[1] - cy, a[0] - cx); am = math.atan2(m[1] - cy, m[0] - cx)
        d = (am - a0 + math.pi) % (2 * math.pi) - math.pi   # +-pi/2
        return [(cx + r * math.cos(a0 + 2 * d * i / n), cy + r * math.sin(a0 + 2 * d * i / n)) for i in range(n + 1)]
    c = p[2]; r = 2.0
    a0 = math.atan2(a[1] - c[1], a[0] - c[0]); a1 = math.atan2(b[1] - c[1], b[0] - c[0])
    d = (a1 - a0 + math.pi) % (2 * math.pi) - math.pi
    return [(c[0] + r * math.cos(a0 + d * i / n), c[1] + r * math.sin(a0 + d * i / n)) for i in range(n + 1)]
SMP = {p: samples(p) for p in PIECES}
def clash(p, q):
    """True if p and q touch anywhere except at a shared endpoint (crossing, overlap or tangency)."""
    ends = set(p[1]) & set(q[1])
    A = [x for x in SMP[p] if all(math.dist(x, e) > .25 for e in ends)]
    B = [x for x in SMP[q] if all(math.dist(x, e) > .25 for e in ends)]
    if any(math.dist(x, y) < .12 for x in A for y in B): return True
    if len(ends) == 2 and p[0] == q[0] == 's': return True
    if len(ends) == 2 and p[0] == q[0] and p[2:] == q[2:]: return True
    return False
CL = {(p, q): clash(p, q) for p in PIECES for q in PIECES if p < q}
def ok_add(S, q): return all(not CL[(min(p, q), max(p, q))] for p in S)
def nodes(S): return {e for p in S for e in p[1]}
# ---------- transforms (doubled coords) ----------
def tf_point(f, pt): return f(pt)
def tf_piece(f, p):
    a, b = p[1]; q = (p[0], f(a), f(b)) + tuple(f(x) for x in p[2:])
    return key_piece(q)
def tf_set(f, S): return frozenset(tf_piece(f, p) for p in S)
def mirrors_v(): return [lambda p, c=c: (c - p[0], p[1]) for c in range(-4, 9)]
def mirrors_h(): return [lambda p, c=c: (p[0], c - p[1]) for c in range(-4, 9)]
def mirrors_d(): return [lambda p, k=k: (p[1] - k, p[0] + k) for k in range(-8, 9)] + [lambda p, k=k: (k - p[1], k - p[0]) for k in range(-4, 13)]
def halfturns(): return [lambda p, X=X, Y=Y: (X - p[0], Y - p[1]) for X in range(0, 9) for Y in range(0, 9)]
def sym(S, fs): return any(tf_set(f, S) == S for f in fs)
# congruence key: canonical form under the 8 symmetries of the square + translation
D8 = [lambda p: (p[0], p[1]), lambda p: (-p[0], p[1]), lambda p: (p[0], -p[1]), lambda p: (-p[0], -p[1]),
      lambda p: (p[1], p[0]), lambda p: (-p[1], p[0]), lambda p: (p[1], -p[0]), lambda p: (-p[1], -p[0])]
def norm(S):
    pts = [x for p in S for x in (p[1] + tuple(p[2:]))]
    mx = min(x for x, _ in pts); my = min(y for _, y in pts)
    mx -= mx % 2; my -= my % 2
    return tuple(sorted(tf_piece(lambda p: (p[0] - mx, p[1] - my), q) for q in S))
def congr(S): return min(norm(tf_set(f, S)) for f in D8)
# ---------- properties ----------
def deg(S):
    d = {}
    for p in S:
        for e in p[1]: d[e] = d.get(e, 0) + 1
    return d
def dirv(p, at):
    a, b = p[1]; o = b if a == at else a
    v = (o[0] - at[0], o[1] - at[1]); g = math.gcd(*v); return (v[0] // g, v[1] // g)
def right_angle(S):
    for n in nodes(S):
        segs = [p for p in S if p[0] == 's' and n in p[1]]
        for p, q in itertools.combinations(segs, 2):
            u, v = dirv(p, n), dirv(q, n)
            if u[0] * v[0] + u[1] * v[1] == 0: return True
    return False
def maximal_segments(S):
    segs = [p for p in S if p[0] == 's']; lines = []
    for p in segs:
        a, b = p[1]; d = (b[0] - a[0], b[1] - a[1]); g = math.gcd(*d); d = (d[0] // g, d[1] // g)
        if d < (0, 0) or (d[0] == 0 and d[1] < 0): d = (-d[0], -d[1])
        c = d[0] * a[1] - d[1] * a[0]          # line invariant
        lines.append((d, c))
    return lines
def parallel(S):
    L = set(maximal_segments(S)); ds = [d for d, _ in L]
    return len(ds) != len(set(ds))
def props(S):
    d = deg(S); V = len(d); E = len(S)
    return {'V': sym(S, mirrors_v()), 'H': sym(S, mirrors_h()), 'forat': E - V + 1 > 0, 'rot': sym(S, halfturns()),
            'grau3': 3 in d.values(), 'recte': right_angle(S), 'paral': parallel(S), 'diag': sym(S, mirrors_d()),
            'corba': any(p[0] != 's' for p in S), 'segment': any(p[0] == 's' for p in S), 'forats': E - V + 1, 'maxdeg': max(d.values())}
# ---------- visual complexity: count strokes as the eye sees them ----------
def strokes(S):
    """Pieces merged when two pieces continue each other smoothly at a degree-2 node (collinear segments,
    quarter arcs of the same circle, semicircles of the same circle)."""
    d = deg(S); parent = {p: p for p in S}
    def f(x):
        while parent[x] != x: x = parent[x]
        return x
    for n, k in d.items():
        if k != 2: continue
        p, q = [x for x in S if n in x[1]]
        smooth = False
        if p[0] == q[0] == 's': smooth = dirv(p, n) == tuple(-c for c in dirv(q, n))
        elif p[0] == q[0] == 'q': smooth = p[2] == q[2]
        elif p[0] == q[0] == 'h': smooth = ((p[1][0][0] + p[1][1][0]) / 2, (p[1][0][1] + p[1][1][1]) / 2) == ((q[1][0][0] + q[1][1][0]) / 2, (q[1][0][1] + q[1][1][1]) / 2)
        if smooth: parent[f(p)] = f(q)
    return len({f(p) for p in S})
# ---------- drawing (viewBox 0 0 100 100; node spacing 30, grid centred) ----------
def P(pt): return (20 + pt[0] * 15, 80 - pt[1] * 15)
def fmt(v): return ('%.1f' % v).rstrip('0').rstrip('.')
def path(S):
    out = []
    for p in sorted(S):
        a, b = p[1]; A, B = P(a), P(b)
        if p[0] == 's': out.append(f'M{fmt(A[0])} {fmt(A[1])}L{fmt(B[0])} {fmt(B[1])}')
        else:
            r = 15 if p[0] == 'h' else 30
            sm = SMP[p]; mid = sm[len(sm) // 2]
            # sweep flag: sign of the cross product (screen coords) of A->mid->B
            Mx, My = P(mid)
            cr = (Mx - A[0]) * (B[1] - A[1]) - (My - A[1]) * (B[0] - A[0])
            sw = 1 if cr < 0 else 0
            out.append(f'M{fmt(A[0])} {fmt(A[1])}A{r} {r} 0 0 {sw} {fmt(B[0])} {fmt(B[1])}')
    return ''.join(out)
def bbox_ok(S):
    pts = [P(x) for p in S for x in SMP[p]]
    return all(4 <= x <= 96 and 4 <= y <= 96 for x, y in pts)
# ---------- figures = 1 to 3 clean strokes ("macro strokes"), each a set of unit pieces ----------
def seg_pieces(a, b):
    dx, dy = (b[0] - a[0]) // 2, (b[1] - a[1]) // 2; n = max(abs(dx), abs(dy)); sx, sy = (dx // n if dx else 0), (dy // n if dy else 0)
    pts = [(a[0] + 2 * sx * i, a[1] + 2 * sy * i) for i in range(n + 1)]
    return [key_piece(('s', pts[i], pts[i + 1])) for i in range(n)]
def macros():
    M = {}
    for a in N:
        for b in N:
            if a >= b: continue
            dx, dy = abs(b[0] - a[0]), abs(b[1] - a[1])
            if (dx == 0 or dy == 0 or dx == dy): M['seg%s%s' % (a, b)] = seg_pieces(a, b)      # length 1 or 2 (h, v, diagonal)
    for p in PIECES:
        if p[0] in 'hq': M['arc%s' % (p,)] = [p]
    for c in N:                                                     # semicircle of radius 1: two quarter arcs, same centre
        for u in ((2, 0), (0, 2)):
            a, b = (c[0] - u[0], c[1] - u[1]), (c[0] + u[0], c[1] + u[1])
            if a not in N or b not in N: continue
            for s in (1, -1):
                m = (c[0] + s * u[1], c[1] + s * u[0])
                if m in N: M['semi%s%s' % (c, m)] = [key_piece(('q', a, m, c)), key_piece(('q', m, b, c))]
    c = (2, 2); ring = [(4, 2), (2, 4), (0, 2), (2, 0)]
    M['cercle'] = [key_piece(('q', ring[i], ring[(i + 1) % 4], c)) for i in range(4)]
    for p in PIECES:                                                # small circle: two semicircles on the same unit segment
        if p[0] == 'h' and p[2] > (( p[1][0][0] + p[1][1][0]) // 2, (p[1][0][1] + p[1][1][1]) // 2):
            q = [x for x in PIECES if x[0] == 'h' and x[1] == p[1] and x != p]
            M['cerclet%s' % (p[1],)] = [p, q[0]]
    def poly(v): return [x for i in range(len(v)) for x in seg_pieces(v[i], v[(i + 1) % len(v)])]
    for x0 in (0, 2):
        for y0 in (0, 2): M['q1_%d%d' % (x0, y0)] = poly([(x0, y0), (x0 + 2, y0), (x0 + 2, y0 + 2), (x0, y0 + 2)])
    M['q2'] = poly([(0, 0), (4, 0), (4, 4), (0, 4)])
    for x0 in (0, 2): M['rv%d' % x0] = poly([(x0, 0), (x0 + 2, 0), (x0 + 2, 4), (x0, 4)])
    for y0 in (0, 2): M['rh%d' % y0] = poly([(0, y0), (4, y0), (4, y0 + 2), (0, y0 + 2)])
    return M
def tangent(p, n):
    sm = SMP[p]; sm = sm if math.dist(sm[0], n) < 1e-9 else sm[::-1]
    v = (sm[3][0] - sm[0][0], sm[3][1] - sm[0][1]); l = math.hypot(*v); return (v[0] / l, v[1] / l)
def sharp(S, lim=40):
    """True if two pieces leave a node with tangents closer than lim degrees (slivers, cusps)."""
    for n in nodes(S):
        T = [tangent(p, n) for p in S if n in p[1]]
        for u, v in itertools.combinations(T, 2):
            if math.degrees(math.acos(max(-1, min(1, u[0] * v[0] + u[1] * v[1])))) < lim: return True
    return False
def connected(S):
    S = list(S); seen = {0}; todo = [0]
    while todo:
        i = todo.pop()
        for j in range(len(S)):
            if j not in seen and set(S[i][1]) & set(S[j][1]): seen.add(j); todo.append(j)
    return len(seen) == len(S)
def main(kmax=3):
    M = macros(); names = sorted(M); seen = {}
    for k in range(1, kmax + 1):
        for combo in itertools.combinations(names, k):
            S = [p for nm in combo for p in M[nm]]
            if len(set(S)) != len(S): continue
            if any(CL[(min(p, q), max(p, q))] for p, q in itertools.combinations(S, 2)): continue
            S = frozenset(S)
            if not connected(S) or not bbox_ok(S) or sharp(S): continue
            key = norm(S)
            if key in seen: continue
            seen[key] = (S, props(S), k)
    print('macros', len(M), 'figures', len(seen), file=sys.stderr)
    return seen
def centred(S):
    pts = [P(x) for p in S for x in SMP[p]]
    xs = [x for x, _ in pts]; ys = [y for _, y in pts]
    return 50 - (min(xs) + max(xs)) / 2, 50 - (min(ys) + max(ys)) / 2
# The 8 properties approved in round 15 (L3 without the degree-3 property, plus L6: right angle and parallel segments).
PROPS = [('V', "És l'única amb un eix de simetria vertical", "És l'única sense eix de simetria vertical"),
         ('H', "És l'única amb un eix de simetria horitzontal", "És l'única sense eix de simetria horitzontal"),
         ('forat', "És l'única amb algun forat", "És l'única sense forats"),
         ('rot', "És l'única que queda igual si la gires mitja volta", "És l'única que canvia si la gires mitja volta"),
         ('recte', "És l'única amb algun angle recte", "És l'única sense cap angle recte"),
         ('paral', "És l'única amb dos segments paral·lels", "És l'única sense segments paral·lels"),
         ('corba', "És l'única amb alguna línia corba", "És l'única feta només de segments"),
         ('segment', "És l'única amb algun segment", "És l'única feta només de corbes")]
if __name__ == '__main__':
    seen = main()
    # Pool: every figure of 1 or 2 strokes, plus the 3-stroke figures with a vertical or horizontal axis or a half-turn symmetry.
    pool = [(S, pr, k) for S, pr, k in seen.values() if k <= 2 or pr['V'] or pr['H'] or pr['rot']]
    cls = {}; items = []
    for S, pr, k in sorted(pool, key=lambda t: (t[2], len(t[0]), norm(t[0]))):
        c = cls.setdefault(congr(S), len(cls)); dx, dy = centred(S)
        items.append({'k': 'c%d' % c, 'p': [int(pr[x]) for x, _, _ in PROPS], 'd': path(S), 'off': [round(dx, 1), round(dy, 1)]})
    json.dump({'props': [{'yes': y, 'no': n} for _, y, n in PROPS], 'items': items}, open('out_lin.json', 'w'), ensure_ascii=False)
    print('saved', len(items), 'items,', len(cls), 'congruence classes (dedupe key)')
