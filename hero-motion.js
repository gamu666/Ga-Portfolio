const ambientVideo=document.querySelector('[data-motion-src]');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let ambientVisible=true;
function syncAmbient(){
  if(reducedMotion.matches||document.hidden||!ambientVisible){ambientVideo.pause();return;}
  if(!ambientVideo.getAttribute('src')){ambientVideo.src=ambientVideo.dataset.motionSrc;ambientVideo.load();}
  ambientVideo.play().catch(()=>{});
}
new IntersectionObserver(entries=>{ambientVisible=entries[0].isIntersecting;syncAmbient();},{threshold:.05}).observe(document.querySelector('.hero'));
document.addEventListener('visibilitychange',syncAmbient);
reducedMotion.addEventListener('change',syncAmbient);
