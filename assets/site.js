(function(){
  var doc=document.documentElement, reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');
  if(reduce){document.querySelectorAll('video[autoplay]').forEach(function(v){v.removeAttribute('autoplay');v.pause();});}
  var y=document.querySelector('.yr'); if(y) y.textContent=new Date().getFullYear();

  // mobile menu
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(btn&&nav) btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);});

  // header: solid after hero, hides on scroll down, returns on scroll up
  var header=document.querySelector('.site-header'), lastY=0;
  function onScroll(){
    var sy=window.scrollY; if(!header) return;
    header.classList.toggle('scrolled',sy>40);
    header.classList.toggle('hide',sy>lastY&&sy>500&&!(nav&&nav.classList.contains('open')));
    lastY=sy;
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  // close mobile menu after choosing a section
  if(nav) nav.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');if(btn)btn.setAttribute('aria-expanded',false);});});

  // highlight the menu link of the section in view
  var navLinks=document.querySelectorAll('nav ul a[href^="#"]');
  if(navLinks.length&&'IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting) return;
      navLinks.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id);});
    });},{rootMargin:'-45% 0px -50% 0px'});
    navLinks.forEach(function(l){var t=document.querySelector(l.getAttribute('href')); if(t) so.observe(t);});
  }

  // reveal on scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el);});
  } else els.forEach(function(el){el.classList.add('in');});

  // count-up numbers
  // years since founding: always current, e.g. data-since="1983"
  document.querySelectorAll('[data-since]').forEach(function(el){
    var yrs=new Date().getFullYear()-(+el.dataset.since), suf=el.dataset.suffix||'';
    el.dataset.count=yrs;
    el.textContent=(document.body.classList.contains('lang-ar')?yrs.toLocaleString('ar-SA'):String(yrs))+suf;
  });
  var nums=document.querySelectorAll('[data-count]');
  if('IntersectionObserver' in window&&!reduce){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting) return; co.unobserve(e.target);
      var el=e.target, end=+el.dataset.count, suf=el.dataset.suffix||'', t0=null, ar=document.body.classList.contains('lang-ar');
      function fmt(n){return ar?n.toLocaleString('ar-SA'):String(n);}
      function step(t){t0=t0||t; var p=Math.min((t-t0)/1400,1), k=1-Math.pow(1-p,3); el.textContent=fmt(Math.round(end*k))+suf; if(p<1) requestAnimationFrame(step);}
      requestAnimationFrame(step);
    });},{threshold:.6});
    nums.forEach(function(n){co.observe(n);});
  }

  var CLOSE='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var closeLabel=document.body.classList.contains('lang-ar')?'إغلاق':'Close';
  function makeDialog(inner){
    var d=document.createElement('dialog'); d.className='overlay';
    d.innerHTML='<button class="x" type="button" aria-label="'+closeLabel+'">'+CLOSE+'</button>'+inner;
    document.body.appendChild(d);
    d.querySelector('.x').addEventListener('click',function(){d.close();});
    d.addEventListener('click',function(e){if(e.target===d) d.close();});
    return d;
  }

  // video overlay: any element with data-video="path.mp4"
  var vd=null;
  document.querySelectorAll('[data-video]').forEach(function(t){
    t.addEventListener('click',function(e){
      e.preventDefault();
      if(!vd){
        vd=makeDialog('<div class="overlay-body"><video controls playsinline></video></div>');
        vd.addEventListener('close',function(){var v=vd.querySelector('video');v.pause();v.removeAttribute('src');v.load();});
      }
      var body=vd.querySelector('.overlay-body'), v=vd.querySelector('video');
      body.classList.toggle('tall',t.dataset.tall==='1');
      v.src=t.dataset.video; if(t.dataset.poster) v.poster=t.dataset.poster;
      vd.setAttribute('aria-label',t.dataset.title||t.getAttribute('aria-label')||'Video');
      vd.showModal(); var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){});
    });
  });

  // product gallery overlay: data-gallery='["a.jpg","b.jpg"]' data-title="..."
  var gd=null, list=[], i=0, ar=document.body.classList.contains('lang-ar');
  function show(){
    var img=gd.querySelector('.g-img'); img.src=list[i]; img.alt=gd.querySelector('h2').textContent;
    gd.querySelector('.g-count').textContent=(i+1)+' / '+list.length;
    gd.querySelector('.g-prev').disabled=i===0; gd.querySelector('.g-next').disabled=i===list.length-1;
  }
  document.querySelectorAll('[data-gallery]').forEach(function(b){
    b.addEventListener('click',function(){
      if(!gd){
        gd=makeDialog('<div class="overlay-body"><img class="g-img" alt=""><div class="g-bar"><h2></h2><div class="g-nav">'+
          '<button class="g-prev" type="button" aria-label="'+(ar?'السابق':'Previous')+'">'+(ar?'→':'←')+'</button><span class="g-count"></span>'+
          '<button class="g-next" type="button" aria-label="'+(ar?'التالي':'Next')+'">'+(ar?'←':'→')+'</button></div></div></div>');
        gd.querySelector('.g-prev').onclick=function(){if(i>0){i--;show();}};
        gd.querySelector('.g-next').onclick=function(){if(i<list.length-1){i++;show();}};
      }
      list=JSON.parse(b.dataset.gallery); i=0; gd.querySelector('h2').textContent=b.dataset.title;
      gd.setAttribute('aria-label',b.dataset.title); show(); gd.showModal();
    });
  });

  // contact form "thank you" message after redirect
  if(location.search.indexOf('sent=1')>-1){var s=document.querySelector('.sent'); if(s) s.hidden=false;}
})();
