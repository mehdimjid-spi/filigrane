/* Les Pains du Soleil — JS partagé (pages villes + M6) */
(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* nav scrolled */
  var nav=document.getElementById("nav");
  function onScroll(){ if(nav) nav.classList.toggle("scrolled", window.scrollY>40);
    var t=document.getElementById("totop"); if(t) t.classList.toggle("show", window.scrollY>innerHeight*0.9); }
  onScroll();
  window.addEventListener("scroll",function(){ requestAnimationFrame(onScroll); },{passive:true});

  /* burger */
  var burger=document.getElementById("burger"), navlinks=document.getElementById("navlinks");
  if(burger&&navlinks){
    burger.addEventListener("click",function(){ var o=navlinks.classList.toggle("mobile-open"); nav.classList.toggle("open",o); burger.setAttribute("aria-expanded",o); });
    navlinks.querySelectorAll("a").forEach(function(a){ a.addEventListener("click",function(){ navlinks.classList.remove("mobile-open"); nav.classList.remove("open"); burger.setAttribute("aria-expanded",false); }); });
  }

  /* reveal on scroll */
  var io=null;
  if("IntersectionObserver" in window && !reduce){
    io=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } }); },{threshold:0.12,rootMargin:"0px 0px -8% 0px"});
  }
  /* Surveille les elements a reveler d'une zone donnee (le document entier par defaut).
     Les pages qui INJECTENT du contenu apres coup (les offres de recrutement) doivent
     rappeler cette fonction sur le conteneur, sinon leur contenu reste a opacity:0. */
  function surveiller(scope){
    (scope||document).querySelectorAll("[data-reveal],.filet").forEach(function(el){
      if(io) io.observe(el); else el.classList.add("in");
    });
  }
  surveiller();
  window.PDSReveal=surveiller;

  /* compteurs animés (ex. les points de la carte de fidélité) */
  function countUp(el){
    var t=parseInt(el.dataset.count,10); if(isNaN(t)) return;
    if(reduce){ el.textContent=t.toLocaleString("fr-FR"); return; }
    var start=null;
    function step(ts){ if(!start) start=ts;
      var pr=Math.min(1,(ts-start)/1400);
      el.textContent=(Math.floor((1-Math.pow(1-pr,3))*t)).toLocaleString("fr-FR");
      if(pr<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if("IntersectionObserver" in window){
    var cio=new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ countUp(en.target); cio.unobserve(en.target); } }); },{threshold:.5});
    document.querySelectorAll("[data-count]").forEach(function(el){ cio.observe(el); });
  } else { document.querySelectorAll("[data-count]").forEach(function(el){ el.textContent=el.dataset.count; }); }

  /* magnetic buttons */
  if(!reduce && matchMedia("(hover:hover)").matches){
    document.querySelectorAll(".btn-gold,.nav-cta").forEach(function(b){
      b.addEventListener("mousemove",function(e){ var r=b.getBoundingClientRect(); b.style.transform="translate("+(e.clientX-r.left-r.width/2)*.16+"px,"+(e.clientY-r.top-r.height/2)*.26+"px)"; });
      b.addEventListener("mouseleave",function(){ b.style.transform=""; });
    });
  }

  /* back to top */
  var totop=document.getElementById("totop");
  if(totop) totop.addEventListener("click",function(){ window.scrollTo({top:0,behavior:reduce?"auto":"smooth"}); });

  /* statut « ouvert maintenant » : heure de Paris, quel que soit le fuseau du visiteur.
     data-horaires = 7 plages lun→dim séparées par des virgules ("06:30-20:00"),
     ou une seule plage si elle vaut pour tous les jours. Plage vide = fermé ce jour-là. */
  window.PDSStatut=function(scope){
    var els=(scope||document).querySelectorAll("[data-horaires]"); if(!els.length) return;
    var JOURS=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
    function hm(s){ var p=s.split(":"); return (+p[0])*60+(+p[1]); }
    function lbl(m){ var h=Math.floor(m/60), mi=m%60; return h+"h"+(mi?String(mi).padStart(2,"0"):""); }
    function maintenant(){
      try{
        var parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Paris",weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
        var o={}; parts.forEach(function(p){ o[p.type]=p.value; });
        return {j:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].indexOf(o.weekday), m:(+o.hour%24)*60+(+o.minute)};
      }catch(e){ var d=new Date(); return {j:(d.getDay()+6)%7, m:d.getHours()*60+d.getMinutes()}; }
    }
    function plages(attr){
      var t=attr.split(","); if(t.length===1){ t=[t[0],t[0],t[0],t[0],t[0],t[0],t[0]]; }
      return t.map(function(s){ s=s.trim(); if(!s) return null; var x=s.split("-"); return [hm(x[0]),hm(x[1])]; });
    }
    var now=maintenant();
    els.forEach(function(el){
      var P=plages(el.getAttribute("data-horaires")), auj=P[now.j], txt="", cls="";
      if(auj && now.m>=auj[0] && now.m<auj[1]){
        if(auj[1]-now.m<=30){ cls="bientot"; txt="Ferme bientôt · "+lbl(auj[1]); }
        else { cls="ouvert"; txt="Ouvert · jusqu'à "+lbl(auj[1]); }
      } else if(auj && now.m<auj[0]){
        if(auj[0]-now.m<=60){ cls="bientot"; txt="Ouvre bientôt · "+lbl(auj[0]); }
        else { txt="Fermé · ouvre à "+lbl(auj[0]); }
      } else {
        for(var k=1;k<=7;k++){ var j=(now.j+k)%7; if(P[j]){ txt="Fermé · ouvre "+(k===1?"demain":JOURS[j])+" à "+lbl(P[j][0]); break; } }
      }
      el.textContent=txt; el.classList.remove("ouvert","bientot"); if(cls) el.classList.add(cls);
      el.setAttribute("title","Selon nos horaires habituels (jours fériés non pris en compte)");
    });
  };
  window.PDSStatut();
  setInterval(function(){ window.PDSStatut(); },60000);

  /* year */
  var yr=document.getElementById("yr"); if(yr) yr.textContent=new Date().getFullYear();
})();
