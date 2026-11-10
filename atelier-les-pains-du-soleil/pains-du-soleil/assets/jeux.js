/* ============================================================
   Les Pains du Soleil · le coin des jeux · outils partagés
   - date et heure de Paris (le jeu ne dépend pas du fuseau du téléphone)
   - mémoire locale (rien n'est envoyé : tout reste sur le téléphone)
   - confettis de petits soleils, message flottant, partage
   - le « bon » à montrer en caisse, avec horloge vivante
     (une capture d'écran se repère : l'heure ne bouge plus)
   - mode démo automatique sur la maquette (localhost, filigrane-site.fr ou ?demo)
   ============================================================ */
window.PDSJeux = (function(){
  "use strict";
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
  var DEMO = /^(localhost|127\.0\.0\.1|\[::1\])$|filigrane-site\.fr$/.test(location.hostname) || /[?&]demo\b/.test(location.search);

  /* ---------- date de Paris ---------- */
  function paris(){
    var d=new Date(), o={};
    try{
      new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Paris",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"})
        .formatToParts(d).forEach(function(p){ o[p.type]=p.value; });
    }catch(e){ o={year:d.getFullYear(),month:d.getMonth()+1,day:d.getDate(),hour:d.getHours(),minute:d.getMinutes(),second:d.getSeconds()}; }
    var r={y:+o.year,m:+o.month,d:+o.day,h:(+o.hour)%24,mi:+o.minute,s:+o.second};
    r.cle=r.y+"-"+("0"+r.m).slice(-2)+"-"+("0"+r.d).slice(-2);
    r.heure=("0"+r.h).slice(-2)+":"+("0"+r.mi).slice(-2)+":"+("0"+r.s).slice(-2);
    return r;
  }
  var MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  function dateLongue(p){ p=p||paris(); return p.d+(p.d===1?"er":"")+" "+MOIS[p.m-1]+" "+p.y; }

  /* ---------- mémoire locale ---------- */
  var PREFIXE="pds-jeux:";
  var store={
    get:function(k,def){ try{ var v=localStorage.getItem(PREFIXE+k); return v===null?def:JSON.parse(v); }catch(e){ return def; } },
    set:function(k,v){ try{ localStorage.setItem(PREFIXE+k,JSON.stringify(v)); }catch(e){} },
    del:function(k){ try{ localStorage.removeItem(PREFIXE+k); }catch(e){} },
    vider:function(debut){ try{ Object.keys(localStorage).forEach(function(k){ if(k.indexOf(PREFIXE+(debut||""))===0) localStorage.removeItem(k); }); }catch(e){} }
  };

  /* ---------- code du jour (lisible par l'équipe : JJMM + 2 lettres) ---------- */
  function code(prefixe, graine){
    var p=paris(), s=(graine||"")+p.cle+prefixe, h=0;
    for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))>>>0; }
    var L="ABCDEFGHJKLMNPQRSTUVWXYZ";
    return prefixe+"-"+("0"+p.d).slice(-2)+("0"+p.m).slice(-2)+"-"+L[h%24]+L[(h>>>5)%24];
  }

  /* ---------- message flottant ---------- */
  var toastEl=null, toastT=null;
  function toast(msg, ms){
    if(!toastEl){ toastEl=document.createElement("div"); toastEl.className="toast"; toastEl.setAttribute("role","status"); document.body.appendChild(toastEl); }
    toastEl.textContent=msg; toastEl.classList.add("on");
    clearTimeout(toastT); toastT=setTimeout(function(){ toastEl.classList.remove("on"); }, ms||2600);
  }

  function vibrer(ms){ try{ if(navigator.userActivation && !navigator.userActivation.hasBeenActive) return; if(navigator.vibrate) navigator.vibrate(ms||12); }catch(e){} }

  /* ---------- confettis : petits soleils, étoiles et paillettes ---------- */
  function confettis(opts){
    if(reduce) return;
    opts=opts||{};
    var cv=document.getElementById("confettis");
    if(!cv){ cv=document.createElement("canvas"); cv.id="confettis"; cv.setAttribute("aria-hidden","true"); document.body.appendChild(cv); }
    var ctx=cv.getContext("2d"), dpr=Math.min(2,window.devicePixelRatio||1);
    var W=cv.width=innerWidth*dpr, H=cv.height=innerHeight*dpr;
    var couleurs=opts.couleurs||["#E8A83A","#F6D06B","#C98A1E","#FFF3D1","#B4232A","#5B7A3A"];
    var N=opts.nombre||150, P=[], ox=(opts.x!=null?opts.x:.5)*W, oy=(opts.y!=null?opts.y:.35)*H;
    for(var i=0;i<N;i++){
      var a=Math.random()*Math.PI*2, v=(4+Math.random()*9)*dpr;
      P.push({x:ox,y:oy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-7*dpr,r:(4+Math.random()*6)*dpr,rot:Math.random()*6,vr:(Math.random()-.5)*.3,
        c:couleurs[i%couleurs.length],forme:i%3,vie:0});
    }
    var t0=performance.now(), duree=opts.duree||3400;
    function soleil(p){
      ctx.beginPath(); ctx.arc(0,0,p.r*.55,0,6.283); ctx.fill();
      for(var k=0;k<8;k++){ ctx.rotate(Math.PI/4); ctx.fillRect(p.r*.7,-p.r*.12,p.r*.5,p.r*.24); }
    }
    function etoile(p){
      ctx.beginPath();
      for(var k=0;k<10;k++){ var rr=k%2?p.r*.45:p.r; var aa=k*Math.PI/5; ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr); }
      ctx.closePath(); ctx.fill();
    }
    (function pas(now){
      var t=now-t0; ctx.clearRect(0,0,W,H);
      P.forEach(function(p){
        p.vy+=.28*dpr; p.vx*=.985; p.vy*=.985; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha=Math.max(0,1-t/duree);
        ctx.fillStyle=p.c;
        if(p.forme===0) soleil(p); else if(p.forme===1) etoile(p); else ctx.fillRect(-p.r*.5,-p.r*.25,p.r,p.r*.5);
        ctx.restore();
      });
      if(t<duree) requestAnimationFrame(pas); else ctx.clearRect(0,0,W,H);
    })(t0);
  }

  /* ---------- partage ---------- */
  function partager(data){
    data=data||{};
    if(navigator.share){ return navigator.share(data).catch(function(){}); }
    var txt=(data.text?data.text+" ":"")+(data.url||location.href);
    try{ navigator.clipboard.writeText(txt).then(function(){ toast("Lien copié, il n'y a plus qu'à le coller !"); }); }
    catch(e){ toast("Copie ce lien : "+(data.url||location.href)); }
  }

  /* ---------- le bon à montrer en caisse ----------
     opts: {gain, cond, code, cle (pour mémoriser l'utilisation), validite} */
  function ticket(conteneur, o){
    o=o||{};
    var utiliseLe = o.cle ? store.get("utilise:"+o.cle, null) : null;
    var el=document.createElement("div");
    el.className="ticket"+(utiliseLe?" utilise":"");
    el.innerHTML=
      '<div class="t-reflet" aria-hidden="true"></div>'+
      '<div class="t-haut">'+
        '<img class="t-logo" src="assets/logo/soleil-logo.png" alt="" width="569" height="438">'+
        '<div class="t-lbl">'+(o.titre||"Ton cadeau")+'</div>'+
        '<div class="t-gain"></div>'+
        '<div class="t-cond"></div>'+
      '</div>'+
      '<div class="t-bas">'+
        '<div class="t-montre">Montre cet écran en caisse</div>'+
        '<div class="t-vivant" title="Écran vivant : l\'heure défile, ce n\'est pas une capture"><i></i><span class="t-heure">--:--:--</span> · '+dateLongue()+'</div>'+
        (o.code?'<div class="t-code"></div>':'')+
        (o.cle?'<button type="button" class="t-equipe" aria-label="Réservé à l\'équipe : appui long pour valider le cadeau"><span class="jauge"></span><span>Réservé à l\'équipe · appui long pour valider</span></button>':'')+
      '</div>'+
      '<div class="t-tampon-utilise"><span>UTILISÉ</span></div>';
    el.querySelector(".t-gain").textContent=o.gain||"";
    el.querySelector(".t-cond").textContent=utiliseLe?("Utilisé le "+utiliseLe):(o.cond||"");
    if(o.code) el.querySelector(".t-code").textContent=o.code;
    conteneur.innerHTML=""; conteneur.appendChild(el);

    var h=el.querySelector(".t-heure");
    function tic(){ if(document.body.contains(h)) { h.textContent=paris().heure; setTimeout(tic,1000); } }
    tic();

    var bt=el.querySelector(".t-equipe");
    if(bt){
      var jauge=bt.querySelector(".jauge"), t=null, debut=0;
      function stop(){ clearInterval(t); t=null; jauge.style.width="0"; }
      function go(e){
        if(e) e.preventDefault(); if(t) return; debut=Date.now();
        t=setInterval(function(){
          var pr=Math.min(1,(Date.now()-debut)/1500); jauge.style.width=(pr*100)+"%";
          if(pr>=1){ stop(); var quand=dateLongue()+" à "+paris().heure.slice(0,5);
            store.set("utilise:"+o.cle,quand); el.classList.add("utilise");
            el.querySelector(".t-cond").textContent="Utilisé le "+quand; vibrer(40); toast("Cadeau validé. Merci et à bientôt !");
            if(o.onUse) o.onUse(quand); }
        },40);
      }
      bt.addEventListener("pointerdown",go); bt.addEventListener("pointerup",stop); bt.addEventListener("pointerleave",stop); bt.addEventListener("pointercancel",stop);
      bt.addEventListener("keydown",function(e){ if(e.key===" "||e.key==="Enter") go(e); });
      bt.addEventListener("keyup",stop);
      bt.addEventListener("contextmenu",function(e){ e.preventDefault(); });
    }
    return el;
  }

  /* ---------- barre du mode démo ---------- */
  function demoBarre(texte, onReset){
    if(!DEMO) return;
    var b=document.createElement("div"); b.className="demo-barre";
    b.innerHTML='<b>Démo</b><span></span><button type="button">Recommencer</button>';
    b.querySelector("span").textContent=texte||"les règles sont assouplies sur la maquette";
    b.querySelector("button").addEventListener("click",function(){ if(onReset) onReset(); });
    document.body.appendChild(b);
  }

  return {DEMO:DEMO, reduce:reduce, paris:paris, dateLongue:dateLongue, MOIS:MOIS, store:store, code:code,
          toast:toast, vibrer:vibrer, confettis:confettis, partager:partager, ticket:ticket, demoBarre:demoBarre};
})();
