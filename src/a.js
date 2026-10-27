(function(){'use strict';
var WA='919819044433';
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function inr(n){n=Math.round(n);var neg=n<0;n=Math.abs(n);var s=String(n),l=s.slice(-3),r=s.slice(0,-3);if(r)l=','+l;return(neg?'−':'')+'₹'+r.replace(/\B(?=(\d{2})+(?!\d))/g,',')+l}
function ico(id){return '<svg class="ic" aria-hidden="true"><use href="#i-'+id+'"/></svg>'}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function waLink(t){return 'https://wa.me/'+WA+(t?'?text='+encodeURIComponent(t):'')}
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var root=document.documentElement;
function motionOn(){return !reduce&&!root.classList.contains('motion-off')}
/* ---------- motion toggle ---------- */
function setMotion(off){root.classList.toggle('motion-off',off);var b=$('#mot');b.setAttribute('aria-label',off?'Play motion':'Pause motion');b.innerHTML=ico(off?'motion':'pause');store('3s-motion',off?'off':'on')}
$('#mot').addEventListener('click',function(){setMotion(!root.classList.contains('motion-off'))});
setMotion(store('3s-motion')==='off'||reduce);
/* ---------- toast + sparks ---------- */
var tt;function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},2400)}
function sparks(x,y,n){if(!motionOn())return;n=n||10;for(var i=0;i<n;i++){var s=document.createElement('i');s.className='spark';var a=Math.random()*6.28,d=30+Math.random()*70;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');s.style.background=['#F3AA86','#E8CFA6','#fff'][i%3];document.body.appendChild(s);setTimeout(function(e){e.remove()},950,s)}}
function sparksAt(el,n){var r=el.getBoundingClientRect();sparks(r.left+r.width/2,r.top+r.height/2,n)}
function tween(el,to,fmt,dur){var from=el._v||0;el._v=to;fmt=fmt||inr;if(!motionOn()||from===to){el.textContent=fmt(to);return}var t0=performance.now();dur=dur||800;(function f(t){var k=clamp((t-t0)/dur,0,1);k=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*k);if(k<1&&el._v===to)requestAnimationFrame(f)})(t0)}
/* ---------- router ---------- */
var PAGES=['home','price-it','customised'],cur='home';
function go(name,noScroll){if(PAGES.indexOf(name)<0)name='home';cur=name;PAGES.forEach(function(p){$('#p-'+p).hidden=p!==name});$$('[data-go]').forEach(function(a){if(a.closest('.nav,.tabs'))a.setAttribute('aria-current',a.dataset.go===name?'page':'false')});try{history.replaceState(null,'','#'+name)}catch(e){}if(!noScroll)window.scrollTo(0,0);setTimeout(onScroll,30);document.title='3Soul Studio 4'}
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go);return}
  var j=e.target.closest('[data-jump]');if(j){e.preventDefault();var el=document.getElementById(j.dataset.jump);if(el)el.scrollIntoView({behavior:motionOn()?'smooth':'auto',block:'start'})}
});
$$('[data-wa]').forEach(function(a){a.href=waLink(a.dataset.wa)});
/* ---------- scroll ---------- */
var barI=$('#bar i'),barB=$('#bar b');
function onScroll(){
  var h=document.documentElement.scrollHeight-innerHeight,p=h>0?clamp(scrollY/h,0,1):0;
  barI.style.transform='scaleX('+p+')';barB.style.left=(p*100)+'%';
  if(cur==='price-it'){tlUpdate()}
  if(cur==='customised')storyUpdate();
}
var raf=0;addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;onScroll()})},{passive:true});addEventListener('resize',onScroll);
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.12});
$$('.rv').forEach(function(e){io.observe(e)});
/* ---------- gem ---------- */
var F=[[[30,130],[115,60],[120,130]],[[115,60],[200,60],[120,130]],[[200,60],[200,130],[120,130]],[[200,60],[200,130],[280,130]],[[200,60],[285,60],[280,130]],[[285,60],[370,130],[280,130]],[[30,130],[120,130],[200,330]],[[120,130],[200,130],[200,330]],[[200,130],[280,130],[200,330]],[[280,130],[370,130],[200,330]]];
var PAL_LAB=['#CFE0F7','#F1F7FF','#A9C6EC','#E4EEFB','#93B5E4','#C3D8F3','#86AADD','#B4CDEE','#789FD6','#A0BFE8'];
var PAL_NAT=['#EFEAE0','#FFFDF8','#DDD6C6','#F6F1E6','#D2CAB6','#E8E1D0','#CBC2AC','#E2DAC7','#C2B9A2','#D9D0BC'];
function pts(f){return f.map(function(p){return p.join(',')}).join(' ')}
function cen(f){return[(f[0][0]+f[1][0]+f[2][0])/3,(f[0][1]+f[1][1]+f[2][1])/3]}
function drawGem(svg,pal,cls){svg.innerHTML=F.map(function(f,i){return '<polygon class="'+(cls||'')+'" data-i="'+i+'" points="'+pts(f)+'" fill="'+pal[i]+'"/>'}).join('')+(cls?'':F.map(function(f){return '<polygon class="fl" points="'+pts(f)+'"/>'}).join(''))}
var hg=$('#heroGem');drawGem(hg,PAL_LAB);
var hfl=$$('.fl',hg),hcen=F.map(cen);
function lightAt(cx,cy){var r=hg.getBoundingClientRect(),k=400/r.width;var x=(cx-r.left)*k,y=(cy-r.top)*k;hfl.forEach(function(p,i){var d=Math.hypot(hcen[i][0]-x,hcen[i][1]-y);p.style.fillOpacity=clamp(1-d/170,0,1)*.9})}
$('#gemwrap').addEventListener('pointermove',function(e){lightAt(e.clientX,e.clientY)});
$('#gemwrap').addEventListener('pointerleave',function(){hfl.forEach(function(p){p.style.fillOpacity=0})});
hg.addEventListener('click',function(e){sparks(e.clientX,e.clientY,14);hfl.forEach(function(p,i){setTimeout(function(){p.style.fillOpacity=.95;setTimeout(function(){p.style.fillOpacity=0},260)},i*60)});$('#gemHint').textContent='That is the idea. Every facet counts.'});
setInterval(function(){if(!motionOn()||cur!=='home'||document.hidden)return;var p=hfl[Math.floor(Math.random()*hfl.length)];p.style.fillOpacity=.8;setTimeout(function(){p.style.fillOpacity=0},500)},1400);
/* ---------- home bits ---------- */
var PICS=['ring-pear','jhumka','pendant','bracelet','ring','band','drops','mangalsutra','ring-hand','ring-oval'];
$('#marq').innerHTML=PICS.concat(PICS).map(function(n){return '<img src="media/img/'+n+'.jpg" alt="" loading="lazy">'}).join('');
var TRUST=[['gem','Transparent cost breakdown','Metal, diamonds, labour, certification and GST on separate lines.','Every part of the price is shown on its own line, so you can see where the money goes. Change the gold purity or diamond type and watch each line move.'],['pen','Personal customisation','Start from a photo, a sketch or only a feeling.','You can speak directly with Jay and Hemali, on WhatsApp, on a call or at the studio. Every piece is made to order around what you tell us.'],['hand','Craftsmanship and detail','Pieces are cast, set and polished in Mumbai.','Each piece is made to order. Stones are set and finished by hand, and the details are checked before it reaches you.'],['ppl','The people behind the process','Two founders who answer your questions.','Jay started 3Soul after seeing the same ring quoted at three different prices. Hemali and Jay still talk with customers about their pieces.'],['sl','Choices explained clearly','Natural or lab-grown, 9K, 14K or 18K.','Each option shows what it does to the price before you choose it, so there are no surprises at the end.']];
$('#trust').innerHTML=TRUST.map(function(t,i){return '<button type="button" class="tcard" aria-expanded="false" aria-controls="tc'+i+'"><span class="ico">'+ico(t[0])+'</span><span class="ttl">'+t[1]+'</span><span class="sub">'+t[2]+'</span><span class="mt" id="tc'+i+'"><span>'+t[3]+'</span></span><span class="ht">Read more</span></button>'}).join('');
$$('.tcard').forEach(function(c){c.addEventListener('click',function(){var o=c.getAttribute('aria-expanded')==='true';$$('.tcard').forEach(function(x){x.setAttribute('aria-expanded','false');$('.ht',x).textContent='Read more'});if(!o){c.setAttribute('aria-expanded','true');$('.ht',c).textContent='Show less'}})});
var IG=[['p','DJEh681pg6Y'],['p','DXJvYyjDFyM'],['reel','DeZYazPMpEJ'],['reel','DcQraNusPvs'],['reel','DeHUW8EMNKn'],['reel','DcODlKvMRTA'],['reel','Da5Lw0qMBjI'],['reel','DVjTIsaDI2t']];
$('#ig').innerHTML=IG.map(function(u,i){var reel=u[0]==='reel';return '<a href="https://www.instagram.com/'+u[0]+'/'+u[1]+'/" target="_blank" rel="noopener" aria-label="Open this Instagram '+(reel?'reel':'post')+' (opens in a new tab)"><img src="media/img/'+PICS[i]+'.jpg" alt="" loading="lazy">'+(reel?'<span class="pl"><svg><use href="#i-play"/></svg></span>':'')+'<span class="m"><b>Instagram '+(reel?'reel':'post')+'</b><span>Open on Instagram</span><span style="opacity:.7;font-size:.7rem">Cover: 3Soul photo</span></span></a>'}).join('');
$('#aboutBtn').addEventListener('click',function(){var b=this,o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);$('#aboutMore').classList.toggle('open',!o);$('span',b).textContent=o?'More about us':'Show less'});
/* ---------- uploader ---------- */
function uploader(o){
  var files=o.files,rep=-1;
  function render(){o.thumbs.innerHTML=files.map(function(f,i){return '<div class="th">'+(f.url?'<img src="'+f.url+'" alt="Your photo '+(i+1)+'">':'<span>'+esc(f.name)+'<br>No preview for this format</span>')+'<button type="button" data-rm="'+i+'" aria-label="Remove photo '+(i+1)+'">×</button><button type="button" class="rp" data-rp="'+i+'">Replace</button></div>'}).join('');o.onChange&&o.onChange()}
  function ok(f){var n=f.name.toLowerCase(),t=f.type;var good=/^image\/(jpeg|png|webp|heic|heif)$/.test(t)||/\.(jpe?g|png|webp|heic|heif)$/.test(n);if(!good)return 'That file type isn’t supported. Use JPG, PNG, WebP or HEIC.';if(f.size>10*1024*1024)return 'That photo is over 10 MB. Try a smaller one.';return ''}
  function add(list){o.err.textContent='';list=Array.prototype.slice.call(list);if(rep>=0){var f=list[0];if(f){var m=ok(f);if(m){o.err.textContent=m}else{if(files[rep].url)URL.revokeObjectURL(files[rep].url);files[rep]=mk(f)}}rep=-1;render();return}
    list.forEach(function(f){var m=ok(f);if(m){o.err.textContent=m;return}if(files.length>=3){o.err.textContent='You can add up to 3 photos. Remove one to add another.';return}files.push(mk(f))});render()}
  function mk(f){var heic=/heic|heif/i.test(f.type+f.name);return{name:f.name,url:heic?null:URL.createObjectURL(f)}}
  o.drop.addEventListener('click',function(){rep=-1;o.input.value='';o.input.click()});
  o.drop.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();o.drop.click()}});
  o.input.addEventListener('change',function(){add(o.input.files);o.input.value=''});
  ['dragenter','dragover'].forEach(function(ev){o.drop.addEventListener(ev,function(e){e.preventDefault();o.drop.classList.add('over')})});
  ['dragleave','drop'].forEach(function(ev){o.drop.addEventListener(ev,function(e){e.preventDefault();o.drop.classList.remove('over')})});
  o.drop.addEventListener('drop',function(e){rep=-1;add(e.dataTransfer.files)});
  o.thumbs.addEventListener('click',function(e){var r=e.target.closest('[data-rm]'),p=e.target.closest('[data-rp]');if(r){var i=+r.dataset.rm;if(files[i].url)URL.revokeObjectURL(files[i].url);files.splice(i,1);render()}if(p){rep=+p.dataset.rp;o.input.value='';o.input.click()}});
}
function okLink(v){if(!v)return true;try{var u=new URL(/^https?:\/\//i.test(v)?v:'https://'+v);return /\./.test(u.hostname)}catch(e){return false}}
function okContact(v){v=(v||'').trim();if(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))return true;return /^\d{10,13}$/.test(v.replace(/[\s\-+()]/g,''))}
/* ---------- PRICE IT: state ---------- */
var Q={step:0,files:[],link:'',occasion:'',piece:'',metal:'',stone:'',budget:null,timing:'',name:'',contact:'',note:'',reviewed:false,bonus:0};
var OCC=[['💍','Engagement'],['🔔','Wedding'],['🥂','Anniversary'],['🎁','Gift'],['✨','Everyday'],['🔎','Just curious']];
var PIECE=[['💍','Ring'],['👂','Earrings'],['📿','Pendant'],['⌚','Bracelet'],['⭕','Bangle'],['🧿','Necklace'],['🪬','Mangalsutra'],['🤔','Not sure']];
function tiles(id,list,key){var h=$(id);h.innerHTML=list.map(function(t){return '<button type="button" class="t" aria-pressed="false" data-v="'+t[1]+'"><span class="e" aria-hidden="true">'+t[0]+'</span>'+t[1]+'</button>'}).join('');h.addEventListener('click',function(e){var b=e.target.closest('.t');if(!b)return;var on=b.getAttribute('aria-pressed')==='true';$$('.t',h).forEach(function(x){x.setAttribute('aria-pressed','false')});if(!on){b.setAttribute('aria-pressed','true');Q[key]=b.dataset.v;sparksAt(b,6)}else Q[key]='';hud()})}
function segs(id,list,key,fn){var h=$(id);h.innerHTML=list.map(function(t){return '<button type="button" aria-pressed="false" data-v="'+t[0]+'">'+t[1]+(t[2]?'<small>'+t[2]+'</small>':'')+'</button>'}).join('');h.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var on=b.getAttribute('aria-pressed')==='true';$$('button',h).forEach(function(x){x.setAttribute('aria-pressed','false')});if(!on){b.setAttribute('aria-pressed','true');Q[key]=b.dataset.v;sparksAt(b,6)}else Q[key]='';hud()})}
tiles('#t-occasion',OCC,'occasion');tiles('#t-piece',PIECE,'piece');
segs('#s-metal',[['9','9K'],['14','14K'],['18','18K'],['unsure','Not sure']],'metal');
segs('#s-stone',[['natural','Natural'],['lab','Lab-grown'],['both','Show me both']],'stone');
segs('#s-timing',[['Within a month','Within a month'],['1 to 3 months','1 to 3 months'],['No rush','No rush']],'timing');
var bud=$('#bud'),budv=$('#budv');
function budPaint(){bud.style.setProperty('--p',((bud.value-bud.min)/(bud.max-bud.min)*100)+'%')}
bud.addEventListener('input',function(){Q.budget=+bud.value;budPaint();tween(budv,Q.budget,inr,250);hud()});
$('#budClr').addEventListener('click',function(){Q.budget=null;budv._v=0;budv.textContent='Not set';hud()});budPaint();
$('#link').addEventListener('input',function(){Q.link=this.value.trim();hud()});
['nm','ct','nt'].forEach(function(id){$('#'+id).addEventListener('input',function(){Q[{nm:'name',ct:'contact',nt:'note'}[id]]=this.value;hud()})});
uploader({drop:$('#drop'),input:$('#file'),thumbs:$('#thumbs'),err:$('#ferr'),files:Q.files,onChange:hud});
/* HUD */
var hudG=$('#hudGem');drawGem(hudG,new Array(10).fill('#2B4A78'),'facet');var hudF=$$('.facet',hudG);
var prevLit=[];
function litArr(){return[!!(Q.files.length||Q.link),!!Q.occasion,!!Q.piece,!!Q.metal,!!Q.stone,Q.budget!=null,!!Q.timing,Q.name.trim().length>1,okContact(Q.contact),Q.reviewed]}
var LV=['Curious','Curious','Curious','Collector','Collector','Collector','Connoisseur','Connoisseur','Connoisseur','Connoisseur','Jeweller’s eye'];
function hud(){
  var L=litArr(),n=L.filter(Boolean).length;
  L.forEach(function(v,i){hudF[i].classList.toggle('lit',v);if(v&&!prevLit[i]&&prevLit.length){toast('Facet '+(i+1)+' lit. '+n+' of 10.');sparksAt(hudG,8);if(n===10){setTimeout(function(){sparksAt($('#hud'),24);toast('All 10 facets lit. Jeweller’s eye unlocked.')},700)}}});
  prevLit=L;
  $('#hudLv').textContent=LV[n];$('#hudCt').textContent=n+' of 10 facets lit';$('#hudPb i').style.transform='scaleX('+n/10+')';$('#hudPb').setAttribute('aria-valuenow',n);
  tween($('#hudPts'),n*10+Q.bonus+(n===10?20:0),function(v){return Math.round(v)},500);
  meter();
}
/* price meter */
var pmv=$('#pmv'),pmArc=$('#pmArc');
function meter(){var any=Q.metal||Q.stone;var pur=(Q.metal&&Q.metal!=='unsure')?Q.metal:'18';var dt=Q.stone==='natural'?'natural':'lab';var t=any?calc({purity:pur,dtype:dt,clarity:'VS',colour:'DEF',carat:.4}).total:0;tween(pmv,t,inr,700);pmArc.style.strokeDashoffset=1-clamp(t/260000,0,1);
  var n='Pick a gold purity and diamond type. Illustrative for a 0.40 ct ring. Your real report uses your design.';if(any){n=(pur+'K gold, '+(dt==='natural'?'natural':'lab-grown')+' diamond, 0.40 ct. Illustrative.');if(Q.budget!=null)n+=' Your budget is '+inr(Q.budget)+'.'}$('#pmn').textContent=n}
