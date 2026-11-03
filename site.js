const chapters=[...document.querySelectorAll('.chapter')];
const links=[...document.querySelectorAll('.chapters a')];
const progress=document.querySelector('.progress');
const active=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const index=chapters.indexOf(entry.target);
    links.forEach((link,i)=>{
      if(i===index){link.setAttribute('aria-current','location');link.scrollIntoView({block:'nearest',inline:'nearest'});}
      else link.removeAttribute('aria-current');
    });
  }
},{rootMargin:'-35% 0px -55% 0px'});
chapters.forEach(chapter=>active.observe(chapter));
let pending=false;
addEventListener('scroll',()=>{
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;
    pending=false;
  });
},{passive:true});
