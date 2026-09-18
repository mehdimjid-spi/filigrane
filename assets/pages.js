/* ============================================================
   Filigrane · comportements des pages intérieures
   Le tissage est dessiné une seule fois, pas d'animation continue :
   une page de contenu doit rester légère et ne rien coûter en batterie.
   ============================================================ */
(function(){
  "use strict";
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- le champ de fils, même graine que la page d'accueil ---------- */
  function mulberry32(a){ return function(){ a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296; }; }
  function lerp(a,b,t){ return a+(b-a)*t; }

  var canvas=document.getElementById('weave');
  if(canvas){
    var ctx=canvas.getContext('2d');
    var perm=new Uint8Array(512);
    (function(){
      var r=mulberry32(20260703), p=[], i, j, k, tmp;
      for(i=0;i<256;i++) p[i]=i;
      for(j=255;j>0;j--){ k=Math.floor(r()*(j+1)); tmp=p[j]; p[j]=p[k]; p[k]=tmp; }
      for(i=0;i<512;i++) perm[i]=p[i&255];
    })();
    function fade(t){ return t*t*t*(t*(t*6-15)+10); }
    function grad(h,x,y){ var u=(h&1)===0?x:-x; var v=(h&2)===0?y:-y; return u+v; }
    function noise2(x,y){
      var X=Math.floor(x)&255, Y=Math.floor(y)&255;
      var xf=x-Math.floor(x), yf=y-Math.floor(y);
      var u=fade(xf), v=fade(yf);
      var aa=perm[perm[X]+Y], ab=perm[perm[X]+Y+1], ba=perm[perm[X+1]+Y], bb=perm[perm[X+1]+Y+1];
      var x1=lerp(grad(aa,xf,yf), grad(ba,xf-1,yf), u);
      var x2=lerp(grad(ab,xf,yf-1), grad(bb,xf-1,yf-1), u);
      return lerp(x1,x2,v);
    }

    function draw(){
      var W=document.documentElement.clientWidth || window.innerWidth;
      var H=window.innerHeight;
      var DPR=Math.min(window.devicePixelRatio||1, W<760?1.5:2);
      canvas.width=W*DPR; canvas.height=H*DPR;
      canvas.style.width=W+'px'; canvas.style.height=H+'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
      ctx.fillStyle='#0a0910'; ctx.fillRect(0,0,W,H);
      ctx.lineCap='round';

      var rng=mulberry32(20260703);
      var n = W<760 ? 180 : 340;
      for(var i=0;i<n;i++){
        var x=rng()*W, y=rng()*H;
        var w=.45+rng()*.8;
        var t=rng();
        var col = t<.17 ? '212,169,78' : (t<.55 ? '242,236,223' : '111,101,144');
        ctx.strokeStyle='rgba('+col+',' + (t<.17 ? .30 : .20) + ')';
        ctx.lineWidth=w;
        ctx.beginPath(); ctx.moveTo(x,y);
        for(var s=0;s<78;s++){
          var a=noise2(x*.0019, y*.0019)*3.1;
          x+=Math.cos(a)*2.3; y+=Math.sin(a)*2.3;
          ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
    }
    draw();
    var rz=null, lastW=document.documentElement.clientWidth;
    window.addEventListener('resize', function(){
      // sur mobile, la barre d'adresse qui se rétracte change la hauteur : on ignore
      var w=document.documentElement.clientWidth;
      if(w===lastW) return;
      lastW=w;
      clearTimeout(rz); rz=setTimeout(draw, 180);
    });
  }

  /* ---------- menu mobile ---------- */
  var menuBtn=document.getElementById('menuBtn');
  var drawer=document.getElementById('drawer');
  if(menuBtn && drawer){
    function setMenu(open){
      menuBtn.setAttribute('aria-expanded', open?'true':'false');
      drawer.classList.toggle('open', open);
      drawer.setAttribute('aria-hidden', open?'false':'true');
      document.body.classList.toggle('locked', open);
    }
    menuBtn.addEventListener('click', function(){
      setMenu(menuBtn.getAttribute('aria-expanded')!=='true');
    });
    drawer.addEventListener('click', function(e){
      if(e.target.closest('a')) setMenu(false);
    });
    window.addEventListener('keydown', function(e){
      if(e.key==='Escape' && drawer.classList.contains('open')) setMenu(false);
    });
  }

  /* ---------- apparitions ---------- */
  /* seuil 0 : un bloc plus haut que l'écran n'atteindrait jamais un seuil
     en pourcentage et resterait invisible sur mobile */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0, rootMargin:'0px 0px -10% 0px'});
  [].forEach.call(document.querySelectorAll('.reveal'), function(el){ io.observe(el); });

  /* ---------- année du pied de page ---------- */
  var y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();
})();