/* steps */
var SL=['Inspiration','Preferences','Details','Review'];
function steps(){$('#qsteps').innerHTML=SL.map(function(l,i){return '<div class="qs '+(i<Q.step?'done':i===Q.step?'cur':'')+'"><i></i><span>'+l+'</span></div>'}).join('');$$('#qcard .qp').forEach(function(p){p.classList.toggle('cur',+p.dataset.s===Q.step)})}
function showStep(i){Q.step=i;steps();if(i===3){Q.reviewed=true;summary()}hud();var c=$('#qcard');c.scrollIntoView({behavior:motionOn()?'smooth':'auto',block:'start'})}
function validate(i){var ok=true;if(i===0){var m=$('#lerr');if(!okLink(Q.link)){m.textContent='That doesn’t look like a link. Check it, or clear it to continue.';$('#link').setAttribute('aria-invalid','true');ok=false}else{m.textContent='';$('#link').removeAttribute('aria-invalid')}}
  if(i===2){var a=Q.name.trim().length>1;$('#nerr').textContent=a?'':'Please add your name.';$('#nm').setAttribute('aria-invalid',!a);var b=okContact(Q.contact);$('#cerr').textContent=b?'':'Use a phone number with 10 to 13 digits, or an email address.';$('#ct').setAttribute('aria-invalid',!b);ok=a&&b}return ok}
$('#qcard').addEventListener('click',function(e){if(e.target.closest('[data-next]')){if(validate(Q.step)){if(Q.step===0&&!Q.files.length&&!Q.link)toast('No photo or link yet. You can add one later.');showStep(Q.step+1)}}if(e.target.closest('[data-prev]'))showStep(Q.step-1);var ed=e.target.closest('[data-edit]');if(ed)showStep(+ed.dataset.edit)});
function summary(){var rows=[['Inspiration',(Q.files.length?Q.files.length+' photo'+(Q.files.length>1?'s':''):'')+(Q.files.length&&Q.link?' and ':'')+(Q.link?'a link':'')||'Nothing yet',0],['Occasion',Q.occasion||'Not set',1],['Piece',Q.piece||'Not set',1],['Gold purity',Q.metal?(Q.metal==='unsure'?'Not sure':Q.metal+'K'):'Not set',1],['Diamonds',{natural:'Natural',lab:'Lab-grown',both:'Show me both'}[Q.stone]||'Not set',1],['Budget',Q.budget!=null?inr(Q.budget):'Not set',1],['Timing',Q.timing||'Not set',1],['Name',Q.name,2],['Contact',Q.contact,2],['Note',Q.note||'None',2]];
  $('#sum').innerHTML=rows.map(function(r){return '<div><span>'+r[0]+'</span><span><b>'+esc(r[1])+'</b> <button type="button" data-edit="'+r[2]+'">Edit</button></span></div>'}).join('');
  var m='Hi 3Soul, I would like a Price It estimate.\nPiece: '+(Q.piece||'not sure')+'\nOccasion: '+(Q.occasion||'not set')+'\nGold: '+(Q.metal?(Q.metal==='unsure'?'not sure':Q.metal+'K'):'not set')+'\nDiamonds: '+(Q.stone||'not set')+'\nBudget: '+(Q.budget!=null?inr(Q.budget):'not set')+'\nName: '+Q.name+(Q.link?'\nLink: '+Q.link:'');$('#waSum').href=waLink(m)}
