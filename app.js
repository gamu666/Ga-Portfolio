const posterCards = [...document.querySelectorAll('.poster-card')];
const posterStage = document.querySelector('#poster-track');
const posterCurrent = document.querySelector('#poster-current');
const posterAtmosphere = document.querySelector('.poster-gallery__atmosphere');
let activePoster = 0;

function selectPoster(index) {
  activePoster = (index + posterCards.length) % posterCards.length;
  posterCards.forEach((card, cardIndex) => {
    const raw = (cardIndex - activePoster + posterCards.length) % posterCards.length;
    const position = raw === 0 ? 'active' : raw === 1 ? 'next' : raw === posterCards.length - 1 ? 'previous' : 'hidden';
    card.classList.remove('is-active', 'is-next', 'is-previous', 'is-hidden');
    card.classList.add(`is-${position}`);
    card.setAttribute('aria-hidden', position === 'active' ? 'false' : 'true');
  });
  const image = posterCards[activePoster].querySelector('img');
  posterAtmosphere.style.setProperty('--poster-atmosphere', `url("${image.getAttribute('src')}")`);
  posterCurrent.textContent = String(activePoster + 1).padStart(2, '0');
}

document.querySelector('[data-poster-prev]').addEventListener('click', () => selectPoster(activePoster - 1));
document.querySelector('[data-poster-next]').addEventListener('click', () => selectPoster(activePoster + 1));
posterStage.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  selectPoster(activePoster + (event.key === 'ArrowRight' ? 1 : -1));
});

const reelGroups = [
  {name:'Мэдээлэл, танилцуулга',ids:['1238366678503088','1356997826584773','1975730753331702','2109531003310060']},
  {name:'Хөтлөгчтэй Reels',ids:['1521086066319437','2040608576768614','1374488004301337','1408656537627493']},
  {name:'Баримт, тайлбар',ids:['2161274491035624','1726248254761906','1102640107956219']},
];
const allReels = reelGroups.flatMap((group,groupIndex)=>group.ids.map((id,index)=>({
  src:`assets/videos/${id}.mp4`,
  poster:`assets/reel-thumbnails/${id}.jpg`,
  original:`https://www.facebook.com/reel/${id}/`,
  title:`Reel ${String(index+1).padStart(2,'0')}`,
  category:group.name,
  group:groupIndex,
})));
const remaxReels = ['01','02'].map(number=>({src:`assets/videos/remax-${number}.mp4`,poster:`assets/reel-thumbnails/remax-${number}.jpg`,original:`https://www.facebook.com/reel/${number==='01'?'1113862011192577':'1994296164445177'}/`,title:`RE/MAX · ${number==='01'?'King Tower':'Sydney Tower'}`,category:reelGroups[0].name,group:0,directVideo:false}));
// Move the complete reel record, keeping its video, thumbnail and original post together.
allReels.unshift(...remaxReels);
const productReels = [{id:'altan-od',title:'Altan Od'},{id:'dk-nasal',title:'DK Nasal',original:'https://www.facebook.com/share/r/1Jos6t9VMk/'}].map(({id,title,original})=>({
  src:`assets/videos/${id}.mp4`,poster:`assets/reel-thumbnails/${id}.jpg`,
  original:original||`assets/videos/${id}.mp4`,title,category:reelGroups[0].name,group:0,directVideo:!original,
}));
allReels.splice(2,0,...productReels);
let reels = allReels.filter(reel=>reel.group===0);

const player = document.querySelector('#reel-player');
const strip = document.querySelector('#reel-filmstrip');
const reelTitle = document.querySelector('#reel-title');
const reelCategory = document.querySelector('#reel-category');
const reelCounter = document.querySelector('#reel-counter');
const originalLink = document.createElement('a');
originalLink.className='reel-original-link';
originalLink.target='_blank';
originalLink.rel='noopener noreferrer';
originalLink.innerHTML='Эх нийтлэлийг үзэх <span aria-hidden="true">↗</span>';
const reelActions=document.createElement('div');reelActions.className='reel-actions';reelActions.append(originalLink);
document.querySelector('.reel-showcase').after(reelActions);
let activeReel = 0;
const reelAtmosphere = document.createElement('div');
reelAtmosphere.className = 'reel-atmosphere';
reelAtmosphere.setAttribute('aria-hidden', 'true');
const reelBackgrounds = allReels.map(reel => {
  const layer = document.createElement('div');
  layer.style.backgroundImage = `url("${reel.poster}")`;
  reelAtmosphere.append(layer);
  return layer;
});
document.querySelector('.reel-section').prepend(reelAtmosphere);

