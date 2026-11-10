/* ============================================================
   Les Pains du Soleil · le calendrier de l'Avent · données et fenêtre partagées
   Utilisé par calendrier-avent.html ET par l'accueil (la case du jour, en haut de page).
   Nécessite assets/jeux.js (PDSJeux) et assets/jeux.css.

   Les CADEAUX sont des PROPOSITIONS À VALIDER AVEC RAPHAËL avant la mise en ligne.
   Les « le saviez-vous » ne reprennent que des faits vérifiés (site, presse).
   Types : surprise (cadeau en boutique) · savoir · defi (photo) · jeu (lien) · astuce.
   ============================================================ */
window.PDSAvent = (function(){
  "use strict";
  var J = window.PDSJeux;

  var CASES={
    1:{t:"savoir",em:"☀️",titre:"C'est parti !",texte:"Bienvenue dans le calendrier de l'Avent du Soleil, et sur notre nouveau site ! Chaque jour jusqu'à Noël, une case s'ouvre. Premier petit secret : le Soleillou est notre pain-signature, celui qui porte le nom de la maison."},
    2:{t:"savoir",em:"🏛️",titre:"Au cœur de Perpignan",texte:"Notre maison de Perpignan est installée à l'entrée des Halles Vauban, en plein cœur de la ville. Avec sa terrasse, c'est l'adresse du café en ville.",lien:["boulangerie-perpignan.html","Découvrir Perpignan →"]},
    3:{t:"defi",em:"📸",titre:"Le défi photo",texte:"Prends en photo ton moment Pains du Soleil et identifie @lespainsdusoleil : on repartage nos préférées en story."},
    4:{t:"savoir",em:"🎓",titre:"21 ans, et une boulangerie",texte:"Raphaël était encore étudiant quand il a ouvert sa première boulangerie, à Saint-Estève, à 21 ans.",lien:["index.html#raphael","Le mot de Raphaël →"]},
    5:{t:"surprise",em:"☕",titre:"Un chocolat chaud offert",gain:"Un chocolat chaud offert",cond:"Pour l'achat d'une viennoiserie, aujourd'hui uniquement."},
    6:{t:"surprise",em:"🍬",titre:"Bonne Saint-Nicolas !",gain:"Une chouquette offerte à chaque enfant",cond:"Aujourd'hui uniquement, dans nos quatre maisons.",grand:true},
    7:{t:"astuce",em:"🧺",titre:"Garder son pain croustillant",texte:"Range ton pain dans un sac en tissu plutôt que dans du plastique : il garde sa croûte bien plus longtemps."},
    8:{t:"savoir",em:"📺",titre:"Un 9/10 à la télé",texte:"Dans La Meilleure Boulangerie de France sur M6, l'Albercoc (abricot rouge, jambon Serrano, roquette et fromage) a été noté 9/10 par le jury."},
    9:{t:"defi",em:"🥐",titre:"Pistache ou framboise ?",texte:"Poste ta viennoiserie colorée préférée et identifie @lespainsdusoleil. Team vert ou team rouge ?"},
    10:{t:"surprise",em:"🎂",titre:"Ta bûche à −10 %",gain:"−10 % sur ta bûche",cond:"Pour toute précommande de bûche passée aujourd'hui.",lien:["noel-galettes-des-rois.html#precommande","Précommander ma bûche →"]},
    11:{t:"savoir",em:"🍯",titre:"Le miel du coin",texte:"La Ruche et le Rayon d'Or sont parfumés au miel du Berger des Abeilles, un apiculteur du Roussillon."},
    12:{t:"astuce",em:"⭐",titre:"Ta carte de fidélité",texte:"Sans carton ni application : crée ta carte de fidélité en une minute depuis ton téléphone, et tes points se cumulent à chaque passage.",lien:["fidelite.html","Créer ma carte →"]},
    13:{t:"surprise",em:"☕",titre:"La pause du 13",gain:"Un café offert avec ta viennoiserie",cond:"Aujourd'hui uniquement.",grand:true},
    14:{t:"astuce",em:"🔥",titre:"Une baguette de la veille ?",texte:"Quelques minutes dans un four bien chaud, et elle retrouve son croustillant."},
    15:{t:"savoir",em:"🎲",titre:"On joue à Sainte-Marie",texte:"Dans notre maison de Sainte-Marie-la-Mer, des jeux de société t'attendent : demande-en un au comptoir et installe-toi.",lien:["boulangerie-sainte-marie-la-mer.html","Découvrir Sainte-Marie →"]},
    16:{t:"defi",em:"🍳",titre:"La plus belle table",texte:"Défi du jour : ta plus belle table de petit-déjeuner. Photo, identification @lespainsdusoleil, et c'est gagné… pour les yeux."},
    17:{t:"jeu",em:"🛂",titre:"Le passeport des 4 maisons",texte:"Un tampon dans chaque boutique, un Soleillou au bout de la route. Tu as déjà le premier ?",lien:["passeport-4-maisons.html","Ouvrir mon passeport →"]},
    18:{t:"surprise",em:"⭐",titre:"Points doublés",gain:"Tes points de fidélité doublés",cond:"Sur tes achats d'aujourd'hui, avec ta carte de fidélité.",grand:true},
    19:{t:"savoir",em:"🏡",titre:"La maison historique",texte:"Notre maison historique est à Cabestany : c'est Jérôme Bonneau, le père de Raphaël, qui l'a ouverte en 2012.",lien:["boulangerie-cabestany.html","Découvrir Cabestany →"]},
    20:{t:"defi",em:"🧁",titre:"Le goûter de Noël",texte:"Montre-nous ton plus beau goûter de Noël, version Pains du Soleil, en identifiant @lespainsdusoleil."},
    21:{t:"astuce",em:"📝",titre:"Le 24, c'est la ruée",texte:"Pense à précommander ta bûche : elle t'attendra bien au frais le jour du retrait.",lien:["noel-galettes-des-rois.html#precommande","Précommander →"]},
    22:{t:"savoir",em:"🎬",titre:"Vu à la télé",texte:"Le 7 mai 2026, la maison passait sur M6 dans La Meilleure Boulangerie de France. Raphaël comptait parmi les plus jeunes candidats.",lien:["vu-a-m6.html","La revue de presse →"]},
    23:{t:"surprise",em:"🏷️",titre:"Les derniers préparatifs",gain:"−10 % sur toute la boutique",cond:"Aujourd'hui uniquement, pour finir les préparatifs."},
    24:{t:"surprise",em:"🎄",titre:"Joyeux Noël !",gain:"Un croissant offert",cond:"Aujourd'hui, pour tous ceux qui montrent cette case en boutique. Joyeux Noël de toute l'équipe !",grand:true}
  };
  var TYPES={surprise:"🎁 Surprise en boutique",savoir:"💡 Le saviez-vous ?",defi:"📸 Le défi du jour",jeu:"🎮 Un jeu",astuce:"🥖 L'astuce du boulanger"};

  /* ---------- où en est-on ? (heure de Paris) ----------
     jour : dernière case ouvrable (0 avant le 1er décembre, 24 après Noël et sur la maquette)
     aujourdhui : la case du jour (null hors période) ; sur la maquette, on montre le 1er décembre, jour de l'ouverture du site */
  function etat(){
    var P=J.paris(), enAvent=(P.m===12 && P.d<=24);
    return {
      P:P, annee:P.y, enAvent:enAvent, apresNoel:(P.m===12 && P.d>24),
      jour: J.DEMO ? 24 : (P.m===12 ? Math.min(P.d,24) : 0),
      aujourdhui: enAvent ? P.d : (J.DEMO ? 1 : null)
    };
  }
  function ouvertes(){ return J.store.get("avent:"+etat().annee,[]); }
  function marquer(n){ var a=etat().annee, o=J.store.get("avent:"+a,[]); if(o.indexOf(n)<0){ o.push(n); J.store.set("avent:"+a,o); } }

  /* ---------- la fenêtre de surprise (créée à la demande) ---------- */
  var voile=null, dernierFocus=null;
  function construire(){
    voile=document.createElement("div"); voile.className="av-voile"; voile.setAttribute("aria-hidden","true");
    voile.innerHTML='<div class="av-surprise" role="dialog" aria-modal="true" aria-labelledby="av-titre">'+
      '<button class="av-fermer" type="button" aria-label="Fermer">✕</button>'+
      '<div class="av-jour"></div><div class="av-gros" aria-hidden="true"></div><span class="av-type"></span>'+
      '<h2 id="av-titre"></h2><p class="av-texte"></p><div class="av-bon"></div><div class="av-action"></div></div>';
    document.body.appendChild(voile);
    voile.querySelector(".av-fermer").addEventListener("click",fermer);
    voile.addEventListener("click",function(e){ if(e.target===voile) fermer(); });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape" && voile.classList.contains("on")) fermer(); });
  }
  function montrer(n,premiere){
    if(!voile) construire();
    var C=CASES[n], E=etat(), q=function(s){ return voile.querySelector(s); };
    q(".av-jour").textContent=n+(n===1?"er":"")+" décembre";
    var em=q(".av-gros"); em.textContent=C.em; em.style.animation="none"; void em.offsetWidth; em.style.animation="";
    q(".av-type").textContent=TYPES[C.t]; q("#av-titre").textContent=C.titre;
    q(".av-texte").textContent=C.texte||""; q(".av-texte").hidden=!C.texte;
    var bon=q(".av-bon"), act=q(".av-action"); bon.innerHTML=""; act.innerHTML="";
    if(C.t==="surprise"){
      var valable = J.DEMO || (E.P.m===12 && E.P.d===n);
      if(valable){ J.ticket(bon,{titre:"Case n°"+n,gain:C.gain,cond:C.cond,code:J.code("AVENT",String(n)),cle:"avent-"+E.annee+"-"+n}); }
      else { var e=document.createElement("div"); e.className="av-expire"; e.textContent="Cette surprise ("+C.gain.toLowerCase()+") était valable le "+n+" décembre. Reviens demain pour la suivante !"; bon.appendChild(e); }
    }
    if(C.lien){ var a=document.createElement("a"); a.className="btn btn-gold"; a.href=C.lien[0]; a.textContent=C.lien[1]; act.appendChild(a); }
    dernierFocus=document.activeElement;
    voile.classList.add("on"); voile.setAttribute("aria-hidden","false");
    setTimeout(function(){ q(".av-fermer").focus(); },50);
    if(premiere){ J.confettis({nombre:C.t==="surprise"?160:80}); J.vibrer(30); }
  }
  function fermer(){ if(!voile) return; voile.classList.remove("on"); voile.setAttribute("aria-hidden","true"); if(dernierFocus && dernierFocus.focus) dernierFocus.focus(); }

  return {CASES:CASES, TYPES:TYPES, etat:etat, ouvertes:ouvertes, marquer:marquer, montrer:montrer, fermer:fermer};
})();
