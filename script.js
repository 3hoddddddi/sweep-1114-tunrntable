/* Countdown timer */
let countdownEl = document.getElementById('countdown');
let timeLeft = 5 * 60;
let countdownInterval = setInterval(() => {
  let minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  let seconds = String(timeLeft % 60).padStart(2, '0');
  countdownEl.textContent = `Event ends in ${minutes}:${seconds}`;
  timeLeft--;
  if(timeLeft < 0){
    clearInterval(countdownInterval);
    countdownEl.textContent = "This round is closed. Stay tuned for what's next.";
    document.getElementById('spinBtn').disabled = true;
  }
}, 1000);

/* Wheel drawing */
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const segments = ["$20 Amazon Card","Try Again","$50 Amazon Card","Missed Out!","$100 Amazon Card"];
const colors = ["#FF9900","#C94C4C","#FF9900","#C94C4C","#FF9900"];
const segCount = segments.length;
const center = canvas.width/2;
const radius = canvas.width/2;

function drawWheel() {
  for(let i=0; i<segCount; i++){
    let angle = (2*Math.PI / segCount)*i;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, angle, angle + 2*Math.PI/segCount);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle + Math.PI/segCount);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText(segments[i], radius-10, 0);
    ctx.restore();
  }
}
drawWheel();

/* Spin action */
const spinBtn = document.getElementById('spinBtn');
const arrow = document.querySelector('.arrow');
const claimBtn = document.getElementById('claimBtn');

spinBtn.addEventListener('click', () => {
  spinBtn.style.display = 'none';
  let spins = 5;
  let stopIndex = 4; // $100 Amazon Card
  let stopAngle = (2*Math.PI/segCount)*stopIndex + (2*Math.PI/segCount)/2;
  let targetRotation = spins*2*Math.PI + stopAngle;
  let duration = 4000;
  let start = null;

  function animate(time){
    if(!start) start = time;
    let progress = (time - start)/duration;
    if(progress>1) progress=1;
    let eased = easeOutCubic(progress);
    let rotation = eased * targetRotation;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.translate(center, center);
    ctx.rotate(rotation);
    ctx.translate(-center, -center);
    drawWheel();
    ctx.setTransform(1,0,0,1,0,0);
    if(progress<1){
      requestAnimationFrame(animate);
    } else {
      claimBtn.style.display = 'block';
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
  requestAnimationFrame(animate);
});

function easeOutCubic(t) {
  return (--t)*t*t +1;
}
