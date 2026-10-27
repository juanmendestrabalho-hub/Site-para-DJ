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

/* === ALTERNÂNCIA E ENVIO DOS FORMULÁRIOS (WHATSAPP E E-MAIL) === */
const btnWpp = document.getElementById('btnWpp');
const btnEmail = document.getElementById('btnEmail');
const formWpp = document.getElementById('bookingFormWpp');
const formEmail = document.getElementById('bookingFormEmail');

if (btnWpp && btnEmail) {
    // Alternar para WhatsApp
    btnWpp.addEventListener('click', () => {
        btnWpp.classList.add('active');
        btnEmail.classList.remove('active');
        formWpp.style.display = 'block';
        formEmail.style.display = 'none';
    });

    // Alternar para E-mail
    btnEmail.addEventListener('click', () => {
        btnEmail.classList.add('active');
        btnWpp.classList.remove('active');
        formEmail.style.display = 'block';
        formWpp.style.display = 'none';
    });
}

/* Envio via WhatsApp */
if (formWpp) {
    formWpp.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('wppStatus');
        
        const name = document.getElementById('wppName').value;
        const email = document.getElementById('wppEmail').value;
        const phone = document.getElementById('wppPhone').value;
        const location = document.getElementById('wppLocation').value;
        const date = document.getElementById('wppDate').value;
        const capacity = document.getElementById('wppCapacity').value;
        const details = document.getElementById('wppDetails').value;
        
        const message = `*NOVA PROPOSTA DE BOOKING*%0A` +
                        `-----------------------------------%0A` +
                        `*Nome/Produtora:* ${name}%0A` +
                        `*E-mail:* ${email}%0A` +
                        `*Telefone:* ${phone}%0A` +
                        `*Local:* ${location}%0A` +
                        `*Data:* ${date}%0A` +
                        `*Capacidade:* ${capacity}%0A` +
                        `*Detalhes:* ${details}`;

        const whatsappNumber = "5511999999999"; // Meu número
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;

        status.className = 'form-status success';
        status.textContent = 'ABRINDO WHATSAPP...';

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            status.textContent = '✓ TRANSMISSÃO CONCLUÍDA COM SUCESSO!';
            formWpp.reset();
        }, 800);
    });
}

/* Envio via E-mail */
if (formEmail) {
    formEmail.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('emailStatus');
        
        const name = document.getElementById('emailName').value;
        const email = document.getElementById('emailReplyTo').value;
        const phone = document.getElementById('emailPhone').value;
        const location = document.getElementById('emailLocation').value;
        const date = document.getElementById('emailDate').value;
        const capacity = document.getElementById('emailCapacity').value;
        const details = document.getElementById('emailDetails').value;

        const myEmail = "booking@cybertrack.com"; // Meu e-mail
        const subject = encodeURIComponent(`Nova Proposta de Booking - ${name}`);
        const body = encodeURIComponent(
            `Nome/Produtora: ${name}\n` +
            `E-mail de Contato: ${email}\n` +
            `Telefone: ${phone}\n` +
            `Local: ${location}\n` +
            `Data: ${date}\n` +
            `Capacidade: ${capacity}\n\n` +
            `Detalhes da Proposta:\n${details}`
        );

        const emailUrl = `mailto:${myEmail}?subject=${subject}&body=${body}`;

        status.className = 'form-status success';
        status.textContent = 'ABRINDO GERENCIADOR DE E-MAIL...';

        setTimeout(() => {
            window.location.href = emailUrl;
            status.textContent = '✓ TRANSMISSÃO CONCLUÍDA COM SUCESSO!';
            formEmail.reset();
        }, 800);
    });
}

/* === CONTROLE DE ROTAÇÃO DO CD HOLOGRÁFICO === */
const vinylDisc = document.getElementById('vinylDisc');

if (vinylDisc) {
    // Mantém o disco girando de forma autônoma ou ao passar o mouse
    cdWrapper.addEventListener('mouseenter', () => {
        vinylDisc.classList.add('playing');
    });
    
    cdWrapper.addEventListener('mouseleave', () => {
        // Se quiser que pare ao tirar o mouse (comente esta linha se preferir que ele gire sempre)
        // vinylDisc.classList.remove('playing');
    });
}
