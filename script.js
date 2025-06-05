// Three.js setup
let scene, camera, renderer, particles;
const particleCount = 2000;

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('particles-canvas').appendChild(renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;
}

function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}

// Mouse tracking for text rotation
let mouseX = 0;
let mouseY = 0;

function updateMousePosition(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function updateTextRotation() {
    const contents = document.querySelectorAll('.section-content');
    contents.forEach(content => {
        if (content.parentElement.classList.contains('active')) {
            content.style.transform = `rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
        }
    });
}

// Scroll handling
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');

function updateSection(index) {
    sections.forEach(section => section.classList.remove('active'));
    navDots.forEach(dot => dot.classList.remove('active'));
    
    sections[index].classList.add('active');
    navDots[index].classList.add('active');
    currentSection = index;
}

function handleScroll(event) {
    if (event.deltaY > 0 && currentSection < sections.length - 1) {
        updateSection(currentSection + 1);
    } else if (event.deltaY < 0 && currentSection > 0) {
        updateSection(currentSection - 1);
    }
}

// Mobile arrow visibility
function updateMobileArrow() {
    const arrow = document.getElementById('mobileArrow');
    if (window.innerWidth <= 768) {
        arrow.style.display = currentSection === 0 ? 'block' : 'none';
    } else {
        arrow.style.display = 'none';
    }
}

// Navigation dots click handling
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateSection(index));
});

// Initialize
window.addEventListener('load', () => {
    initThree();
    animate();
    updateMobileArrow();
});

// Event listeners
window.addEventListener('mousemove', (e) => {
    updateMousePosition(e);
    updateTextRotation();
});

window.addEventListener('wheel', handleScroll);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateMobileArrow();
}); 