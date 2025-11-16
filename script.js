const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const ctaBtn = document.getElementById("ctaBtn");

let segments = [
    { prize: "$10", name: "AMAZON" },
    { prize: "Try Again", name: "" },
    { prize: "$20", name: "AMAZON" },
    { prize: "Missed it!", name: "" },
    { prize: "$50", name: "AMAZON" },
    { prize: "Try Again", name: "" },
    { prize: "$100", name: "AMAZON" },
    { prize: "Missed it!", name: "" }
];

let colors = [
    "#ff9900", "#1a1a1a", "#ff9900", "#1a1a1a",
    "#ff9900", "#1a1a1a", "#ff9900", "#1a1a1a"
];

let startAngle = 0;
let arc = Math.PI / 4;

function drawWheel(highlightIndex = -1) {
    for (let i = 0; i < segments.length; i++) {
        let angle = startAngle + i * arc;

        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(wheel.width/2, wheel.height/2);
        ctx.arc(wheel.width/2, wheel.height/2, wheel.width/2, angle, angle + arc);
        ctx.fill();

        // draw capsule badge
        ctx.save();
        ctx.translate(wheel.width/2, wheel.height/2);
        ctx.rotate(angle + arc/2);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.strokeStyle = highlightIndex === i ? "#ffcc00" : "rgba(255,255,255,0.2)";
        ctx.lineWidth = 3;
        ctx.fillRect(wheel.width/2 - 100, -20, 90, 40);
        ctx.strokeRect(wheel.width/2 - 100, -20, 90, 40);

        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(segments[i].prize, wheel.width/2 - 55, -5);
        ctx.fillText(segments[i].name, wheel.width/2 - 55, 15);
        ctx.restore();
    }
}

drawWheel();

spinBtn.addEventListener("click", () => {
    spinBtn.style.display = "none";

    let spinTime = 5500;
    let targetAngle = (Math.PI*6) + (arc * 6.2);
    let start = null;

    function rotate(timestamp) {
        if(!start) start = timestamp;
        let progress = timestamp - start;

        let rotation = easeOut(progress, 0, targetAngle, spinTime);
        startAngle = rotation;

        // highlight random segment during rotation
        let highlightIndex = Math.floor(Math.random()*segments.length);

        ctx.clearRect(0,0,wheel.width,wheel.height);
        drawWheel(highlightIndex);

        if(progress < spinTime){
            requestAnimationFrame(rotate);
        } else {
            // stop at $100 segment
            startAngle = 7*arc;
            ctx.clearRect(0,0,wheel.width,wheel.height);
            drawWheel(6); // highlight $100
            ctaBtn.classList.remove("hidden");
        }
    }

    requestAnimationFrame(rotate);
});

function easeOut(t,b,c,d){
    t/=d;
    return -c * t*(t-2) + b;
}

ctaBtn.addEventListener("click", () => {
    window.location.href = "https://google.com";
});
