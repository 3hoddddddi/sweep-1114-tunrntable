/* configuration */
const SEGMENTS = [
  {title:"$10", subtitle:"AMAZON"},
  {title:"Try Again", subtitle:""},
  {title:"$20", subtitle:"AMAZON"},
  {title:"Missed it!", subtitle:""},
  {title:"$50", subtitle:"AMAZON"},
  {title:"Try Again", subtitle:""},
  {title:"$100", subtitle:"AMAZON"},
  {title:"Missed it!", subtitle:""}
];
const COLORS = ["#FF9900","#C94C4C","#FF9900","#C94C4C","#FF9900","#C94C4C","#FF9900","#C94C4C"];
const TARGET_INDEX = 6; // index of $100
const CANVAS_LOGICAL = 500;

/* elements */
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const wheelWrap = document.getElementById('wheelWrap');
const spinCard = document.getElementById('spinCard');
const ctaBtn = document.getElementById('ctaBtn');
const giftCard = document.getElementById('giftCard');

let total = SEGMENTS.length;
let arc = (2 * Math.PI) / total;
let radius = CANVAS_LOGICAL / 2;
let currentRotation = 0; // radians
let spinning = false;

/* responsive fit */
function fitCanvas(){
  const rect = wheelWrap.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  canvas.width = CANVAS_LOGICAL;
  canvas.height = CANVAS_LOGICAL;
  radius = CANVAS_LOGICAL / 2;
}
window.addEventListener('resize', ()=>{ fitCanvas(); drawWheel(currentRotation); adjustGiftPosition(); });
fitCanvas();

/* draw wheel with horizontal perimeter text */
function drawWheel(rotation, highlightIndex = -1){
  ctx.clearRect(0,0,CANVAS_LOGICAL,CANVAS_LOGICAL);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(rotation);

  for(let i=0;i<total;i++){
    const start = i * arc - Math.PI/2;
    // fill
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0, radius - 6, start, start + arc, false);
    ctx.closePath();
    ctx.fillStyle = COLORS[i];
    ctx.fill();
    // separator
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // perimeter text horizontal
    const midAng = start + arc/2;
    const textR = radius - 40;
    const x = Math.cos(midAng) * textR;
    const y = Math.sin(midAng) * textR;

    ctx.save();
    ctx.translate(x, y);

    // flip bottom-half to keep text upright
    let deg = midAng * 180 / Math.PI;
    if(deg > 90 && deg < 270){
      ctx.rotate(Math.PI);
    }

    // text
    ctx.fillStyle = "#fff";
    ctx.font = "700 16px Montserrat";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(SEGMENTS[i].title, 0, -6);
    if(SEGMENTS[i].subtitle){
      ctx.font = "600 12px Montserrat";
      ctx.fillText(SEGMENTS[i].subtitle, 0, 12);
    }
    ctx.restore();
  }

  // inner rings
  ctx.beginPath(); ctx.arc(0,0,78,0,Math.PI*2); ctx.fillStyle="#ffffff"; ctx.fill();
  ctx.beginPath(); ctx.arc(0,0,62,0,Math.PI*2); ctx.fillStyle="#fff6e6"; ctx.fill();
  ctx.restore();

  // outer subtle ring
  ctx.beginPath(); ctx.arc(radius, radius, radius - 3, 0, Math.PI*2);
  ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 6; ctx.stroke();
}

/* initial draw */
drawWheel(currentRotation);

/* position gift card (below header, under wheel) */
function adjustGiftPosition(){
  const wrap = wheelWrap.getBoundingClientRect();
  const page = document.querySelector('.page').getBoundingClientRect();
  giftCard.style.top = (wrap.top - page.top + wrap.height*0.06) + 'px';
  giftCard.style.left = (wrap.left - page.left + wrap.width*0.06) + 'px';
}
window.addEventListener('load', ()=>{ fitCanvas(); drawWheel(currentRotation); adjustGiftPosition(); });
setTimeout(()=>{ adjustGiftPosition(); }, 300);

/* spin function: hide center immediately, animate to target, random highlight while spinning */
spinCard.addEventListener('click', startSpin);
spinCard.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') startSpin(); });

function startSpin(){
  if(spinning) return;
  spinning = true;
  spinCard.style.display = 'none';

  const spins = 6 + Math.floor(Math.random()*2);
  const degPer = 360 / total;
  const finalDeg = spins*360 + (-90 - (TARGET_INDEX * degPer + degPer/2)) + (Math.random()*6 - 3);
  const finalRad = finalDeg * Math.PI / 180;

  const duration = 4200;
  const startTime = performance.now();
  const startRot = currentRotation;
  const change = finalRad - startRot;

  function animate(now){
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const ease = 1 - Math.pow(1 - t, 3);
    currentRotation = startRot + change * ease;

    // random highlight index to create sparkle effect
    const highlight = Math.floor(Math.random()*total);
    drawWheel(currentRotation, highlight);

    if(elapsed < duration){
      requestAnimationFrame(animate);
    } else {
      // finalize
      currentRotation = finalRad % (Math.PI*2);
      drawWheel(currentRotation, TARGET_INDEX);
      // show CTA after short delay
      setTimeout(()=>{ ctaBtn.style.display = 'block'; ctaBtn.setAttribute('aria-hidden','false'); dropConfetti(18); spinning=false; }, 420);
    }
  }
  requestAnimationFrame(animate);
}

/* confetti as $ falling */
function dropConfetti(count){
  const container = document.createElement('div');
  container.style.position='fixed'; container.style.left='0'; container.style.top='0';
  container.style.width='100%'; container.style.height='100%'; container.style.pointerEvents='none';
  container.style.zIndex='60';
  document.body.appendChild(container);

  for(let i=0;i<count;i++){
    const el = document.createElement('div');
    el.textContent = '$';
    el.style.position='absolute';
    el.style.left = (Math.random()*100)+'%';
    el.style.top = '-5%';
    el.style.fontSize = (12 + Math.random()*18) + 'px';
    el.style.color = 'rgba(255,215,128,0.95)';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.opacity = '0.95';
    el.style.transition = `transform ${2 + Math.random()*1}s linear, top ${2 + Math.random()*1.2}s linear`;
    container.appendChild(el);
    setTimeout(()=>{ el.style.top = (80 + Math.random()*20) + '%'; el.style.transform = `rotate(${Math.random()*360}deg) translateY(0)`; }, 40 + i*30);
    setTimeout(()=>{ el.remove(); if(i===count-1) container.remove(); }, 4200);
  }
}

/* CTA click */
ctaBtn.addEventListener('click', ()=>{ window.location.href = 'https://www.google.com'; });
