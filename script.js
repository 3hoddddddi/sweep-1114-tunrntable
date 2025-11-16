const wheel = document.getElementById('wheel');
const ctx = wheel.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const claimBtn = document.getElementById('claim-btn');
const countdownEl = document.getElementById('countdown');

let countdown = 300;
function startCountdown(){
  const timer = setInterval(()=>{
    countdown--;
    if(countdown<0){clearInterval(timer);return;}
    const m = Math.floor(countdown/60);
    const s = countdown%60;
    countdownEl.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  },1000);
}
startCountdown();

// Wheel config
const segments = [
  'Try Again','Try Again','Missed Out!','Missed Out!',
  '$10 Amazon Card','$20 Amazon Card','$50 Amazon Card','$100 Amazon Card'
];
const colors = ['#ff9900','#ffa31a','#ffb347','#ffc966','#ffd28a','#ffe0a0','#fff0b3','#fff9cc'];

const centerX = wheel.width/2;
const centerY = wheel.height/2;
const radius = wheel.width/2 - 10;

// Draw wheel
function drawWheel(){
  const segAngle = 2*Math.PI / segments.length;
  for(let i=0;i<segments.length;i++){
    const startAngle = i*segAngle;
    const endAngle = startAngle + segAngle;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX,centerY,radius,startAngle,endAngle);
    ctx.fillStyle=colors[i];
    ctx.fill();
    ctx.save();
    ctx.translate(centerX,centerY);
    ctx.rotate(startAngle + segAngle/2);
    ctx.textAlign='right';
    ctx.fillStyle='#fff';
    ctx.font='bold 14px sans-serif';
    ctx.fillText(segments[i], radius-10, 5);
    ctx.restore();
  }
}
drawWheel();

let spinning = false;
spinBtn.addEventListener('click',()=>{
  if(spinning) return;
  spinning=true;
  spinBtn.style.display='none';
  claimBtn.style.display='block';

  let angle = 0
