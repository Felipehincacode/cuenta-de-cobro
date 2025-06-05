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

// Three.js Setup for enhanced particles
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '2';
renderer.domElement.style.pointerEvents = 'none';

// Mejorado sistema de partículas
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
const scales = new Float32Array(particlesCount);

for(let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 15;
    posArray[i + 1] = (Math.random() - 0.5) * 15;
    posArray[i + 2] = (Math.random() - 0.5) * 15;
    scales[i / 3] = Math.random() * 2 + 1;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

// Material mejorado con más glow
const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        attribute float scale;
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = scale * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / (distanceToCenter + 0.05);
            gl_FragColor = vec4(1.0, 1.0, 1.0, strength * 0.5);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 5;

// Efecto parallax en textos
const title = document.querySelector('.hero-title');
const content = document.querySelector('.hero-content');

document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) * 0.005;
    const y = (window.innerHeight / 2 - e.clientY) * 0.005;
    
    gsap.to(title, {
        duration: 0.5,
        rotateX: -y,
        rotateY: x,
        ease: 'power2.out'
    });
});

// Animación mejorada de partículas
const clock = new THREE.Clock();

const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotación suave
    particlesMesh.rotation.y = elapsedTime * 0.1;
    particlesMesh.rotation.x = elapsedTime * 0.05;

    // Movimiento ondulatorio
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(elapsedTime + x) * 0.2 + Math.cos(elapsedTime + z) * 0.2;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
};

animate();

// Manejar redimensionamiento
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Glitch effect timing
setInterval(() => {
    heroTitle.style.animation = 'none';
    void heroTitle.offsetWidth; // Trigger reflow
    heroTitle.style.animation = null;
}, 3000); 