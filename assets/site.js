(function(){
  var yt=document.querySelector('.yt-bg');
  if(yt){ if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){yt.remove();} else {yt.addEventListener('load',function(){setTimeout(function(){yt.classList.add('ready');},1500);});} }
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('video[autoplay]').forEach(function(v){v.removeAttribute('autoplay');v.pause();});}
  var y=document.querySelector('.yr'); if(y) y.textContent=new Date().getFullYear();
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(btn&&nav) btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  // contact form "thank you" message after redirect
  if(location.search.indexOf('sent=1')>-1){var s=document.querySelector('.sent'); if(s) s.hidden=false;}
  // product gallery
  var d=document.querySelector('dialog.gallery'); if(!d) return;
  var img=d.querySelector('.g-img'), title=d.querySelector('.g-title'), cnt=d.querySelector('.g-count'),
      prev=d.querySelector('.g-prev'), next=d.querySelector('.g-next'), list=[], i=0;
  function show(){img.src=list[i]; img.alt=title.textContent; cnt.textContent=(i+1)+' / '+list.length;
    prev.disabled=i===0; next.disabled=i===list.length-1;}
  document.querySelectorAll('[data-gallery]').forEach(function(b){
    b.addEventListener('click',function(){list=JSON.parse(b.dataset.gallery); i=0; title.textContent=b.dataset.title; show(); d.showModal();});
  });
  prev.onclick=function(){if(i>0){i--;show();}}; next.onclick=function(){if(i<list.length-1){i++;show();}};
  d.querySelector('.g-close').onclick=function(){d.close();};
  d.addEventListener('click',function(e){if(e.target===d) d.close();});
})();
