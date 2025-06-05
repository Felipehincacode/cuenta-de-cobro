// Initialize ScrollReveal with optimized settings
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 1000,
    delay: 100,
    reset: false,
    easing: 'ease'
});

// Simplified reveal animations
sr.reveal('.info', { delay: 100 });
sr.reveal('.detalle', { delay: 200 });
sr.reveal('.banco', { delay: 300 });
sr.reveal('.qr-section', { delay: 400 });
sr.reveal('.feedback-section', { delay: 500 });
sr.reveal('.footer', { delay: 600 });

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('particles-container').appendChild(renderer.domElement);

// Partículas
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 5;

// Animación de partículas
const clock = new THREE.Clock();

const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.03;

    renderer.render(scene, camera);
};

animate();

// Cursor personalizado
const cursor = document.querySelector('.custom-cursor');
const desktopCursor = document.querySelector('.desktop-cursor');
let cursorVisible = true;
let cursorTimeout;

const updateCursor = (e) => {
    if (window.innerWidth > 768) {
        cursor.style.transform = `translate(${e.clientX - 40}px, ${e.clientY - 40}px)`;
    }
};

document.addEventListener('mousemove', (e) => {
    if (!cursorVisible) {
        cursor.style.opacity = '1';
        cursorVisible = true;
    }
    clearTimeout(cursorTimeout);
    
    requestAnimationFrame(() => updateCursor(e));
    
    cursorTimeout = setTimeout(() => {
        cursor.style.opacity = '0';
        cursorVisible = false;
    }, 3000);
});

// Efecto de texto 3D
const contentWrappers = document.querySelectorAll('.content-wrapper');

document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;

    contentWrappers.forEach(wrapper => {
        wrapper.style.transform = `rotateY(${mouseX * 20}deg) rotateX(${-mouseY * 20}deg)`;
    });
});

// Navegación y scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.main-nav a');

const observerOptions = {
    root: null,
    threshold: 0.5,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Actualizar navegación
            navLinks.forEach(link => {
                if (link.getAttribute('href').slice(1) === entry.target.id) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Activar sección
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Soporte para dispositivos móviles
window.addEventListener('deviceorientation', (e) => {
    if (window.innerWidth <= 768) {
        const tiltX = (e.beta - 45) / 90;  // -1 to 1
        const tiltY = e.gamma / 90;  // -1 to 1

        contentWrappers.forEach(wrapper => {
            wrapper.style.transform = `rotateX(${tiltX * 10}deg) rotateY(${tiltY * 10}deg)`;
        });
    }
});

// Manejar redimensionamiento
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Simple title animation
const heroTitle = document.querySelector('.hero-title');
gsap.from(heroTitle, {
    duration: 1.5,
    opacity: 0,
    y: 50,
    ease: 'power2.out'
});

// Optimized resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Update any necessary responsive adjustments here
    }, 250);
});

// Glitch effect timing
setInterval(() => {
    heroTitle.style.animation = 'none';
    void heroTitle.offsetWidth; // Trigger reflow
    heroTitle.style.animation = null;
}, 3000); 