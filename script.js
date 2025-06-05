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

// Optimized cursor
const cursor = document.querySelector('.custom-cursor');
let cursorVisible = true;
let cursorTimeout;

const updateCursor = (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
};

// Throttled mousemove event
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

// Control de slides optimizado
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const totalSlides = slides.length;
let isScrolling = false;

const showSlide = (index) => {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
            gsap.to(slide, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out'
            });
        } else {
            slide.classList.remove('active');
            gsap.to(slide, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: 'power2.in'
            });
        }
    });
};

// Inicializar primer slide
showSlide(0);

// Optimized scroll handler with debounce
let scrollTimeout;
window.addEventListener('wheel', (e) => {
    if (!isScrolling) {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        
        if (e.deltaY > 0) {
            currentSlide = (currentSlide + 1) % totalSlides;
        } else {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }
        
        showSlide(currentSlide);
        
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 700);
    }
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

// --- PARTICULAS THREE.JS ---
const canvasContainer = document.getElementById('particles-canvas');
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

// Distribución esférica de partículas
const particlesCount = 1200;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);
const radius = 8;
for (let i = 0; i < particlesCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particlesCount);
    const theta = Math.sqrt(particlesCount * Math.PI) * phi;
    positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi) + (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi) + (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 2] = radius * Math.cos(phi) + (Math.random() - 0.5) * 0.5;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.09,
    opacity: 0.7,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const points = new THREE.Points(geometry, material);
scene.add(points);

function animateParticles() {
    requestAnimationFrame(animateParticles);
    points.rotation.y += 0.0012;
    points.rotation.x += 0.0007;
    renderer.render(scene, camera);
}
animateParticles();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// --- TEXTOS SIGUEN EL MOUSE ---
const sectionTitles = document.querySelectorAll('.section-content');
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function handleMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

document.addEventListener('mousemove', handleMouseMove);

function animateTextTilt() {
    targetX += (mouseX - targetX) * 0.08;
    targetY += (mouseY - targetY) * 0.08;
    sectionTitles.forEach(el => {
        el.style.transform = `rotateY(${-targetX * 10}deg) rotateX(${targetY * 8}deg)`;
    });
    requestAnimationFrame(animateTextTilt);
}
animateTextTilt();

// --- SCROLL Y SECCIONES ---
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');
let currentSection = 0;

function showSection(idx) {
    sections.forEach((sec, i) => {
        sec.classList.toggle('active', i === idx);
    });
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
    });
    currentSection = idx;
}

function scrollToSection(dir) {
    if (isScrolling) return;
    isScrolling = true;
    let next = currentSection + dir;
    if (next < 0) next = 0;
    if (next >= sections.length) next = sections.length - 1;
    if (next !== currentSection) showSection(next);
    setTimeout(() => { isScrolling = false; }, 900);
}

window.addEventListener('wheel', (e) => {
    if (window.innerWidth < 600) return; // No scroll en móvil
    if (e.deltaY > 0) scrollToSection(1);
    else if (e.deltaY < 0) scrollToSection(-1);
});

navDots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSection(i));
});

// --- SCROLL POR TOUCH (MÓVIL) ---
let touchStartY = null;
window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
    }
});
window.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 40) {
        if (diff > 0) scrollToSection(1);
        else scrollToSection(-1);
    }
    touchStartY = null;
});

// --- FLECHA MÓVIL ---
const mobileArrow = document.getElementById('mobileArrow');
function handleMobileArrow() {
    if (window.innerWidth < 600) {
        mobileArrow.style.display = 'block';
    } else {
        mobileArrow.style.display = 'none';
    }
}
window.addEventListener('resize', handleMobileArrow);
handleMobileArrow();

// --- OCULTAR CURSOR EN MÓVIL ---
if (window.innerWidth < 600) {
    document.body.style.cursor = 'default';
}

// Glitch effect timing
setInterval(() => {
    heroTitle.style.animation = 'none';
    void heroTitle.offsetWidth; // Trigger reflow
    heroTitle.style.animation = null;
}, 3000);

// --- CURSOR PERSONALIZADO DESKTOP ---
const customCursor = document.querySelector('.custom-cursor');
if (window.innerWidth >= 600 && customCursor) {
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    document.body.style.cursor = 'none';
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;
        customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
} else if (customCursor) {
    customCursor.style.display = 'none';
    document.body.style.cursor = 'default';
} 