function renderReelStrip() {
strip.replaceChildren();
reels.forEach((reel, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'reel-thumb';
  button.setAttribute('aria-label', `${reel.title} — ${reel.category}`);
  button.innerHTML = `<span class="reel-thumb__visual"><img src="${reel.poster}" alt="" width="220" height="390" loading="lazy"></span><span class="reel-thumb__copy"><b>${reel.title}</b><small>${reel.category}</small></span>`;
  button.addEventListener('click', () => selectReel(index, true));
  strip.append(button);
});
}
const tabs=document.createElement('div');tabs.className='reel-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Reel төрөл');
document.querySelector('.reel-showcase').before(tabs);
reelGroups.forEach((group,index)=>{const button=document.createElement('button');button.type='button';button.textContent=group.name;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(index===0));button.setAttribute('aria-controls','reel-panel');button.id=`reel-tab-${index}`;button.tabIndex=index===0?0:-1;button.onclick=()=>{reels=allReels.filter(reel=>reel.group===index);[...tabs.children].forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});reelPanel.setAttribute('aria-labelledby',button.id);renderReelStrip();selectReel(0);};tabs.append(button);});
const reelPanel=document.createElement('div');reelPanel.id='reel-panel';reelPanel.setAttribute('role','tabpanel');reelPanel.setAttribute('aria-labelledby','reel-tab-0');tabs.after(reelPanel);reelPanel.append(document.querySelector('.reel-showcase'),reelActions,strip);
[...tabs.children].forEach((button,index)=>{const count=allReels.filter(reel=>reel.group===index).length;const badge=document.createElement('span');badge.className='reel-tab-count';badge.textContent=count;button.append(badge);button.setAttribute('aria-label',`${reelGroups[index].name}, ${count} reel`);});
tabs.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const buttons=[...tabs.children];const current=buttons.indexOf(document.activeElement);const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(current+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].click();buttons[next].focus();});
renderReelStrip();

function selectReel(index, play = false) {
  activeReel = (index + reels.length) % reels.length;
  const reel = reels[activeReel];
  reelBackgrounds.forEach((layer, index) => layer.classList.toggle('is-active', allReels[index] === reel));
  player.pause();
  player.src = reel.src;
  player.poster = reel.poster;
  originalLink.href = reel.original;
  originalLink.innerHTML = `${reel.directVideo?'Эх видеог үзэх':'Эх нийтлэлийг үзэх'} <span aria-hidden="true">↗</span>`;
  reelTitle.textContent = reel.title;
  reelCategory.textContent = reel.category;
  reelCounter.textContent = `${String(activeReel + 1).padStart(2, '0')} / ${String(reels.length).padStart(2, '0')}`;
  [...strip.children].forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === activeReel));
  const thumb = strip.children[activeReel];
  strip.scrollTo({left:thumb.offsetLeft-strip.offsetLeft-(strip.clientWidth-thumb.offsetWidth)/2,behavior:play?'smooth':'auto'});
  if (play) player.play().catch(() => {});
}

document.querySelector('.reel-arrow--prev').addEventListener('click', () => selectReel(activeReel - 1, true));
document.querySelector('.reel-arrow--next').addEventListener('click', () => selectReel(activeReel + 1, true));
document.querySelectorAll('.reel-arrow, .series-prev, .series-next').forEach(button => {
  const previous = button.matches('.reel-arrow--prev, .series-prev');
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${previous ? 'm14 5-7 7 7 7' : 'm10 5 7 7-7 7'}"/></svg>`;
});
selectPoster(0);
selectReel(0);
