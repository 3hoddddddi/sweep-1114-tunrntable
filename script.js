const SEGMENTS = [
  {title:"$10 Amazon Card"},
  {title:"Try Again"},
  {title:"$20 Amazon Card"},
  {title:"Missed Out!"},
  {title:"$50 Amazon Card"},
  {title:"Try Again"},
  {title:"$100 Amazon Card"},
  {title:"Missed Out!"}
];
const COLORS = ["#FF9900","#C94C4C","#FF9900","#C94C4C","#FF9900","#C94C4C","#FF9900","#C94C4C"];
const TARGET_INDEX = 6; // $100
const CANVAS_LOGICAL = 500;

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const wheelWrap = document.getElementById('wheelWrap');
const spinCard = document.getElementById('spinCard');
const ctaBtn = document.getElementById('ctaBtn');
const giftCard = document.getElementById('giftCard');
const countdownEl = document.getElementById('countdown');
const centerArrow = document.getElementById('centerArrow');

let total = SEGMENTS.length;
let arc = (2 * Math.PI) / total;
let radius = CANVAS_LOGICAL / 2;
let spinning = false;

let countdownSeconds = 300;
function startCountdown(){
  updateCountdown();
  setInterval(()=>{
    countdownSeconds--;
    if(countdownSeconds<=0){ countdownEl.textContent="00:00"; spinCard.style.pointerEvents='none'; } 
    else updateCountdown();
  },1000);
}
function updateCountdown(){
  const m = Math.floor(countdownSeconds/60);
  const s = countdownSeconds%60;
  countdownEl.textContent=(m<10?'0'+m:m)+':'+(s<10?'0'+s:s);
}

function fitCanvas(){
  const rect = wheelWrap.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  canvas.style.width = size+'px';
  canvas.style.height = size+'px';
  canvas.width = CANVAS_LOGICAL;
  canvas.height = CANVAS_LOGICAL;
  radius = CANVAS_LOGICAL/2;
}
window.addEventListener('resize', ()=>{ fitCanvas(); drawWheel(); adjustGiftPosition(); });
fitCanvas();

function drawWheel(highlightIndex=-1){
  ctx.clearRect(0,0,CANVAS_LOGICAL,CANVAS_LOGICAL);
  ctx.save();
  ctx.translate(radius,radius);

  for(let i=0;i<total;i++){
    const start = i*arc - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,radius-6,start,start+arc,false);
    ctx.closePath();
    ctx.fillStyle = COLORS[i];
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const midAng = start+arc/2;
    const textR = radius-40;
    const x = Math.cos(midAng)*textR;
    const y = Math.sin(midAng)*textR;

    ctx.save();
    ctx.translate(x,y);
    let rot = midAng + Math.PI/2;
    let norm = midAng;
    if(norm<0) norm+=Math.PI*2;
    if(norm>Math.PI/2 && norm<1.5*Math.PI) rot+=Math.PI;
    ctx.rotate(rot);
    ctx.fillStyle="#fff";
    ctx.font="800 16px Montserrat";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText(SEGMENTS[i].title,0,-8);
    ctx.restore();
  }
  ctx.restore();
}

drawWheel();

function adjustGiftPosition(){
  const wrap = wheelWrap.getBoundingClientRect();
  const page = document.querySelector('.page').getBoundingClientRect();
  const top = wrap.top - page.top - wrap.height*0.12;
  const left = wrap.left - page.left + wrap.width*0.02;
  giftCard.style.top=top+'px';
  giftCard.style.left=left+'px';
  giftCard.style.width=Math.min(520,wrap.width*0.64)+'px';
}
window.addEventListener('load', ()=>{ fitCanvas(); drawWheel(); adjustGiftPosition(); startCountdown(); });
setTimeout(()=>{ adjustGiftPosition(); },300);

/* arrow spin instead of wheel spin */
spinCard.addEventListener('click', startSpin);
spinCard.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' ') startSpin();});

function startSpin(){
  if(spinning) return;
  if(countdownSeconds<=0) return;
  spinning=true;
  spinCard.style.display='none';

  const degPer = 360/total;
  const targetCenterDeg = TARGET_INDEX*degPer + degPer/2;
  const spins = 6 + Math.floor(Math.random()*2);
  const jitter = (Math.random()*6-3);
  const finalDeg = spins*360 + targetCenterDeg + jitter;
  const duration = 4200;
  const start = performance.now();
  const startDeg = 0;

  function animate(now){
    const elapsed = now-start;
    const t = Math.min(1,elapsed/duration);
    const ease = 1-Math.pow(1-t,3);
    const currentDeg = startDeg + (finalDeg-startDeg)*ease;
    centerArrow.style.transform = `translate(-50%,-50%) rotate(${currentDeg}deg)`;
    drawWheel(Math.floor(Math.random()*total));
    if(elapsed<duration) requestAnimationFrame(animate);
    else{
      const finalNorm = finalDeg%360;
      centerArrow.style.transform=`translate(-50%,-50%) rotate(${finalNorm}deg)`;
      drawWheel(TARGET_INDEX);
      setTimeout(()=>{ ctaBtn.style.display='block'; spinning=false; },420);
    }
  }
  requestAnimationFrame(animate);
}
