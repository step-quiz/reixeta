ST='fill="none" stroke="#000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"'
F={
'A':'M24,86 L50,14 L76,86 M33.4,60 L66.6,60',
'B':'M28,14 V86 M28,14 A32,18 0 0 1 28,50 A32,18 0 0 1 28,86',
'C':'M75.2,24.5 A30,36 0 1 0 75.2,75.5',
'D':'M28,14 V86 M28,14 A44,36 0 0 1 28,86',
'E':'M74,14 H28 V86 H74 M28,50 H64',
'F':'M74,14 H28 V86 M28,50 H64',
'G':'M75.2,24.5 A30,36 0 1 0 84,50 H60',
'H':'M28,14 V86 M72,14 V86 M28,50 H72',
'I':'M50,14 V86',
'J':'M66,14 V64 A17,22 0 0 1 32,64',
'K':'M28,14 V86 M72,14 L28,50 L72,86',
'L':'M28,14 V86 H72',
'M':'M24,86 V14 L50,58 L76,14 V86',
'N':'M28,86 V14 L72,86 V14',
'O':'M50,14 A28,36 0 1 0 50,86 A28,36 0 1 0 50,14',
'P':'M28,86 V14 M28,14 A36,18 0 0 1 28,50',
'Q':'M50,14 A28,36 0 1 0 50,86 A28,36 0 1 0 50,14 M60,68 L80,90',
'R':'M28,86 V14 M28,14 A36,18 0 0 1 28,50 L72,86',
'S':'M65.6,23 A18,18 0 1 0 50,50 A18,18 0 1 1 34.4,77',
'T':'M24,14 H76 M50,14 V86',
'U':'M28,14 V60 A22,26 0 0 0 72,60 V14',
'V':'M24,14 L50,86 L76,14',
'W':'M18,14 L32,86 L50,36 L68,86 L82,14',
'X':'M26,14 L74,86 M74,14 L26,86',
'Y':'M24,14 L50,50 L76,14 M50,50 V86',
'Z':'M26,14 H74 L26,86 H74'}
SETS=[('vert','AHIMOTUVWXY',"És l'única amb un eix de simetria vertical","És l'única sense eix de simetria vertical"),
      ('hor','BCDEHIKOX',"És l'única amb un eix de simetria horitzontal","És l'única sense eix de simetria horitzontal"),
      ('forats','ABDOPQR',"És l'única amb forats","És l'única sense forats"),
      ('rectes','AEFHIKLMNTVWXYZ',"És l'única feta només de línies rectes","És l'única que té línies corbes"),
      ('central','HINOSXZ',"És l'única que queda igual si la gires mitja volta","És l'única que canvia si la gires mitja volta"),
      ('recte','EFHLT',"És l'única amb un angle recte (entre dues línies rectes)","És l'única sense cap angle recte"),
      ('traç','BCDGIJLMNOPQRSUVWZ',"És l'única que es pot dibuixar d'un sol traç (sense aixecar el llapis ni repetir cap línia)","És l'única que no es pot dibuixar d'un sol traç"),
      ('horitz','AEFGHLTZ',"És l'única amb alguna línia horitzontal","És l'única sense cap línia horitzontal"),
      ('vertic','BDEFHIJKLMNPRTUY',"És l'única amb alguna línia vertical","És l'única sense cap línia vertical")]
def let_domain(nprops=7):
    S=SETS[:nprops]; items=[]
    for ch,d in F.items():
        items.append({'k':ch,'ch':ch,'p':[int(ch in s[1]) for s in S],'svg':f'<path d="{d}" {ST}/>'})
    return items,[{'id':a,'yes':y,'no':n} for a,_,y,n in S]
if __name__=='__main__':
    it,_=let_domain(8)
    html='<html><body style="background:#fff">'+''.join(f'<div style="display:inline-block;margin:4px;text-align:center;font:10px sans-serif"><svg viewBox="0 0 100 100" width="90" height="90" style="border:1px solid #ccc">{x["svg"]}</svg><br>{x["k"]} {"".join(map(str,x["p"]))}</div>' for x in it)+'</body></html>'
    open('/tmp/letters.html','w').write(html)
