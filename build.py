import re
s='/home/claude/v4/src/'
h=open(s+'tpl.html').read()
logo=open('/home/claude/proto/src/logo.svg').read()
paths=''.join(re.findall(r'<path[^>]*></path>|<path[^>]*/>',logo))
assert paths, 'no logo paths'
h=h.replace('LOGO_INNER',paths).replace('/*CSS*/',open(s+'s.css').read()).replace('/*JS*/',open(s+'a.js').read())
open('/home/claude/v4/dist/index.html','w').write(h); print(len(h))
