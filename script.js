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
const TARGET_INDEX = 6; // ensure final lands on $100
const CANVAS_LOGICAL = 500;

/* elements */
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const wheelWrap = document.getElementById('wheelWrap');
const spinCard = document.getElementById('spinCard');
const ctaBtn = document.getElementById('ctaBtn');
const giftCard = document.getElementById('giftCard');
const countdownEl = document.getElementById('countdown');

let total = SEGMENTS.length;
let arc = (2 * Math.PI) / total;
let radius = CANVAS_LOGICAL / 2;
let currentRotation = 0; // radians
let spinning = false;

/* countdown 5 minutes */
let countdownSeconds = 300;
let countdownTimer = null;
function startCountdown(){
  updateCountdown();
  countdownTimer = setInterval(()=>{
    countdownSeconds--;
    if(countdownSeconds <= 0){
      clearInterval(countdownTimer);
      countdownEl.textContent = "00:00";
      onCountdownEnd();
    } else {
      updateCountdown();
    }
  },1000);
}
function updateCountdown(){
  const m = Math.floor(countdownSeconds / 60);
  const s = countdownSeconds % 60;
  countdownEl.textContent = (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s);
}
function onCountdownEnd(){
  // show closed message and disable spin
  const header = document.querySelector('.header');
  header.querySelector('.countdown-line').textContent = "This round is closed. Stay tuned for what's next.";
  spinCard.style.pointerEvents = 'none';
  spinCard.style.opacity = '0.6';
  // hide CTA if visible
  ctaBtn.style.display = 'none';
}

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

/* draw wheel with radial text (text perpendicular to edge, facing outward) */
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

    // radial text: place near outer edge, rotate so text is perpendicular and faces outward
    const midAng = start + arc/2;
    const textR = radius - 36;
    const x = Math.cos(midAng) * textR;
    const y = Math.sin(midAng) * textR;

    ctx.save();
    ctx.translate(x, y);

    // rotate text so it is perpendicular to radius and facing outward
    let rot = midAng + Math.PI/2;
    // if on bottom half, flip 180deg so text faces outward
    let deg = midAng * 180 / Math.PI;
    if(deg > 90 && deg < 270){
      rot += Math.PI;
    }
    ctx.rotate(rot);

    // draw title vertically (rotated) but we will draw horizontally after rotation
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

  // no big white center circle; draw subtle center ring only
  ctx.beginPath(); ctx.arc(0,0,44,0,Math.PI*2); ctx.fillStyle="rgba(255,255,255,0.06)"; ctx.fill();
  ctx.beginPath(); ctx.arc(0,0,34,0,Math.PI*2); ctx.fillStyle="rgba(255,255,255,0.03)"; ctx.fill();
  ctx.restore();

  // outer subtle ring
  ctx.beginPath(); ctx.arc(radius, radius, radius - 3, 0, Math.PI*2);
  ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 6; ctx.stroke();
}

/* initial draw */
drawWheel(currentRotation);

/* adjust gift card position so it's partially covered by wheel (about 43% covered) */
function adjustGiftPosition(){
  const wrap = wheelWrap.getBoundingClientRect();
  const page = document.querySelector('.page').getBoundingClientRect();
  // place card so wheel covers around 43% of its width: push card left/up relative to wheel
  const top = wrap.top - page.top + wrap.height * 0.06;
  const left = wrap.left - page.left + wrap.width * 0.06;
  giftCard.style.top = top + 'px';
  giftCard.style.left = left + 'px';
  // scale card a bit larger for visibility
  giftCard.style.width = Math.min(420, wrap.width * 0.62) + 'px';
}
window.addEventListener('load', ()=>{ fitCanvas(); drawWheel(currentRotation); adjustGiftPosition(); startCountdown(); });
setTimeout(()=>{ adjustGiftPosition(); }, 300);

/* spin logic: hide center immediately, animate rotation to target, random highlight during spin */
spinCard.addEventListener('click', startSpin);
spinCard.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') startSpin(); });

function startSpin(){
  if(spinning) return;
  // if countdown ended, ignore
  if(countdownSeconds <= 0) return;
  spinning = true;
  // hide spin card immediately
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

    // random highlight index for sparkle effect during spin
    const highlight = Math.floor(Math.random()*total);
    drawWheel(currentRotation, highlight);

    if(elapsed < duration){
      requestAnimationFrame(animate);
    } else {
      // finalize
      currentRotation = finalRad % (Math.PI*2);
      drawWheel(currentRotation, TARGET_INDEX);
      // show CTA
      setTimeout(()=>{ ctaBtn.style.display = 'block'; ctaBtn.setAttribute('aria-hidden','false'); dropConfetti(18); spinning=false; }, 420);
    }
  }
  requestAnimationFrame(animate);
}

/* confetti as falling $ */
function dropConfetti(count){
  const container = document.createElement('div');
  container.style.position='fixed'; container.style.left='0'; container.style.top='0';
  container.style.width='100%'; container.style.height='100%'; container.style.pointerEvents='none';
  container.style.zIndex='80';
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