$('#send').addEventListener('click',function(){$('#demo').hidden=false;sparksAt(this,18);Q.bonus=Math.max(Q.bonus,0);toast('Prototype only. Nothing was sent.')});
/* rotator */
var rot=$('#rot');['ring-pear','ring-oval','jhumka','pendant','band','bracelet','mangalsutra'].forEach(function(n,i){rot.insertAdjacentHTML('beforeend','<img src="media/img/'+n+'.jpg" alt="'+(i?'':'Examples of jewellery you can send')+'" class="'+(i?'':'on')+'" loading="'+(i?'lazy':'eager')+'">')});
var ri=0;setInterval(function(){if(!motionOn()||cur!=='price-it'||document.hidden)return;var im=$$('img',rot);im[ri].classList.remove('on');ri=(ri+1)%im.length;im[ri].classList.add('on')},3000);
/* ---------- pricing engine (illustrative) ---------- */
var P={GOLD18:11490,FINE:{'9':.375,'14':.585,'18':.75},WT:{'9':.686,'14':.84,'18':1},BASE_G:5.2,LAB_G:1600,CAD:700,HAND:.1765,CERT:282,GST:.03,RATE:{lab:{SI:10000,VS:11700,VVS:13000},natural:{SI:38600,VS:43500,VVS:49160}},COL_STEP:1900,COL_IDX:{DEF:0,G:1,H:2}};
function calc(c){var gw=(c.gw||P.BASE_G)*P.WT[c.purity];var rate=P.RATE[c.dtype][c.clarity]-P.COL_STEP*P.COL_IDX[c.colour];var metal=Math.round(gw*P.GOLD18*P.FINE[c.purity]/.75);var dia=Math.round(c.carat*rate);var l0=gw*P.LAB_G+P.CAD;var sub=metal+dia+l0+P.CERT;var labour=Math.round(l0+sub*P.HAND);var pre=metal+dia+labour+P.CERT;var gst=Math.round(pre*P.GST);return{making:Math.round(l0),handling:labour-Math.round(l0),gw:gw,rate:rate,metal:metal,dia:dia,labour:labour,cert:P.CERT,gst:gst,total:pre+gst,perG:Math.round(P.GOLD18*P.FINE[c.purity]/.75)}}
var AS_SENT={purity:'18',dtype:'natural',clarity:'VS',colour:'DEF',carat:.5,gw:3.7};var SPEC={purity:'18',dtype:'natural',clarity:'VS',colour:'DEF',carat:.5,gw:3.7};
function withS(p){var o={};for(var k in SPEC)o[k]=SPEC[k];for(k in p)o[k]=p[k];if(o.dtype==='lab'&&o.colour==='H')o.colour='G';return o}
var reports=[];
function setSpec(p){var prev=calc(SPEC).total;SPEC=withS(p);reports.forEach(function(r){r.update(prev)})}
var COLL={DEF:'D–F',G:'G',H:'H'};
function Report(host,wide){
  host.innerHTML='<div class="rpt '+(wide?'wide':'')+'"><div class="hd"><span class="logo"><svg viewBox="0 0 1080 231" fill="currentColor"><use href="#logo"/></svg></span><span class="tag s">Sample · illustrative figures</span></div><div class="bd"><div class="l"><div class="ph"><img src="media/img/ring-pear.jpg" alt="A slim gold ring with a small pear-shaped diamond" loading="lazy"><span class="tag s">Illustrative design</span></div><div class="tot"><span class="d">Estimated total, incl. GST</span><div class="big"><span class="nv">₹0</span><span class="dl" hidden></span></div><span class="d" data-alt></span></div><div class="stack" data-stack></div></div><div class="r"><div data-lines></div><div class="ctl" data-ctl></div><p class="note"><b>Certification.</b> Ask us about the laboratory report applicable to your selected diamond. Certification charges are shown as their own line. Figures use sample rates and a sample design, so they are not a quotation.</p></div></div></div>';
  var el=$('.rpt',host),nv=$('.nv',host),dl=$('.dl',host),lines=$('[data-lines]',host),stack=$('[data-stack]',host),ctl=$('[data-ctl]',host),alt=$('[data-alt]',host);
  var COLS=['#102A4E','#F3AA86','#E8CFA6','#9FB3CF','#8E6A2F'];
  lines.innerHTML=['Metal','Diamonds','Labour and finishing','Certification charges','GST at 3%'].map(function(t,i){return '<div class="ln2" style="transition-delay:'+(i*130)+'ms"><div class="top"><span>'+t+'</span><span data-v="'+i+'">₹0</span></div><small data-s="'+i+'"></small><div class="b"><i data-b="'+i+'"></i></div></div>'}).join('');
  stack.innerHTML=COLS.map(function(c,i){return '<i data-k="'+i+'" style="background:'+c+'"></i>'}).join('');
  function ctlHtml(){
    var h='';function seg(lbl,key,opts){h+='<div><div class="lb" style="font-weight:500;margin-bottom:8px">'+lbl+'</div><div class="seg">'+opts.map(function(o){var p={};p[key]=o[0];var s=withS(p),d=calc(s).total-calc(SPEC).total,sel=SPEC[key]===o[0];return '<button type="button" aria-pressed="'+sel+'" data-k="'+key+'" data-v="'+o[0]+'"'+(o[2]?' disabled':'')+'>'+o[1]+'<span class="dtag">'+(sel?'Selected':(d>0?'+':'')+inr(d))+'</span></button>'}).join('')+'</div></div>'}
    seg('Diamonds','dtype',[['natural','Natural'],['lab','Lab-grown']]);seg('Gold purity','purity',[['9','9K'],['14','14K'],['18','18K']]);seg('Diamond clarity','clarity',[['VVS','VVS'],['VS','VS'],['SI','SI']]);seg('Diamond colour','colour',[['DEF','D–F'],['G','G'],['H','H',SPEC.dtype==='lab']]);
    h+='<div><div class="lb" style="font-weight:500;margin-bottom:8px">Total diamond weight: <span data-cl>'+SPEC.carat.toFixed(2)+' ct</span></div><input type="range" min=".25" max=".75" step=".05" value="'+SPEC.carat+'" data-carat aria-label="Diamond weight in carats"></div>';
    ctl.innerHTML=h;var r=$('[data-carat]',host);r.style.setProperty('--p',((SPEC.carat-.25)/.5*100)+'%')}
  ctl.addEventListener('click',function(e){var b=e.target.closest('button[data-k]');if(!b||b.disabled)return;var p={};p[b.dataset.k]=b.dataset.v;sparksAt(b,5);setSpec(p)});
  ctl.addEventListener('input',function(e){if(e.target.matches('[data-carat]')){setSpec({carat:+e.target.value})}});
  var first=true;
  function update(prev){var c=calc(SPEC),vals=[c.metal,c.dia,c.labour,c.cert,c.gst];
    vals.forEach(function(v,i){tween($('[data-v="'+i+'"]',host),v,inr,700);$('[data-b="'+i+'"]',host).style.setProperty('--w',(v/c.total*100)+'%');$('[data-k="'+i+'"]',host).style.setProperty('--w',(v/c.total*100)+'%')});
    $('[data-s="0"]',host).textContent=SPEC.purity+'K gold, '+c.gw.toFixed(2)+' g at '+inr(c.perG)+'/g';$('[data-s="1"]',host).textContent=(SPEC.dtype==='lab'?'Lab-grown':'Natural')+', '+SPEC.carat.toFixed(2)+' ct, '+SPEC.clarity+', '+COLL[SPEC.colour]+' at '+inr(c.rate)+'/ct';$('[data-s="2"]',host).textContent='Making, setting, design and finishing';$('[data-s="3"]',host).textContent='Laboratory report fee';$('[data-s="4"]',host).textContent='On the amounts above';
    tween(nv,c.total,inr,900);
    if(prev!=null&&prev!==c.total){var d=c.total-prev;dl.hidden=false;dl.className='dl '+(d>0?'up':'dn');dl.textContent=(d>0?'+':'−')+inr(Math.abs(d)).replace('−','');dl.style.animation='none';void dl.offsetWidth;dl.style.animation=''}
    var o=calc(withS({dtype:SPEC.dtype==='lab'?'natural':'lab'}));alt.textContent='Same design with '+(SPEC.dtype==='lab'?'natural':'lab-grown')+' diamonds: '+inr(o.total)+' ('+(o.total>c.total?'+':'−')+inr(Math.abs(o.total-c.total)).replace('−','')+')';
    ctlHtml();
    if(host.id==='bRpt'){var g=$('#bGem');g.style.setProperty('--sc',(.55+(SPEC.carat-.25)/.5*.6).toFixed(2));$$('polygon',g).forEach(function(p,i){p.setAttribute('fill',(SPEC.dtype==='lab'?PAL_LAB:PAL_NAT)[i])});$('#bCt').textContent=SPEC.carat.toFixed(2)+' ct '+(SPEC.dtype==='lab'?'lab-grown':'natural')}
    first=false}
  var ro=new IntersectionObserver(function(es){if(es[0].isIntersecting){el.classList.add('on');ro.disconnect()}},{threshold:.2});ro.observe(el);
  var api={update:update,show:function(){el.classList.add('on')}};reports.push(api);update(null);return api}
var modalRpt;var rcMain=Receipt($('#rcMount'),false);
/* ---------- modals ---------- */
var openEl=null,lastF=null;
function openModal(id){var m=document.getElementById(id);lastF=document.activeElement;m.classList.add('open');openEl=m;document.body.style.overflow='hidden';setTimeout(function(){var c=$('.x',m);c&&c.focus()},30)}
function closeModal(){if(!openEl)return;var m=openEl;m.classList.remove('open');openEl=null;document.body.style.overflow='';var v=$('video',m);if(v){v.pause();v.removeAttribute('src');v.load()}if(m.id==='videoModal')$('#vmount').innerHTML='';lastF&&lastF.focus&&lastF.focus()}
document.addEventListener('click',function(e){if(e.target.closest('[data-close]')||e.target.classList.contains('modal'))closeModal();if(e.target.closest('[data-open-report]')){e.preventDefault();if(!modalRpt)modalRpt=Receipt($('#rptModalMount'),true);openModal('reportModal');setTimeout(function(){modalRpt.show()},60)}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();if(e.key==='Tab'&&openEl){var f=$$('button,a[href],input,[tabindex]:not([tabindex="-1"])',openEl).filter(function(x){return !x.disabled&&x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
function openVideo(src,poster,title,wide){$('#vbox').classList.toggle('wide',!!wide);$('#vmount').innerHTML='<video controls playsinline preload="metadata" poster="'+poster+'" src="'+src+'" aria-label="'+esc(title)+'"></video>';openModal('videoModal');var v=$('video',$('#vmount'));try{var p=v.play();p&&p.catch&&p.catch(function(){})}catch(e){}}

/* ---------- receipt (sample report) ---------- */
function Receipt(host,inModal){
  var ROWS=[['dtype','Diamonds','Lab-grown is the same stone, grown instead of mined',[['lab','Lab-grown'],['natural','Natural']]],['purity','Gold','Higher karat means more gold and a deeper yellow',[['9','9K'],['14','14K'],['18','18K']]],['colour','Colour','How white the stones are. D–F is the whitest',[['H','H'],['G','G'],['DEF','D–F']]],['clarity','Clarity','How clean the stones are. Marks start to show to the eye in lower grades',[['SI','SI'],['VS','VS'],['VVS','VVS']]]];
  var cmb=0,mn=1e12,mx=0;['lab','natural'].forEach(function(d){['DEF','G','H'].forEach(function(c){if(d==='lab'&&c==='H')return;['9','14','18'].forEach(function(p){['SI','VS','VVS'].forEach(function(cl){for(var ct=.25;ct<=.751;ct+=.05){var t=calc({purity:p,dtype:d,clarity:cl,colour:c,carat:ct,gw:3.7}).total;cmb++;mn=Math.min(mn,t);mx=Math.max(mx,t)}})})})});
  host.innerHTML='<div class="rc"><div class="rc-top"><span><b>Sample Price It report</b> · SAMPLE-4881</span><span class="tag s">Illustrative figures. Not a quotation.</span></div>'+
  '<div class="rc-hero"><div class="rc-img"><img src="media/img/ring-oval.jpg" alt="An oval diamond ring with a pavé band" loading="lazy"><span class="tag s">Illustrative design</span></div><div><p class="kick">We priced it because we make it</p><h3 style="font-size:clamp(1.6rem,3vw,2.3rem);margin:6px 0 4px">Oval ring with a pavé band</h3><div class="rc-total"><span class="nv">₹0</span><span class="dl" hidden></span></div><p data-sum style="max-width:46ch"></p><div class="row" style="margin-top:18px"><a class="btn btn-navy" href="#quest" data-jump="quest" data-closem>Price my own design</a><a class="btn btn-ghost" data-wa="Hi 3Soul, I saw the sample Price It report and would like mine." target="_blank" rel="noopener">Ask on WhatsApp</a></div></div></div>'+
  '<div class="rc-make"><div><h3>Make it yours.</h3><p class="note" style="margin-top:4px">Every piece is made to order, so the diamonds, the gold, the colour and the clarity are yours to choose. Each option shows what it does to the price. Cheapest on the left.</p></div><div class="rc-now"><span class="note" style="color:#C7D2E4">Right now</span><span class="big nv2">₹0</span><small data-now></small><button type="button" data-reset>Back to as sent</button></div><div data-rows></div><div class="mrow"><div><b>Diamond weight</b><small>Total across all stones</small></div><div class="row"><input type="range" min=".25" max=".75" step=".05" data-carat style="max-width:320px" aria-label="Diamond weight in carats"><b data-cl></b></div></div><p class="ways">Put together, that’s '+cmb+' ways to make this ring your own, from '+inr(mn)+' to '+inr(mx)+'.</p></div>'+
  '<div class="rc-go"><div><h3>Where every rupee goes.</h3><p class="note" style="margin-top:6px">Including what 3Soul keeps. No line is hidden inside another.</p><p class="note" style="margin-top:14px">Sample rates and a sample design. Certification: ask us about the laboratory report applicable to your selected diamond. Quotation validity: 24 hours from the time it is issued.</p></div><div data-go></div></div></div>';
  var el=$('.rc',host),nv=$('.nv',host),dl=$('.dl',host),now2=$('.nv2',host);
  var COLS=['#102A4E','#C9A15C','#9FB3CF','#8E6A2F','#F3AA86','#B7C4D6'];
  var go=$('[data-go]',host);go.innerHTML=['Diamonds','Gold','Making','Hallmark and certificate','Studio and handling, including what 3Soul keeps','GST at 3%'].map(function(t,i){return '<div class="gl'+(i===4?' keep':'')+'" style="--w:0%"><div class="t"><span>'+t+'</span><span data-v="'+i+'">₹0</span></div><small data-s="'+i+'"></small><div class="b"><i style="background:'+COLS[i]+';transition-delay:'+i*110+'ms"></i></div></div>'}).join('')+'<div class="gl all"><div class="t"><span>All in</span><span data-all>₹0</span></div></div>';
  function rows(){var h='';ROWS.forEach(function(r){var base=calc(SPEC).total;var opts=r[3].map(function(o){var s=withS((function(){var p={};p[r[0]]=o[0];return p})());var dis=(r[0]==='colour'&&o[0]==='H'&&SPEC.dtype==='lab');return{k:o[0],l:o[1],t:calc(s).total,dis:dis}});opts.sort(function(a,b){return a.t-b.t});h+='<div class="mrow"><div><b>'+r[1]+'</b><small>'+r[2]+'</small></div><div class="opts">'+opts.map(function(o){var sel=SPEC[r[0]]===o.k,d=o.t-base;return '<button type="button" class="op" aria-pressed="'+sel+'" data-k="'+r[0]+'" data-v="'+o.k+'"'+(o.dis?' disabled':'')+'>'+o.l+(sel?'<i>your pick</i>':'<i class="'+(d<0?'dn':'up')+'">'+(d<0?'↓ ':'↑ ')+inr(Math.abs(d))+'</i>')+'</button>'}).join('')+'</div></div>'});$('[data-rows]',host).innerHTML=h;var r=$('[data-carat]',host);r.value=SPEC.carat;r.style.setProperty('--p',((SPEC.carat-.25)/.5*100)+'%');$('[data-cl]',host).textContent=SPEC.carat.toFixed(2)+' ct'}
  host.addEventListener('click',function(e){var b=e.target.closest('.op');if(b&&!b.disabled){var p={};p[b.dataset.k]=b.dataset.v;sparksAt(b,5);setSpec(p)}if(e.target.closest('[data-reset]'))setSpec(AS_SENT);if(e.target.closest('[data-closem]'))closeModal()});
  host.addEventListener('input',function(e){if(e.target.matches('[data-carat]'))setSpec({carat:+e.target.value})});
  $$('[data-wa]',host).forEach(function(a){a.href=waLink(a.dataset.wa)});
  function update(prev){var c=calc(SPEC),v=[c.dia,c.metal,c.making,c.cert,c.handling,c.gst];
    v.forEach(function(x,i){tween($('[data-v="'+i+'"]',host),x,inr,700);$$('.gl',go)[i].style.setProperty('--w',(x/c.total*100)+'%')});
    tween($('[data-all]',host),c.total,inr,800);tween(nv,c.total,inr,900);tween(now2,c.total,inr,700);
    var sub=['one '+SPEC.carat.toFixed(2)+' ct diamond, '+SPEC.clarity+' clarity, '+COLL[SPEC.colour]+' colour','3.7 g of '+SPEC.purity+'K at '+inr(c.perG)+' a gram','casting, setting, polishing','BIS hallmark and laboratory report fee','design, studio and our team','on the amounts above'];sub.forEach(function(t,i){$('[data-s="'+i+'"]',host).textContent=t});
    if(prev!=null&&prev!==c.total){var d=c.total-prev;dl.hidden=false;dl.className='dl '+(d>0?'up':'dn');dl.textContent=(d>0?'+':'−')+inr(Math.abs(d)).replace('−','');dl.style.animation='none';void dl.offsetWidth;dl.style.animation=''}
    var o=calc(withS({dtype:SPEC.dtype==='lab'?'natural':'lab'})),diff=Math.abs(o.total-c.total),spec=(SPEC.dtype==='lab'?'Lab-grown':'Natural')+' diamonds, '+SPEC.purity+'K gold, '+COLL[SPEC.colour]+', '+SPEC.clarity;
    $('[data-sum]',host).innerHTML='All in, with GST. '+spec+'. The same ring with '+(SPEC.dtype==='lab'?'natural':'lab-grown')+' diamonds costs <b>'+inr(diff)+(o.total<c.total?' less':' more')+'</b>.';
    var same=['purity','dtype','clarity','colour'].every(function(k){return SPEC[k]===AS_SENT[k]})&&SPEC.carat===AS_SENT.carat;
    $('[data-now]',host).textContent=spec+(same?', as we sent it':', your version');rows()}
  var ro=new IntersectionObserver(function(es){if(es[0].isIntersecting){el.classList.add('on');ro.disconnect()}},{threshold:.15});ro.observe(el);
  var api={update:update,show:function(){el.classList.add('on')}};reports.push(api);update(null);return api}
/* ---------- Price It hero stage ---------- */
(function(){var st=$('#pst'),btns=$$('#pcap button'),s=0,hold=0,seen=false;
  function set(n){s=n;st.dataset.s=n;btns.forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.s===n)});if(n===3){var t=calc(AS_SENT).total;st._v=0;tween($('#pstTot'),t,inr,1200)}else $('#pstTot').textContent='₹0'}
  btns.forEach(function(b){b.addEventListener('click',function(){hold=Date.now()+12000;set(+b.dataset.s)})});
  var io2=new IntersectionObserver(function(es){seen=es[0].isIntersecting},{threshold:.3});io2.observe(st);
  set(motionOn()?0:3);
  setInterval(function(){if(!motionOn()||!seen||cur!=='price-it'||Date.now()<hold||document.hidden)return;set((s+1)%4)},3600)})();
var SEND=[['ring-pear','A saved post'],['sketch-tablet','A sketch'],['jhumka','A screenshot'],['pendant','A photo from a shop window'],['bracelet','A piece you saw on someone'],['band','A family piece to remake'],['mangalsutra','A traditional design']];
$('#sendRail').innerHTML=SEND.map(function(x){return '<div class="sr1"><img src="media/img/'+x[0]+'.jpg" alt="" loading="lazy"><span>'+x[1]+'</span></div>'}).join('');
/* faq chat */
(function(){var QA=[['Is it really free?','Yes. No card, no deposit, nothing to sign.'],['Do I have to buy from 3Soul?','Not at all. Keep the report, compare it with anyone, and if you want us to make it, just reply.'],['How close will the final price be?','Within 10%. Gold moves daily and final stones can shift the total a little.'],['Natural or lab-grown?','Ask for both. Your report shows them side by side.'],['How long does it take?','Your report comes within 24 hours of your request.']];
  var msgs=$('#msgs'),row=$('#qrow'),done={};
  row.innerHTML=QA.map(function(q,i){return '<button type="button" data-i="'+i+'">'+q[0]+'</button>'}).join('')+'<a id="faqWa" target="_blank" rel="noopener">Ask us something else…</a>';$('#faqWa').href=waLink('Hi 3Soul, I have a question about Price It.');
  function ask(i,instant){if(done[i])return;done[i]=1;$('[data-i="'+i+'"]',row).disabled=true;msgs.insertAdjacentHTML('beforeend','<div class="mg1 q">'+QA[i][0]+'</div>');var t=document.createElement('div');t.className='mg1 a';t.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';msgs.appendChild(t);setTimeout(function(){t.textContent=QA[i][1]},(motionOn()&&!instant)?700:0)}
  row.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)ask(+b.dataset.i)});ask(0,true)})();

