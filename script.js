const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spin-button");
const ctaBtn = document.getElementById("cta-button");

const sectors = [
    "Try Again",
    "Try Again",
    "Missed Out!",
    "Missed Out!",
    "$10 Amazon Card",
    "$20 Amazon Card",
    "$50 Amazon Card",
    "$100 Amazon Card"
];

const colors = [
    "#FF9900","#FFB84D","#FF9900","#FFB84D","#FF9900","#FFB84D","#FF9900","#FFB84D"
];

let startAngle = 0;
const arc = 2 * Math.PI / sectors.length;
const spinTimeTotal = 3000;
let spinning = false;

function drawWheel() {
    const radius = wheel.width / 2;
    ctx.clearRect(0,0,wheel.width,wheel.height);

    for(let i=0;i<sectors.length;i++){
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(radius,radius);
        ctx.arc(radius,radius,radius, angle, angle + arc);
        ctx.fill();
        ctx.save();

        ctx.translate(radius, radius);
        ctx.rotate(angle + arc/2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Montserrat";
        ctx.fillText(sectors[i], radius - 10, 0);
        ctx.restore();
    }
}

drawWheel();

function spin() {
    if(spinning) return;
    spinning = true;
    let spins = 0;
    const totalSpins = 60;
    const targetIndex = sectors.indexOf("$100 Amazon Card");

    function animate() {
        spins++;
        startAngle += 0.2 + spins*0.002; 
        drawWheel();
        if(spins < totalSpins){
            requestAnimationFrame(animate);
        } else {
            const finalAngle = (targetIndex * arc) - arc/2;
            startAngle = finalAngle;
            drawWheel();
            spinBtn.style.display = "none";
            ctaBtn.style.display = "block";
            spinning = false;
        }
    }
    animate();
}

spinBtn.addEventListener("click", spin);
ctaBtn.addEventListener("click", () => window.location.href="https://www.google.com");

function startCountdown(duration){
    let timer = duration, minutes, seconds;
    const display = document.getElementById("countdown");
    setInterval(() => {
        minutes = parseInt(timer/60,10);
        seconds = parseInt(timer%60,10);
        display.textContent = `${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`;
        if(--timer<0) timer=0;
    },1000);
}

startCountdown(300);
