const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const ctaBtn = document.getElementById("ctaBtn");

let segments = [
    "$10 Amazon Card",
    "Try Again",
    "$20 Amazon Card",
    "Missed it!",
    "$50 Amazon Card",
    "Try Again",
    "$100 Amazon Card",
    "Missed it!"
];

let colors = [
    "#ff9900",
    "#1a1a1a",
    "#ff9900",
    "#1a1a1a",
    "#ff9900",
    "#1a1a1a",
    "#ff9900",
    "#1a1a1a"
];

let startAngle = 0;
let arc = Math.PI / 4;

function drawWheel() {
    for (let i = 0; i < segments.length; i++) {
        let angle = startAngle + i * arc;

        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(wheel.width / 2, wheel.height / 2);
        ctx.arc(
            wheel.width / 2,
            wheel.height / 2,
            wheel.width / 2,
            angle,
            angle + arc
        );
        ctx.fill();

        ctx.save();
        ctx.translate(wheel.width / 2, wheel.height / 2);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 20px Arial";
        ctx.fillText(segments[i], wheel.width / 2 - 20, 10);
        ctx.restore();
    }
}

drawWheel();

spinBtn.addEventListener("click", () => {
    spinBtn.style.display = "none";

    let spinTime = 5500;
    let targetAngle = (Math.PI * 6) + (arc * 6.2);

    let start = null;

    function rotate(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;

        let rotation =
            easeOut(progress, 0, targetAngle, spinTime);

        startAngle = rotation;
        ctx.clearRect(0, 0, wheel.width, wheel.height);
        drawWheel();

        if (progress < spinTime) {
            requestAnimationFrame(rotate);
        } else {
            ctaBtn.classList.remove("hidden");
        }
    }

    requestAnimationFrame(rotate);
});

function easeOut(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
}

ctaBtn.addEventListener("click", () => {
    window.location.href = "https://google.com";
});