/* ---------- Price It: engine used by calculator (3Soul catalogue rates, 22 Sep 2026) ---------- */
var PI=(function(){var G18=11490,PUR={'9':.375,'14':.585,'18':.75},WT={'9':.686,'14':.84,'18':1};
  var RATE={lab:{SI:10000,VS:11700,VVS:13000},natural:{SI:38600,VS:43500,VVS:49160}};
  var CAT={ring:{label:'Ring',gold:5.2,carat:.4,max:5,h:.1765},earrings:{label:'Earrings',gold:4.1,carat:.9,max:4,h:.1765},pendant:{label:'Pendant',gold:3,carat:.15,max:2,h:.1905},bracelet:{label:'Bracelet',gold:10.2,carat:.7,max:7,h:.1364},bangle:{label:'Bangle',gold:18.5,carat:2.4,max:6,h:.1765},mangalsutra:{label:'Mangalsutra',gold:4.1,carat:.45,max:2,h:.1765},necklace:{label:'Necklace',gold:15.4,carat:8.5,max:12,h:.1765}};
  function est(c){var cat=CAT[c.category],gw=cat.gold*WT[c.purity],gr=G18*PUR[c.purity]/.75,gold=gw*gr,stones=c.carat*RATE[c.dtype][c.clarity],lab=gw*1600,making=lab+700+282,sub=gold+stones+making,hand=sub*cat.h,gst=(sub+hand)*.03,tot=sub+hand+gst;return{gw:gw,gr:gr,gold:gold,stones:stones,making:making,hand:hand,gst:gst,total:tot,low:tot*.9,high:tot*1.12,rate:RATE[c.dtype][c.clarity]}}
  return{est:est,CAT:CAT,PUR:PUR}})();
