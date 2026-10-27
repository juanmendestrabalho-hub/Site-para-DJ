const canvas = document.getElementById("cyberCanvas");
const ctx = canvas.getContext("2d");

let w, h, particles;
let mouse = { x: null, y: null, radius: 150 };

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);

// Atualiza posição do rato
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > w || this.x < 0) this.speedX *= -1;
        if (this.y > h || this.y < 0) this.speedY *= -1;

        // Interação com o rato
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                this.x -= forceDirectionX * force * 3;
                this.y -= forceDirectionY * force * 3;
            }
        }
    }
    draw() {
        ctx.fillStyle = "rgba(0, 255, 204, 0.5)"; // Cor neon
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    resize();
    particles = [];
    let numberOfParticles = (h * w) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);
    
    // Conectar as partículas
    for (let a = 0; a < particles.length; a++) {
        particles[a].update();
        particles[a].draw();
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 255, 204, ${1 - distance/100})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();

/* === INTERAÇÃO DO RADAR DE EVENTOS === */
const eventRows = document.querySelectorAll('.event-row');
const blip = document.getElementById('radar-blip');

eventRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        // Lê as coordenadas (em percentagem)
        const x = row.getAttribute('data-x');
        const y = row.getAttribute('data-y');
        
        // Move o ponto para a localização do evento e acende
        blip.style.left = x + '%';
        blip.style.top = y + '%';
        blip.classList.add('active');
    });

    row.addEventListener('mouseleave', () => {
        blip.classList.remove('active');
    });
});
