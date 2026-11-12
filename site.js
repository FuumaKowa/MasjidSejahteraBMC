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

for(const copy of document.querySelectorAll('.source-copy')){
  copy.classList.add('copy-layout');
  [...copy.children].forEach((item,index)=>{
    if(item.tagName!=='P')return;
    const text=item.textContent.trim();
    if(/^Rajah\s+\d+/i.test(text)){item.classList.add('copy-caption');return;}
    if(text.length<=92&&!/[.!?;]/.test(text)&&!text.startsWith('•')){item.classList.add('copy-subhead');return;}
    if(text.startsWith('•'))item.classList.add('copy-bullet');
    if(index===0&&text.length>110)item.classList.add('copy-lead');
    if(text.length>320)item.classList.add('copy-wide');
  });
}