/* ---------- Price It: calculator ---------- */
(function(){
  var NS='http://www.w3.org/2000/svg';function r2(n){return Math.round(n*100)/100}
  function circ(cx,cy,r){return 'M'+r2(cx-r)+','+r2(cy)+'a'+r+','+r+' 0 1,0 '+r2(2*r)+',0a'+r+','+r+' 0 1,0 '+r2(-2*r)+',0Z'}
  function quad(a,b,c,t){var u=1-t;return[u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1]]}
  function polar(cx,cy,r,d){var a=d*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]}
  var PIECES={
   ring:function(){var m=[{k:'f',d:circ(120,152,62)+circ(120,152,50)},{k:'f',d:'M101,84 L139,84 L131,98 L109,98 Z'},{k:'s',d:'M103,49 L108,88',w:3},{k:'s',d:'M137,49 L132,88',w:3},{k:'f',d:circ(103,49,2.8)},{k:'f',d:circ(137,49,2.8)}];var s=[[120,66,22]];[-118,-134,-150,-62,-46,-30].forEach(function(a){var p=polar(120,152,56,a);s.push([p[0],p[1],4])});return{m:m,s:s}},
   earrings:function(){var m=[],s=[];[76,164].forEach(function(x){m.push({k:'f',d:circ(x,56,15)+circ(x,56,11)});m.push({k:'s',d:'M'+x+',71 L'+x+',116',w:2.6});m.push({k:'f',d:'M'+(x-30)+',150 C'+(x-30)+',108 '+(x+30)+',108 '+(x+30)+',150 Z'});m.push({k:'f',d:'M'+(x-33)+',148 h66 v7 h-66 Z'});for(var i=-2;i<=2;i++){m.push({k:'s',d:'M'+(x+i*12)+',155 L'+(x+i*12)+',161',w:1.4});m.push({k:'f',d:circ(x+i*12,164,3.4)})}s.push([x,56,11],[x-14,137,4.8],[x,130,5.4],[x+14,137,4.8])});return{m:m,s:s}},
   pendant:function(){var m=[{k:'s',d:'M36,16 Q120,154 204,16',w:2.2},{k:'f',d:'M114,86 a6,6 0 0,1 12,0 v16 h-12 Z'},{k:'f',d:circ(120,138,36)+circ(120,138,23)}];var s=[[120,138,20]];for(var i=0;i<10;i++){var p=polar(120,138,29.5,i*36-90);s.push([p[0],p[1],4.4])}return{m:m,s:s}},
   bracelet:function(){var cx=120,cy=122,rx=90,ry=46,m=[],s=[];m.push({k:'s',d:'M30,122 A90,46 0 0,1 210,122',w:4,o:.5});m.push({k:'s',d:'M30,122 A90,46 0 0,0 210,122',w:4});for(var i=0;i<=12;i++){var a=Math.PI*(.06+.88*i/12),x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a),r=4.2+2.6*Math.sin(a);m.push({k:'f',d:circ(r2(x),r2(y),r2(r+2))});s.push([x,y,r])}return{m:m,s:s}},
   bangle:function(){var m=[{k:'f',d:circ(120,124,84)+circ(120,124,67)}],s=[];for(var a=-150;a<=-30;a+=15){var p=polar(120,124,75.5,a);s.push([p[0],p[1],5.6])}[70,90,110].forEach(function(a){var q=polar(120,124,75.5,a);s.push([q[0],q[1],4.6])});return{m:m,s:s}},
   mangalsutra:function(){var m=[],s=[];[[[46,14],[58,96],[114,118]],[[194,14],[182,96],[126,118]]].forEach(function(c){for(var i=0;i<17;i++){var p=quad(c[0],c[1],c[2],.03+.94*i/16);m.push(i%5===2?{k:'f',d:circ(r2(p[0]),r2(p[1]),3.4)}:{k:'bead',d:circ(r2(p[0]),r2(p[1]),2.9)})}});m.push({k:'f',d:circ(120,122,6.5)+circ(120,122,3.2)});m.push({k:'f',d:'M120,128 C150,148 150,188 120,206 C90,188 90,148 120,128 Z M120,142 C140,156 140,184 120,196 C100,184 100,156 120,142 Z'});s.push([120,170,11],[120,151,3.6],[120,189,3.6]);return{m:m,s:s}},
   necklace:function(){var a=[26,26],b=[120,214],c=[214,26],m=[],s=[];m.push({k:'s',d:'M26,26 Q120,214 214,26',w:2.4});for(var i=0;i<15;i++){var t=.14+.72*i/14,p=quad(a,b,c,t),g=1-Math.abs(t-.5)/.36,r=3.6+4.6*g;m.push({k:'f',d:circ(r2(p[0]),r2(p[1]),r2(r+1.8))});s.push([p[0],p[1],r])}m.push({k:'s',d:'M120,131 L120,143',w:2.4});m.push({k:'f',d:circ(120,156,13.5)});s.push([120,156,10.5]);return{m:m,s:s}}};
  var KEYS=['ring','earrings','pendant','bracelet','bangle','mangalsutra','necklace'];
  /* diamond symbol */
  (function(){var T=21,S=35,G=48;function pt(r,d){var p=polar(0,0,r,d-90);return r2(p[0])+','+r2(p[1])}function poly(p,f,o){return '<polygon points="'+p.join(' ')+'" fill="'+f+'" fill-opacity="'+o+'"/>'}
    var h='<radialGradient id="dFill" cx="42%" cy="36%" r="72%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#E9EFF6"/><stop offset=".85" stop-color="#B9C7D6"/><stop offset="1" stop-color="#94A6BB"/></radialGradient><linearGradient id="dTable" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D2DDE9"/></linearGradient>';var f='<circle r="'+G+'" fill="url(#dFill)"/>';
    for(var j=0;j<8;j++){var a=j*45;f+=poly([pt(S,a),pt(G,a-22.5),pt(G,a)],j%2?'#FFFFFF':'#9FB2C8',j%2?.55:.35);f+=poly([pt(S,a),pt(G,a),pt(G,a+22.5)],j%2?'#A9BBCF':'#FFFFFF',j%2?.4:.6);f+=poly([pt(T,a+22.5),pt(S,a),pt(G,a+22.5),pt(S,a+45)],j%2?'#F4F8FC':'#B4C4D6',j%2?.7:.5);f+=poly([pt(T,a-22.5),pt(T,a+22.5),pt(S,a)],j%2?'#C6D3E1':'#FFFFFF',j%2?.6:.8)}
    var tb=[];for(var k=0;k<8;k++)tb.push(pt(T,k*45+22.5));f+='<polygon points="'+tb.join(' ')+'" fill="url(#dTable)"/>';var ln='';for(var n=0;n<8;n++){var b=n*45;ln+='M'+pt(T,b-22.5)+'L'+pt(S,b)+'L'+pt(T,b+22.5)+'M'+pt(S,b)+'L'+pt(G,b-22.5)+'M'+pt(S,b)+'L'+pt(G,b+22.5)+'M'+pt(S,b)+'L'+pt(G,b)}
    f+='<path d="'+ln+'" fill="none" stroke="#8EA2B8" stroke-width=".6" stroke-opacity=".75"/>';f+=poly([pt(S,45),pt(G,56),pt(G,67.5)],'#FFD3DF',.85)+poly([pt(S,180),pt(G,191),pt(G,202.5)],'#CFEFFF',.9)+poly([pt(T,292.5),pt(S,270),pt(G,281)],'#FFF1B8',.85);f+='<circle r="'+G+'" fill="none" stroke="#7F93AA" stroke-width="1"/><ellipse cx="-14" cy="-16" rx="9" ry="5" fill="#fff" opacity=".7" transform="rotate(-35 -14 -16)"/>';
    var s=document.createElementNS(NS,'svg');s.setAttribute('width','0');s.setAttribute('height','0');s.style.position='absolute';s.setAttribute('aria-hidden','true');s.innerHTML='<defs>'+h+'<symbol id="dia" viewBox="-50 -50 100 100">'+f+'</symbol></defs>';document.body.appendChild(s)})();
  var TONES={yellow:['#FFF3C9','#F6DC8E','#D5A640','#EDC96A','#BE8C2E','#8A5F18'],white:['#FFFFFF','#EEF1F5','#B9C2CD','#F2F4F7','#A3ADB9','#707B88'],rose:['#FFE9E0','#F7C6B0','#D08E73','#F2B9A0','#B8765C','#8A4E39']};
  var DULL={'9':.45,'14':.2,'18':0};
  function hex(c){return[parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)]}
  function mix(a,b,t){var x=hex(a),y=hex(b);return '#'+[0,1,2].map(function(i){var v=Math.round(x[i]+(y[i]-x[i])*t);return(v<16?'0':'')+v.toString(16)}).join('')}
  function tone(c,p){return TONES[c].map(function(h){return mix(h,'#CDBFA0',DULL[p]*(c==='white'?.5:1))})}
  function pieceSvg(key,gid,K,c,p,mini){var d=PIECES[key](),tn=tone(c,p);
    var h='<defs><linearGradient id="'+gid+'" gradientUnits="userSpaceOnUse" x1="30" y1="20" x2="210" y2="220">'+tn.map(function(col,i){return '<stop offset="'+[0,.3,.5,.64,.82,1][i]+'" stop-color="'+col+'"/>'}).join('')+'</linearGradient></defs>';
    var m=d.m.map(function(x){return x.k==='f'?'<path d="'+x.d+'" fill="url(#'+gid+')" fill-rule="evenodd"/>':x.k==='bead'?'<path d="'+x.d+'" fill="#14110F"/>':'<path d="'+x.d+'" fill="none" stroke="url(#'+gid+')" stroke-width="'+x.w+'" stroke-linecap="round"'+(x.o?' opacity="'+x.o+'"':'')+'/>'}).join('');
    var s=d.s.map(function(x,i){return '<g class="st" style="transform:translate('+r2(x[0])+'px,'+r2(x[1])+'px) scale('+K+')"><use class="'+(mini?'':'tw')+'" href="#dia" x="'+(-x[2])+'" y="'+(-x[2])+'" width="'+2*x[2]+'" height="'+2*x[2]+'" style="animation-delay:'+(i%7)*.3+'s"/></g>'}).join('');
    return h+m+s}
  var cfg={category:'ring',purity:'18',colour:'yellow',dtype:'lab',clarity:'VS',carat:PI.CAT.ring.carat},step=1,maxStep=1,lastT=null;
  var $v=$('#cview'),pc=$('#cpiece');
  function est(o){return PI.est(o?Object.assign({},cfg,o):cfg)}
  function K(){return clamp(Math.pow(cfg.carat/PI.CAT[cfg.category].carat,1/3),.55,1.8)}
  function dtxt(d){return Math.abs(d)<1?'<i class="dtx cu">Current</i>':'<i class="dtx '+(d<0?'dn':'up')+'">'+(d>0?'+':'−')+inr(Math.abs(d)).replace('−','')+'</i>'}
  function alt(o){return est(o).total-est().total}
  function maxFor(c){return PI.CAT[c].max}
  var curPiece=null;
  function drawPiece(anim){var key=cfg.category;if(curPiece!==key||anim){pc.style.animation='none';void pc.getBoundingClientRect();pc.style.animation='';pc.innerHTML=pieceSvg(key,'cmg',K(),cfg.colour,cfg.purity);curPiece=key}else{var tn=tone(cfg.colour,cfg.purity);$$('#cmg stop',pc).forEach(function(s,i){s.setAttribute('stop-color',tn[i])});$$('.st',pc).forEach(function(g){g.style.transform=g.style.transform.replace(/scale\([^)]*\)/,'scale('+K()+')')})}}
  function price(){var e=est(),t=Math.round(e.total);var d=lastT==null?0:t-lastT;tween($('#codo'),t,inr,800);$('#crng').textContent='Typical range '+inr(e.low)+' to '+inr(e.high);
    if(d&&Math.abs(d)>=1){var c=document.createElement('span');c.className='dl '+(d>0?'up':'dn');c.textContent=(d>0?'+':'−')+inr(Math.abs(d)).replace('−','');var box=$('#cdl');box.innerHTML='';box.appendChild(c)}lastT=t;
    $('#ctitle').textContent=PI.CAT[cfg.category].label+' in '+cfg.purity+'K '+cfg.colour+' gold, '+(cfg.dtype==='lab'?'lab-grown':'natural')+' '+cfg.clarity;}
  var CL={yellow:'Yellow',white:'White',rose:'Rose'};
  function rail(){var v=[PI.CAT[cfg.category].label,cfg.purity+'K '+CL[cfg.colour],(cfg.dtype==='lab'?'Lab':'Natural')+' '+cfg.clarity,cfg.carat.toFixed(2)+' ct'],k=['Piece','Metal','Stones','Size'];$('#crail').innerHTML=k.map(function(x,i){return '<button type="button" data-go="'+(i+1)+'"'+(i+1>maxStep?' disabled':'')+(i+1===step?' aria-current="step"':'')+'><span class="k">'+x+'</span><span class="v">'+v[i]+'</span></button>'}).join('')}
  var HEAD={1:['Choose the piece','Pick one below, or use the arrows on the stage.'],2:['Pour the metal','Purity is the share of pure gold. The rest is alloy.'],3:['Choose the diamonds','They look the same. The price does not.'],4:['Set the size','Total carat, across every stone in the piece.'],5:['Your estimate','']};
  function view(){var h='<h3 class="cv-h" tabindex="-1">'+HEAD[step][0]+'</h3><p class="cv-s">'+HEAD[step][1]+'</p>';
    if(step===1){h+='<div class="ctiles">'+KEYS.map(function(k,i){return '<button type="button" class="ct" aria-pressed="'+(k===cfg.category)+'" data-p="'+k+'"><svg viewBox="0 0 240 240" aria-hidden="true">'+pieceSvg(k,'mt'+i,.8,'yellow','18',true)+'</svg>'+PI.CAT[k].label+'</button>'}).join('')+'</div>'}
    if(step===2){h+='<div class="vials">'+['9','14','18'].map(function(p){return '<button type="button" class="vl" aria-pressed="'+(cfg.purity===p)+'" data-pu="'+p+'"><span class="tube"><i style="--f:'+PI.PUR[p]+'"></i></span><b>'+p+'K</b><small>'+(PI.PUR[p]*100).toFixed(1).replace('.0','')+'% gold</small>'+dtxt(alt({purity:p}))+'</button>'}).join('')+'</div><div class="coins" role="group" aria-label="Gold colour, does not change the price">'+['yellow','white','rose'].map(function(c){return '<button type="button" class="coin" aria-pressed="'+(cfg.colour===c)+'" data-co="'+c+'"><i class="'+{yellow:'cy',white:'cw',rose:'cr'}[c]+'"></i>'+CL[c]+'</button>'}).join('')+'</div><p class="note" style="margin-top:10px">Colour does not change the price.</p>'}
    if(step===3){h+='<div class="types">'+['lab','natural'].map(function(t){return '<button type="button" class="ty" aria-pressed="'+(cfg.dtype===t)+'" data-ty="'+t+'"><svg viewBox="-50 -50 100 100" aria-hidden="true"><use href="#dia" x="-50" y="-50" width="100" height="100"/></svg><b>'+(t==='lab'?'Lab-grown':'Natural')+'</b>'+dtxt(alt({dtype:t}))+'</button>'}).join('')+'</div><div class="clar">'+[['SI','Eye-clean at arm’s length'],['VS','No inclusions to the naked eye'],['VVS','Near-flawless under 10x']].map(function(c){return '<button type="button" class="cl" aria-pressed="'+(cfg.clarity===c[0])+'" data-cl="'+c[0]+'"><span><b>'+c[0]+'</b><small>'+c[1]+'</small></span>'+dtxt(alt({clarity:c[0]}))+'</button>'}).join('')+'</div>'}
    if(step===4){var mx=maxFor(cfg.category),ty=PI.CAT[cfg.category].carat;h+='<div class="sz"><svg class="dd1" style="--s:'+K()+'" viewBox="-50 -50 100 100" aria-hidden="true"><use href="#dia" x="-50" y="-50" width="100" height="100"/></svg><div class="ctv"><span style="margin:0;font-size:inherit;color:inherit" id="ctv">'+cfg.carat.toFixed(2)+'</span><span>ct</span></div><input type="range" id="crng2" min=".1" max="'+mx+'" step=".05" value="'+cfg.carat+'" aria-label="Total carat" style="--p:'+((cfg.carat-.1)/(mx-.1)*100)+'%"><p class="note" id="cmm"></p><div class="quick">'+[ty*.5,ty,ty*1.5,ty*2].map(function(v){v=Math.min(mx,Math.max(.1,Math.round(v*20)/20));return '<button type="button" aria-pressed="'+(Math.abs(cfg.carat-v)<.001)+'" data-q="'+v+'">'+v.toFixed(2)+' ct'+(Math.abs(v-ty)<.001?' typical':'')+'</button>'}).join('')+'</div><p class="note">Typical for a '+PI.CAT[cfg.category].label.toLowerCase()+': '+ty.toFixed(2)+' ct. A large single centre stone costs more per carat than these small stones.</p></div>'}
    if(step===5)h+=estDoc();
    $v.innerHTML=h;if(step===2){requestAnimationFrame(function(){var vv=$('.vials',$v);vv&&vv.classList.add('go')})}if(step===4)mm();if(step===5){var d=$('.edoc',$v);setTimeout(function(){d.classList.add('on')},60)}
    $('#cback').style.display=step===1?'none':'';var nx=$('#cnext');nx.style.display=step===5?'none':'';nx.textContent=['Let’s make this one','Choose the diamonds','Set the size','See my price'][step-1]||'Next';$('#cskip').style.display=step===5?'none':'';rail()}
  function mm(){var m=6.5*Math.cbrt(cfg.carat);$('#cmm').textContent='One round stone of this weight is about '+m.toFixed(1)+' mm across.'}
  var COL=['#C9A15C','#8E6A2F','#102A4E','#9FB3CF','#F3AA86'];
  function estDoc(){var e=est(),rows=[['Gold, '+e.gw.toFixed(2)+' g at '+cfg.purity+'K',e.gold],[(cfg.dtype==='lab'?'Lab-grown':'Natural')+' diamonds, '+cfg.carat.toFixed(2)+' ct, '+cfg.clarity,e.stones],['Labour, CAD and certificate',e.making],['Handling',e.hand],['GST at 3%',e.gst]];
    var o=est({dtype:cfg.dtype==='lab'?'natural':'lab'}),lab=cfg.dtype==='lab'?e:o,nat=cfg.dtype==='lab'?o:e;
    var cmb=[];['9','14','18'].forEach(function(p){['lab','natural'].forEach(function(t){['SI','VS','VVS'].forEach(function(c){cmb.push({p:p,t:t,c:c,v:est({purity:p,dtype:t,clarity:c}).total})})})});var mxv=Math.max.apply(null,cmb.map(function(x){return x.v}));
    var d=new Date(),ds=d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
    return '<div class="edoc"><div class="meta"><span>Estimate · illustrative</span><span>'+ds+'</span></div><p class="cv-s" style="margin:0 0 6px"><b style="color:var(--navy)">'+PI.CAT[cfg.category].label+' in '+cfg.purity+'K '+cfg.colour+' gold</b>, '+(cfg.dtype==='lab'?'lab-grown':'natural')+' diamonds, '+cfg.carat.toFixed(2)+' ct, '+cfg.clarity+'</p><div class="sbar2">'+rows.map(function(r,i){return '<i style="--w:'+(r[1]/e.total*100)+'%;background:'+COL[i]+';transition-delay:'+i*90+'ms"></i>'}).join('')+'</div>'+rows.map(function(r,i){return '<div class="erow"><i style="background:'+COL[i]+'"></i><span>'+r[0]+'</span><span>'+inr(r[1])+'</span></div>'}).join('')+'<div class="etot"><span>Total, incl. GST</span><span>'+inr(e.total)+'</span></div><p class="note">Typical range '+inr(e.low)+' to '+inr(e.high)+'. Final stones can move the total.</p>'+
    '<div class="cmp"><div class="'+(cfg.dtype==='lab'?'me':'')+'"><span class="note">Lab-grown</span><b>'+inr(lab.total)+'</b></div><div class="'+(cfg.dtype==='natural'?'me':'')+'"><span class="note">Natural</span><b>'+inr(nat.total)+'</b></div></div><p class="note">All 18 ways to make this '+PI.CAT[cfg.category].label.toLowerCase()+' (9K, 14K, 18K by lab-grown and natural by clarity). Tap a bar to try it.</p><div class="vbars" role="group" aria-label="All 18 variations">'+cmb.map(function(x,i){var cur=x.p===cfg.purity&&x.t===cfg.dtype&&x.c===cfg.clarity;return '<button type="button" class="'+(x.t==='natural'?'nat ':'')+(cur?'cur':'')+'" style="height:'+(x.v/mxv*100)+'%" data-vp="'+x.p+'" data-vt="'+x.t+'" data-vc="'+x.c+'" aria-label="'+x.p+'K '+x.t+' '+x.c+' '+inr(x.v)+'"></button>'}).join('')+'</div><div class="vleg"><span>9K</span><span>14K</span><span>18K</span></div>'+
    '<div class="eact"><button class="btn btn-navy" type="button" id="toQuest">Price my exact design</button><a class="btn btn-wa" id="cWa" target="_blank" rel="noopener"><svg class="ic"><use href="#i-wa"/></svg>WhatsApp</a><button class="btn btn-ghost" type="button" id="cCopy">Copy summary</button><button class="txtl" type="button" id="cReset">Start over</button></div><details class="how"><summary>How this is priced</summary><p style="margin-top:8px">Priced with 3Soul’s catalogue rates read on 22 Sep 2026: 18K gold at ₹11,490 a gram, diamonds from ₹10,000 a carat lab-grown and ₹38,600 natural, labour at ₹1,600 a gram. Indicative only. Send your design and a gemologist prices it exactly.</p></details></div>'}
  function summaryText(){var e=est();return 'Price It calculator: '+PI.CAT[cfg.category].label+', '+cfg.purity+'K '+cfg.colour+' gold, '+(cfg.dtype==='lab'?'lab-grown':'natural')+' diamonds, '+cfg.clarity+', '+cfg.carat.toFixed(2)+' ct. Illustrative estimate '+inr(e.total)+' incl. GST.'}
  function refresh(){drawPiece();price();rail()}
  function setStep(n){step=n;maxStep=Math.max(maxStep,n);view();$('.cv-h',$v).focus({preventScroll:true})}
  function change(o,sp){Object.assign(cfg,o);if(o.category){cfg.carat=PI.CAT[o.category].carat;curPiece=null}refresh();if(sp)sparksAt($('#cpiece'),8)}
  $v.addEventListener('click',function(e){var b;
    if(b=e.target.closest('[data-p]')){change({category:b.dataset.p},1);$$('.ct',$v).forEach(function(x){x.setAttribute('aria-pressed',x===b)})}
    else if(b=e.target.closest('[data-pu]')){change({purity:b.dataset.pu},1);view()}
    else if(b=e.target.closest('[data-co]')){change({colour:b.dataset.co},1);view()}
    else if(b=e.target.closest('[data-ty]')){change({dtype:b.dataset.ty},1);view()}
    else if(b=e.target.closest('[data-cl]')){change({clarity:b.dataset.cl},1);view()}
    else if(b=e.target.closest('[data-q]')){change({carat:+b.dataset.q});view()}
    else if(b=e.target.closest('[data-vp]')){change({purity:b.dataset.vp,dtype:b.dataset.vt,clarity:b.dataset.vc},1);view()}
    else if(e.target.closest('#cReset')){cfg={category:'ring',purity:'18',colour:'yellow',dtype:'lab',clarity:'VS',carat:PI.CAT.ring.carat};curPiece=null;lastT=null;maxStep=1;refresh();setStep(1)}
    else if(e.target.closest('#cCopy')){var t=summaryText();try{navigator.clipboard.writeText(t).then(function(){toast('Summary copied')},function(){toast('Select and copy: '+t.slice(0,60)+'…')})}catch(x){toast('Copy is not available here')}}
    else if(e.target.closest('#toQuest')){toQuestion()}
    var w=$('#cWa',$v);if(w)w.href=waLink('Hi 3Soul, '+summaryText())});
  $v.addEventListener('input',function(e){if(e.target.id==='crng2'){cfg.carat=Math.round(+e.target.value*100)/100;e.target.style.setProperty('--p',((cfg.carat-.1)/(maxFor(cfg.category)-.1)*100)+'%');$('#ctv').textContent=cfg.carat.toFixed(2);$('.dd1',$v).style.setProperty('--s',K());mm();drawPiece();price();rail()}});
  $('#crail').addEventListener('click',function(e){var b=e.target.closest('button[data-go]');if(b&&!b.disabled)setStep(+b.dataset.go)});
  $('#cnext').addEventListener('click',function(){setStep(Math.min(5,step+1))});$('#cback').addEventListener('click',function(){setStep(Math.max(1,step-1))});$('#cskip').addEventListener('click',function(){setStep(5)});
  function shift(n){var i=(KEYS.indexOf(cfg.category)+n+KEYS.length)%KEYS.length;change({category:KEYS[i]},1);if(step===1)view();else view()}
  $$('.cnav').forEach(function(b){b.addEventListener('click',function(){shift(+b.dataset.shift)})});
  var sx=null;$('#cstage').addEventListener('pointerdown',function(e){sx=e.clientX});$('#cstage').addEventListener('pointerup',function(e){if(sx==null)return;var dx=e.clientX-sx;sx=null;if(Math.abs(dx)>60)shift(dx<0?1:-1)});
  /* hand off to the quest */
  function toQuestion(){var map={ring:'Ring',earrings:'Earrings',pendant:'Pendant',bracelet:'Bracelet',bangle:'Bangle',necklace:'Necklace',mangalsutra:'Mangalsutra'};Q.piece=map[cfg.category];Q.metal=cfg.purity;Q.stone=cfg.dtype;syncQ();Q.step=0;steps();hud();toast('Your calculator choices are filled in.');$('#quest').scrollIntoView({behavior:motionOn()?'smooth':'auto',block:'start'})}
  drawPiece(1);price();rail();view();
})();
function syncQ(){[['#t-occasion','occasion'],['#t-piece','piece']].forEach(function(p){$$(p[0]+' .t').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.v===Q[p[1]])})});[['#s-metal','metal'],['#s-stone','stone'],['#s-timing','timing']].forEach(function(p){$$(p[0]+' button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.v===Q[p[1]])})})}
/* ---------- hero v4 ---------- */
(function(){var v=$('#h4v'),VARS=[{dtype:'natural',purity:'18',colour:'DEF',clarity:'VS'},{dtype:'lab',purity:'18',colour:'DEF',clarity:'VS'},{dtype:'lab',purity:'14',colour:'G',clarity:'VS'},{dtype:'lab',purity:'9',colour:'G',clarity:'SI'},{dtype:'natural',purity:'14',colour:'G',clarity:'SI'},{dtype:'natural',purity:'18',colour:'G',clarity:'VVS'},{dtype:'lab',purity:'18',colour:'G',clarity:'VVS'},{dtype:'natural',purity:'9',colour:'H',clarity:'SI'}];
  var mx=$('#h4mx');var N=18*7;mx.innerHTML=new Array(N+1).join('<i></i>');var dots=$$('i',mx),i=0,prev=null,seen=true;
  function show(n){var s=Object.assign({},AS_SENT,VARS[n]),c=calc(s);tween($('#h4t'),c.total,inr,900);tween($('#pl1'),c.dia,inr,900);tween($('#pl2'),c.metal,inr,900);tween($('#pl3'),c.making,inr,900);tween($('#pl4'),c.gst,inr,900);
    var a=$('#h4a'),b=$('#h4b'),k=$('#h4k');a.textContent=s.dtype==='lab'?'Lab-grown':'Natural';b.textContent=s.purity+'K gold';k.textContent=COLL[s.colour]+' · '+s.clarity;[a,b,k].forEach(function(x){x.classList.add('flash');setTimeout(function(){x.classList.remove('flash')},500)});
    if(prev!=null&&prev!==c.total){var d=c.total-prev,dl=$('#h4d');dl.hidden=false;dl.className='dl '+(d>0?'up':'dn');dl.textContent=(d>0?'+':'−')+inr(Math.abs(d)).replace('−','');dl.style.animation='none';void dl.offsetWidth;dl.style.animation=''}prev=c.total;
    dots.forEach(function(x){x.classList.remove('cur')});var di=Math.floor(Math.random()*N);dots[di].classList.add('on','cur')}
  show(0);new IntersectionObserver(function(es){seen=es[0].isIntersecting}).observe(v);
  setInterval(function(){if(!motionOn()||!seen||cur!=='price-it'||document.hidden)return;i=(i+1)%VARS.length;show(i)},2600)})();
/* ---------- timeline ---------- */
var TL=[['up','Share','Send a photo, a screenshot or a link to the design you love.'],['eye','Review','The 3Soul team looks at what you have shared.'],['chk2','Validate','The details are checked by an expert before the estimate is made.'],['tag','Estimate','Metal, diamonds, labour, certification and GST, each on its own line.'],['sl','Explore','Try other purities, diamond types, clarity and colour, and watch the price respond.'],['box','Receive','Your report, within 24 hours of your request.']];
var tl=$('#tl');tl.insertAdjacentHTML('beforeend',TL.map(function(t,i){return '<button class="ts" type="button" data-i="'+i+'"><span class="nn">'+ico(t[0])+'</span><h3>'+t[1]+'</h3><p>'+t[2]+'</p></button>'}).join(''));
tl.addEventListener('click',function(e){var b=e.target.closest('.ts');if(b)b.scrollIntoView({behavior:motionOn()?'smooth':'auto',block:'center'})});
var tsEls=$$('.ts',tl),TLI=['ring-pear','loupe','set','ring-oval','ring','boxes'];$('#tlv').innerHTML=TLI.map(function(n,i){return '<img src="media/img/'+n+'.jpg" alt="" class="'+(i?'':'on')+'" loading="lazy">'}).join('');var tli=0;
function tlUpdate(){var r=tl.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var f=clamp((innerHeight*.6-r.top)/r.height,0,1);tl.style.setProperty('--f',f.toFixed(3));var last=0;tsEls.forEach(function(s,i){var sr=s.getBoundingClientRect(),on=sr.top<innerHeight*.62;s.classList.toggle('on',on);if(on)last=i});if(last!==tli){tli=last;$$('#tlv img').forEach(function(m,k){m.classList.toggle('on',k===last)})}}
/* ---------- guess game ---------- */
$$('.gtabs button').forEach(function(b){b.addEventListener('click',function(){$$('.gtabs button').forEach(function(x){x.setAttribute('aria-selected',x===b)});$('#g-build').hidden=b.dataset.g!=='build';$('#g-guess').hidden=b.dataset.g!=='guess';if(b.dataset.g==='guess'&&!G.started)gStart()})});
var G={started:false,r:0,scores:[]};setTimeout(function(){gStart()},0);
var ROUNDS=[{img:'ring-pear',t:'A slim gold ring',s:{purity:'18',dtype:'lab',clarity:'VS',colour:'DEF',carat:.4,gw:5.2},d:'18K gold, 5.2 g. 0.40 ct lab-grown diamond, VS clarity.'},{img:'pendant',t:'A gold pendant',s:{purity:'14',dtype:'natural',clarity:'SI',colour:'G',carat:.3,gw:3.4},d:'14K gold, 3.4 g. 0.30 ct natural diamond, SI clarity.'},{img:'drops',t:'Drop earrings',s:{purity:'18',dtype:'lab',clarity:'VVS',colour:'G',carat:.6,gw:7.8},d:'18K gold, 7.8 g. 0.60 ct lab-grown diamonds in total, VVS clarity.'}];
function gStart(){G.started=true;G.r=0;G.scores=[];gRound()}
function gRound(){var R=ROUNDS[G.r],h=$('#g-guess');
  h.innerHTML='<div class="card" style="max-width:760px"><div class="rnd">'+ROUNDS.map(function(_,i){return '<i class="'+(i<G.r?'on':i===G.r?'cur':'')+'"></i>'}).join('')+'</div><div class="gm"><div class="ph" style="border-radius:24px;overflow:hidden;aspect-ratio:4/3;position:relative"><img src="media/img/'+R.img+'.jpg" alt="'+R.t+'" style="width:100%;height:100%;object-fit:cover"><span class="tag s" style="position:absolute;top:10px;left:10px">Illustrative design</span></div><div style="display:grid;gap:14px"><div><span class="note">Round '+(G.r+1)+' of '+ROUNDS.length+'</span><h3>'+R.t+'</h3><p class="note">'+R.d+'</p></div><div><div class="big" id="gv">₹1,50,000</div><input type="range" id="gs" min="20000" max="400000" step="1000" value="150000" aria-label="Your price guess"></div><button class="btn btn-navy" type="button" id="gl">Lock in my guess</button></div></div><div id="gr"></div></div>';
  var s=$('#gs'),v=$('#gv');function pt(){s.style.setProperty('--p',((s.value-s.min)/(s.max-s.min)*100)+'%');v.textContent=inr(+s.value)}pt();s.addEventListener('input',pt);
  $('#gl').addEventListener('click',function(){var btn=this;btn.disabled=true;s.disabled=true;var c=calc(R.s),guess=+s.value,off=Math.abs(guess-c.total)/c.total,pts=Math.round(clamp(1-off,0,1)*100);G.scores.push(pts);Q.bonus+=Math.round(pts/5);hud();
    var rows=[['Metal',c.metal],['Diamonds',c.dia],['Labour and finishing',c.labour],['Certification charges',c.cert],['GST at 3%',c.gst]];var gr=$('#gr');gr.innerHTML='<div class="sumr" style="margin-top:20px"></div>';var box=$('.sumr',gr),i=0;
    function step(){if(i<rows.length){box.insertAdjacentHTML('beforeend','<div class="ln2" style="opacity:1;transform:none"><span>'+rows[i][0]+'</span><b>'+inr(rows[i][1])+'</b></div>'.replace('class="ln2"','class="ln2x"'));i++;setTimeout(step,motionOn()?420:0)}else done()}
    function done(){var msg=off<=.1?'Sharp eye.':off<=.25?'Close.':'That gap is why we show every line.';gr.insertAdjacentHTML('beforeend','<div style="margin-top:16px;display:grid;gap:8px"><div class="note">Illustrative total, incl. GST</div><div class="big">'+inr(c.total)+'</div><p><b>You guessed '+inr(guess)+'.</b> '+msg+' <span class="tag">+'+pts+' game points</span></p><button class="btn btn-peach" type="button" id="gn">'+(G.r<ROUNDS.length-1?'Next round':'See my result')+'</button></div>');sparksAt($('#gn'),12);$('#gn').addEventListener('click',function(){G.r++;if(G.r<ROUNDS.length)gRound();else gEnd()})}
    step()})}
function gEnd(){var avg=Math.round(G.scores.reduce(function(a,b){return a+b},0)/G.scores.length);$('#g-guess').innerHTML='<div class="card" style="max-width:760px;text-align:center;display:grid;gap:14px;justify-items:center"><span class="note">Your price sense</span><div class="score">'+avg+'%</div><p class="lead">'+(avg>=80?'You read prices well.':avg>=60?'Not bad at all.':'Prices are hard to guess, which is the point of Price It.')+' A real report gives you every line for your own design.</p><div class="row" style="justify-content:center"><button class="btn btn-ghost" type="button" id="ga">Play again</button><a class="btn btn-navy" href="#quest" data-jump="quest">Price my design</a></div></div>';sparksAt($('.score'),22);$('#ga').addEventListener('click',gStart)}
/* ---------- CUSTOMISED: story ---------- */
var SC=[['ring-water','The feeling','It starts with a feeling.','Before there is a design, there is a reason. An anniversary. A promise. Something you haven’t said out loud yet.',1],['sketch-tablet','The sketch','Then someone draws it.','A pencil, a tablet, a few lines. Nothing is fixed yet, and that is the point.',1],['necklace-design','The drawing','Seven inches of collar.','This necklace began as a drawing: scalloped rows of drops and coloured stones across a seven inch collar.',0,1],['loupe','The work','15+ jewellers. 6 years.','It took more than fifteen jewellers and six years to get it right.',1],['necklace-poster','The finished piece','One dream.','And then it was finished. Watch it.',0,0,'necklace'],['ring-hand','Your turn','Yours could begin with one sentence.','Or a photo. Or a sketch. Or nothing at all, and we’ll find it together.',1]];
$('#scenes').innerHTML=SC.map(function(s,i){return '<section class="sc'+(i?'':' on')+'" aria-label="'+s[1]+'"><div class="si"><div class="pic'+(s[5]?' sq':'')+'"><img src="media/img/'+s[0]+'.jpg" alt="'+(s[5]?'Design drawing of a layered necklace marked 7 inch':'')+'" loading="'+(i<2?'eager':'lazy')+'"></div>'+(s[4]?'<span class="tag s">Illustrative image</span>':'<span class="tag">From a 3Soul commission</span>')+'</div><div class="sx"><span class="n">'+(i+1)+' of '+SC.length+'</span><h2>'+s[2]+'</h2><p>'+s[3]+'</p>'+(s[6]?'<div><button class="btn btn-peach" type="button" data-nk>'+ico('play')+' Watch the necklace</button></div>':'')+(i===SC.length-1?'<div><a class="btn btn-peach" href="#begin" data-jump="begin">Choose how to begin '+ico('arrow')+'</a></div>':'')+'</div></section>'}).join('');
$('#sdots').innerHTML=SC.map(function(s,i){return '<button type="button" aria-label="Scene '+(i+1)+': '+s[1]+'"></button>'}).join('');
var scEls=$$('.sc'),sdEls=$$('#sdots button'),scIdx=-1,story=$('#story');
function storyUpdate(){var r=story.getBoundingClientRect(),span=r.height-innerHeight;var p=clamp(-r.top/span,0,1);var i=Math.min(SC.length-1,Math.floor(p*SC.length));$('.sprog',story).style.setProperty('--sp',p);$('#cue').style.opacity=p<.04?1:0;$('.skip',story).style.visibility=r.top>-span*0.98&&r.bottom>innerHeight*.5?'visible':'hidden';if(i!==scIdx){scIdx=i;scEls.forEach(function(e,k){e.classList.toggle('on',k===i)});sdEls.forEach(function(e,k){e.classList.toggle('on',k===i)})}}
sdEls.forEach(function(b,i){b.addEventListener('click',function(){var r=story.getBoundingClientRect(),top=r.top+scrollY,span=r.height-innerHeight;scrollTo({top:top+(i+.5)/SC.length*span,behavior:motionOn()?'smooth':'auto'})})});
document.addEventListener('click',function(e){if(e.target.closest('[data-nk]'))openVideo('media/vid/necklace.mp4','media/img/necklace-poster.jpg','A finished necklace',false)});
/* ---------- CUSTOMISED: state + paths ---------- */
var C={path:'',files:[],link:'',dn:'',words:[],sketch:null,loved:[],brief:'',note:'',name:'',contact:'',step:0};
$$('#doors .bd1').forEach(function(b){b.addEventListener('click',function(){pickPath(b.dataset.p)})});
function pickPath(p){C.path=p;$$('#doors .bd1').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.p===p)});$$('.pnl').forEach(function(n){n.classList.toggle('cur',n.id==='pn-'+p)});if(p==='idea')setTimeout(padInit,30);if(p==='explore'&&!$('#deck').children.length)deckInit();setTimeout(function(){$('#pn-'+p).scrollIntoView({behavior:motionOn()?'smooth':'auto',block:'start'})},60);refreshE()}
uploader({drop:$('#drop2'),input:$('#file2'),thumbs:$('#thumbs2'),err:$('#ferr2'),files:C.files,onChange:refreshE});
$('#link2').addEventListener('input',function(){C.link=this.value.trim();var ok=okLink(C.link);$('#lerr2').textContent=ok?'':'That doesn’t look like a link.';refreshE()});
$('#dn').addEventListener('input',function(){C.dn=this.value;refreshE()});
/* sketch pad */
var cv=$('#cv'),cx=cv.getContext('2d'),strokes=[],ink='#102A4E',lw=5,drawing=null;
function padInit(){var r=cv.getBoundingClientRect();if(!r.width)return;var d=window.devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0);redraw()}
function seg(s,a,b){cx.strokeStyle=s.c;cx.lineWidth=s.w;cx.lineCap='round';cx.lineJoin='round';var W=cv.clientWidth,H=cv.clientHeight;cx.beginPath();cx.moveTo(a[0]*W,a[1]*H);cx.lineTo(b[0]*W,b[1]*H);cx.stroke()}
function redraw(){cx.clearRect(0,0,cv.clientWidth,cv.clientHeight);strokes.forEach(function(s){if(s.p.length===1)seg(s,s.p[0],[s.p[0][0]+.0001,s.p[0][1]]);for(var i=1;i<s.p.length;i++)seg(s,s.p[i-1],s.p[i])});$('#pad').classList.toggle('has',strokes.length>0)}
function pp(e){var r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]}
cv.addEventListener('pointerdown',function(e){e.preventDefault();cv.setPointerCapture(e.pointerId);drawing={c:ink,w:lw,p:[pp(e)]};strokes.push(drawing);seg(drawing,drawing.p[0],[drawing.p[0][0]+.0001,drawing.p[0][1]]);$('#pad').classList.add('has')});
cv.addEventListener('pointermove',function(e){if(!drawing)return;var n=pp(e);seg(drawing,drawing.p[drawing.p.length-1],n);drawing.p.push(n)});
function endS(){if(!drawing)return;drawing=null;C.sketch=strokes.length?cv.toDataURL('image/png'):null;refreshE()}
cv.addEventListener('pointerup',endS);cv.addEventListener('pointercancel',endS);
addEventListener('resize',function(){if(C.path==='idea')padInit()});
$$('.sw').forEach(function(b){b.addEventListener('click',function(){ink=b.dataset.c;$$('.sw').forEach(function(x){x.setAttribute('aria-pressed',x===b)})})});
$$('[data-w]').forEach(function(b){b.addEventListener('click',function(){lw=+b.dataset.w;$$('[data-w]').forEach(function(x){x.setAttribute('aria-pressed',x===b)})})});
$('#undo').addEventListener('click',function(){strokes.pop();redraw();C.sketch=strokes.length?cv.toDataURL('image/png'):null;refreshE()});
$('#clr').addEventListener('click',function(){strokes=[];redraw();C.sketch=null;refreshE()});
var WORDS=['Delicate','Bold','Vintage','Modern','Sparkly','Minimal','Everyday','Heirloom'];
$('#s-words').innerHTML=WORDS.map(function(w){return '<button type="button" aria-pressed="false" data-v="'+w+'">'+w+'</button>'}).join('');
$('#s-words').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var on=b.getAttribute('aria-pressed')==='true';b.setAttribute('aria-pressed',!on);var w=b.dataset.v,i=C.words.indexOf(w);if(on&&i>=0)C.words.splice(i,1);if(!on&&i<0)C.words.push(w);refreshE()});
$('#in').addEventListener('input',function(){C.dn=this.value;refreshE()});
/* explore deck */
var DECK=[['ring','Solitaire ring'],['jhumka','Jhumka earrings'],['ring-pear','Pear-stone ring'],['bracelet','Bracelet'],['pendant','Pendant'],['drops','Drop earrings'],['band','Band'],['mangalsutra','Mangalsutra']];
var di=0;
function deckInit(){di=0;C.loved=[];$('#exA').hidden=false;$('#exB').hidden=true;$('#exC').hidden=true;$('#rnd').innerHTML=DECK.map(function(){return '<i></i>'}).join('');deckDraw()}
function deckDraw(){var d=$('#deck');d.innerHTML='';$$('#rnd i').forEach(function(x,i){x.className=i<di?'on':i===di?'cur':''});if(di>=DECK.length){$('#exA').hidden=true;$('#exB').hidden=false;return}
  for(var k=Math.min(2,DECK.length-1-di);k>=0;k--){var c=DECK[di+k];var el=document.createElement('div');el.className='sw1';el.style.transform='translateY('+k*10+'px) scale('+(1-k*.05)+')';el.innerHTML='<img src="media/img/'+c[0]+'.jpg" alt="'+c[1]+'"><div class="cp">'+c[1]+'</div><span class="st y">LOVE</span><span class="st n">SKIP</span>';d.appendChild(el);if(k===0)drag(el)}}
