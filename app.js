const canvas = document.getElementById("cyberCanvas");
const ctx = canvas.getContext("2d");

let w, h, particles;
let mouse = { x: null, y: null, radius: 150 };

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);

// Atualiza posição do mouse
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

        // Interação com o mouse
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
        // Cor das partículas atualizada para Magenta Neon (#ff00ea)
        ctx.fillStyle = "rgba(255, 0, 234, 0.5)"; 
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
                // Linhas de conexão atualizadas para o tom Magenta Neon
                ctx.strokeStyle = `rgba(255, 0, 234, ${1 - distance/100})`;
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

/* === CD HOLOGRÁFICO 3D (MOUSE TRACKING) === */
const cdWrapper = document.getElementById('cdWrapper');

if(cdWrapper) {
    cdWrapper.addEventListener('mousemove', (e) => {
        const rect = cdWrapper.getBoundingClientRect();
        
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const tiltX = (y / (rect.height / 2)) * -25; 
        const tiltY = (x / (rect.width / 2)) * 25;

        cdWrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
    });

    cdWrapper.addEventListener('mouseleave', () => {
        cdWrapper.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });
}

/* === INTERAÇÃO DO FORMULÁRIO DE BOOKING === */
const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Efeito de envio
        formStatus.className = 'form-status';
        formStatus.textContent = 'TRANSMITINDO DADOS DA PROPOSTA...';
        
        setTimeout(() => {
            formStatus.className = 'form-status success';
            formStatus.textContent = '✓ PROPOSTA RECEBIDA COM SUCESSO! RETORNAREMOS EM BREVE.';
            bookingForm.reset();
        }, 1500);
    });
}
