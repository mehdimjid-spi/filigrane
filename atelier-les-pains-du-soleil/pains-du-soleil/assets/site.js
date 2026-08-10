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

  /* year */
  var yr=document.getElementById("yr"); if(yr) yr.textContent=new Date().getFullYear();
})();