function decide(yes){var top=$('#deck .sw1:last-child');if(!top)return;if(yes){C.loved.push(DECK[di][1]);sparksAt(top,8)}top.style.transform='translateX('+(yes?420:-420)+'px) rotate('+(yes?24:-24)+'deg)';top.style.opacity=0;setTimeout(function(){di++;deckDraw()},motionOn()?260:0)}
function drag(el){var sx=0,dx=0,on=false;el.addEventListener('pointerdown',function(e){on=true;sx=e.clientX;el.setPointerCapture(e.pointerId);el.style.transition='none'});el.addEventListener('pointermove',function(e){if(!on)return;dx=e.clientX-sx;el.style.transform='translateX('+dx+'px) rotate('+dx/18+'deg)';$('.st.y',el).style.opacity=clamp(dx/100,0,1);$('.st.n',el).style.opacity=clamp(-dx/100,0,1)});function up(){if(!on)return;on=false;el.style.transition='';if(Math.abs(dx)>90){decide(dx>0)}else{el.style.transform='';$('.st.y',el).style.opacity=0;$('.st.n',el).style.opacity=0}dx=0}el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)}
$('#yes').addEventListener('click',function(){decide(true)});$('#no').addEventListener('click',function(){decide(false)});
document.addEventListener('keydown',function(e){if(C.path==='explore'&&!$('#exA').hidden&&cur==='customised'&&(document.activeElement===document.body)){if(e.key==='ArrowRight')decide(true);if(e.key==='ArrowLeft')decide(false)}});
var FOR=['Myself','My partner','My family','A friend'],forSel='';
$('#s-for').innerHTML=FOR.map(function(w){return '<button type="button" aria-pressed="false" data-v="'+w+'">'+w+'</button>'}).join('');
$('#s-for').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;forSel=b.dataset.v;$$('#s-for button').forEach(function(x){x.setAttribute('aria-pressed',x===b)})});
$('#mk').addEventListener('click',function(){var q=+$('#dq').value,m=+$('#dm').value;var mood=q<35?'quiet':q>65?'statement':'balanced',sty=m<35?'classic':m>65?'modern':'timeless';var loved=C.loved.length?C.loved.join(', '):'nothing yet, and that is fine';
  var lines=['Drawn to: '+loved,'Mood: '+mood+', '+sty,forSel?'For: '+forSel.toLowerCase():''].filter(Boolean);C.brief=lines.join('. ');
  var imgs=DECK.filter(function(d){return C.loved.indexOf(d[1])>=0}).slice(0,4);
  $('#scard').innerHTML='<span style="color:#C7D2E4;font-size:.85rem">Your story card</span><h3>A '+mood+', '+sty+' beginning'+(forSel?', for '+forSel.toLowerCase():'')+'.</h3>'+(imgs.length?'<div class="imgs">'+imgs.map(function(d){return '<img src="media/img/'+d[0]+'.jpg" alt="'+d[1]+'">'}).join('')+'</div>':'')+'<p>'+esc(lines.join('. '))+'.</p><p style="font-size:.82rem;color:#C7D2E4">Built only from your picks. It is a starting point for a conversation with the 3Soul team, not a finished design.</p>';
  $('#exB').hidden=true;$('#exC').hidden=false;setTimeout(function(){sparksAt($('#scard'),20)},400);refreshE()});
$('#redo').addEventListener('click',function(){C.brief='';deckInit();refreshE()});
/* ---------- stories ---------- */
var VT=[{id:'necklace',l:'Necklace',h:'15+ jewellers. 6 years. One dream.',p:'A layered necklace, drawn out across a seven inch collar with rows of drops and coloured stones. This is the design drawing it began with, and the finished piece.',v:[['necklace','necklace-poster','A finished necklace',0]],extra:'necklace-design'},{id:'pen',l:'Diamond pen',h:'A pen set with diamonds.',p:'A custom commission, made to order. Press play to see it.',v:[['pen','pen-poster','The diamond pen',0]]},{id:'watch',l:'Diamond watch',h:'A watch, set with diamonds.',p:'Customised by 3Soul. 3Soul has no affiliation with the watch manufacturer.',v:[['watch-1','watch-1-poster','Watch, side view',1],['watch-2','watch-2-poster','Watch, front view',1]]},{id:'pend',l:'Custom pendants',h:'Small pieces, personal stories.',p:'A few more pieces made to someone’s idea.',v:[['lion-gold','lion-gold-poster','Custom pendant 1',1],['lion-white','lion-white-poster','Custom pendant 2',1],['lion-crown','lion-crown-poster','Custom pendant 3',1],['cross','cross-poster','Custom pendant 4',1],['bust','bust-poster','Custom pendant 5',1]]}];
$('#vtabs').innerHTML=VT.map(function(t,i){return '<button class="mini" role="tab" aria-pressed="'+(i===0)+'" data-t="'+i+'">'+t.l+'</button>'}).join('');
function vShow(i){var t=VT[i];$('#vpanel').innerHTML='<div class="vt"><div style="display:grid;gap:14px"><h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem)">'+t.h+'</h2><p class="lead">'+t.p+'</p><div><a class="btn btn-navy" href="#begin" data-jump="begin">Start your own piece '+ico('arrow')+'</a></div></div><div class="vs">'+(t.extra?'<div class="vc" style="aspect-ratio:3/4;background:#000;cursor:default"><img src="media/img/'+t.extra+'.jpg" alt="Design drawing of the layered necklace, marked 7 inch" style="object-fit:contain" loading="lazy"><span class="ct">The design drawing</span></div>':'')+t.v.map(function(v){return '<button class="vc'+(v[3]?' w':'')+'" type="button" data-v="'+v[0]+'" data-p="'+v[1]+'" data-t="'+esc(v[2])+'" aria-label="Play video: '+esc(v[2])+'"><img src="media/img/'+v[1]+'.jpg" alt="" loading="lazy"><span class="p"><span><svg><use href="#i-play"/></svg></span></span><span class="ct">'+v[2]+'</span></button>'}).join('')+'</div></div>'}
vShow(0);
$('#vtabs').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;$$('#vtabs button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});vShow(+b.dataset.t)});
$('#vpanel').addEventListener('click',function(e){var b=e.target.closest('.vc[data-v]');if(b)openVideo('media/vid/'+b.dataset.v+'.mp4','media/img/'+b.dataset.p+'.jpg',b.dataset.t,b.classList.contains('w'))});
/* ---------- magnet ---------- */
(function(){var svg=$('#msv'),A=$('#rA'),B=$('#rB'),halo=$('#halo'),cap=$('#mcap'),home={a:[170,200],b:[470,200]},a=home.a.slice(),b=home.b.slice(),drag=null,snapped=false,run=false;
  function place(){A.setAttribute('transform','translate('+a[0]+' '+a[1]+')');B.setAttribute('transform','translate('+b[0]+' '+b[1]+')')}place();
  function pt(e){var r=svg.getBoundingClientRect();return[(e.clientX-r.left)/r.width*640,(e.clientY-r.top)/r.height*400]}
  function snapFx(){halo.setAttribute('r',130);halo.setAttribute('cx',(a[0]+b[0])/2);halo.setAttribute('cy',(a[1]+b[1])/2);cap.textContent='Clink. That is the magnetic pull.';try{navigator.vibrate&&navigator.vibrate(30)}catch(e){}var r=svg.getBoundingClientRect();sparks(r.left+r.width/2,r.top+r.height/2,16)}
  function loop(){if(!run)return;var d=Math.hypot(a[0]-b[0],a[1]-b[1]);var tgt;
    if(drag){var other=drag==='a'?b:a,dragged=drag==='a'?a:b;if(d<108){if(!snapped){snapped=true;snapFx()}var ang=Math.atan2(other[1]-dragged[1],other[0]-dragged[0]);other[0]=dragged[0]+Math.cos(ang)*126;other[1]=dragged[1]+Math.sin(ang)*126}
      else{if(snapped){snapped=false;halo.setAttribute('r',0);cap.textContent='Drag a ring towards the other.'}if(d<230){var pull=(1-d/230)*.12,ang2=Math.atan2(dragged[1]-other[1],dragged[0]-other[0]);other[0]+=Math.cos(ang2)*pull*d*.2;other[1]+=Math.sin(ang2)*pull*d*.2}}}
    else if(snapped){run=false}else if(!snapped){var h=home.b;b[0]+=(h[0]-b[0])*.1;b[1]+=(h[1]-b[1])*.1;if(Math.hypot(b[0]-h[0],b[1]-h[1])<.5){b=h.slice();run=false}}
    place();requestAnimationFrame(loop)}
  function start(){if(!run){run=true;requestAnimationFrame(loop)}}
  [['a',A],['b',B]].forEach(function(p){p[1].addEventListener('pointerdown',function(e){e.preventDefault();svg.setPointerCapture(e.pointerId);drag=p[0];snapped=false;start()})});
  svg.addEventListener('pointermove',function(e){if(!drag)return;var q=pt(e);var t=drag==='a'?a:b;t[0]=clamp(q[0],60,580);t[1]=clamp(q[1],60,340)});
  function up(){drag=null;start()}svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  var btn=document.createElement('button');btn.className='btn btn-ghost';btn.type='button';btn.textContent='Bring the rings together';btn.style.marginBottom='18px';btn.addEventListener('click',function(){drag='a';snapped=false;start();var s=0;(function mv(){s++;a[0]+=(b[0]-126-a[0])*.18;a[1]+=(b[1]-a[1])*.18;if(Math.hypot(a[0]-(b[0]-126),a[1]-b[1])>1&&s<120)requestAnimationFrame(mv);else{a[0]=b[0]-126;a[1]=b[1];setTimeout(function(){drag=null;if(!snapped){snapped=true;snapFx()}start()},50)}})()});
  $('.mag .lead').insertAdjacentElement('afterend',btn);
  if(!motionOn()){}
})();
/* ---------- enquiry ---------- */
var ES=['Your idea','Contact','Review'];
function esteps(){$('#esteps').innerHTML=ES.map(function(l,i){return '<div class="qs '+(i<C.step?'done':i===C.step?'cur':'')+'"><i></i><span>'+l+'</span></div>'}).join('');$$('#enquiry .qp').forEach(function(p){p.classList.toggle('cur',+p.dataset.e===C.step)})}
function eRows(){var P={design:'I have a design',idea:'I have an idea',explore:'I have nothing yet'};return[['Where you are starting',P[C.path]||'Not chosen yet',null],['Photos',C.files.length?C.files.length+' added':'None',C.path||'design'],['Link',C.link||'None','design'],['Sketch',C.sketch?'<img src="'+C.sketch+'" alt="Your sketch" style="width:120px;border-radius:12px;border:1px solid var(--line);background:#fff">':'None','idea'],['In words',(C.words.length?C.words.join(', ')+'. ':'')+(C.dn||'')||'None','idea'],['Story card',C.brief||'None','explore']]}
function refreshE(){var rows=eRows().filter(function(r){return r[0]==='Where you are starting'||r[1]!=='None'});var h=rows.map(function(r){var val=r[0]==='Sketch'?r[1]:esc(r[1]);return '<div><span>'+r[0]+'</span><span><b>'+val+'</b>'+(r[2]?' <button type="button" data-ed="'+r[2]+'">Change</button>':'')+'</span></div>'}).join('');$('#eSum').innerHTML=h;$('#eSum2').innerHTML=h+'<div><span>Name</span><b>'+esc(C.name||'')+'</b></div><div><span>Contact</span><b>'+esc(C.contact||'')+'</b></div>'+(C.note?'<div><span>Note</span><b>'+esc(C.note)+'</b></div>':'');
  $('#eWa').href=waLink('Hi 3Soul, I have an idea for a custom piece.\n'+eRows().filter(function(r){return r[0]!=='Sketch'&&r[1]!=='None'}).map(function(r){return r[0]+': '+r[1]}).join('\n')+(C.note?'\nNote: '+C.note:'')+(C.name?'\nName: '+C.name:''))}
$('#enquiry').addEventListener('click',function(e){var ed=e.target.closest('[data-ed]');if(ed){pickPath(ed.dataset.ed);return}if(e.target.closest('[data-en]')){if(C.step===1){var a=C.name.trim().length>1,b=okContact(C.contact);$('#e1e').textContent=a?'':'Please add your name.';$('#e2e').textContent=b?'':'Use a phone number with 10 to 13 digits, or an email address.';$('#en1').setAttribute('aria-invalid',!a);$('#en2').setAttribute('aria-invalid',!b);if(!(a&&b))return}C.step=Math.min(2,C.step+1);esteps();refreshE();$('#enquiry .card').scrollIntoView({behavior:motionOn()?'smooth':'auto',block:'start'})}if(e.target.closest('[data-ep]')){C.step=Math.max(0,C.step-1);esteps()}});
$('#en').addEventListener('input',function(){C.note=this.value;refreshE()});$('#en1').addEventListener('input',function(){C.name=this.value;refreshE()});$('#en2').addEventListener('input',function(){C.contact=this.value;refreshE()});
$('#eSend').addEventListener('click',function(){$('#eDemo').hidden=false;sparksAt(this,18);toast('Prototype only. Nothing was sent.')});
esteps();refreshE();steps();hud();
/* ---------- boot ---------- */
addEventListener('hashchange',function(){var t=location.hash.replace('#','');if(PAGES.indexOf(t)>=0&&t!==cur)go(t)});
var h0=(location.hash||'').replace('#','');go(PAGES.indexOf(h0)>=0?h0:'home',true);onScroll();
})();
