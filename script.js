// Three.js setup
let scene, camera, renderer, particles;
const particleCount = window.innerWidth <= 768 ? 500 : 1000; // Reduced particles for mobile

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
        size: window.innerWidth <= 768 ? 0.01 : 0.02, // Smaller particles for mobile
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;
}

function animate() {
    requestAnimationFrame(animate);
    
    // Update particle positions based on mouse
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (mouseX * 0.0001);
        positions[i + 1] += (mouseY * 0.0001);
    }
    particles.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

// Mouse tracking for text rotation and particles
let mouseX = 0;
let mouseY = 0;

function updateMousePosition(event) {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
}

function updateTextRotation() {
    const contents = document.querySelectorAll('.section-content');
    contents.forEach(content => {
        if (content.parentElement.classList.contains('active')) {
            content.style.transform = `rotateX(${mouseY * 0.0001}deg) rotateY(${mouseX * 0.0001}deg)`;
        }
    });
}

// Mobile touch handling
let touchStartY = 0;
let touchEndY = 0;
let isScrolling = false;

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (isScrolling) return;
    
    touchEndY = event.touches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
        isScrolling = true;
        
        if (diff > 0 && currentSection < sections.length - 1) {
            // Swipe up
            updateSection(currentSection + 1);
        } else if (diff < 0 && currentSection > 0) {
            // Swipe down
            updateSection(currentSection - 1);
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }
}

// Scroll handling with reduced sensitivity
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');
let scrollTimeout = false;

function updateSection(index) {
    sections.forEach(section => section.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));
    
    sections[index].classList.add('active');
    navItems[index].classList.add('active');
    currentSection = index;
    
    // Update mobile arrow visibility
    updateMobileArrow();
}

function handleScroll(event) {
    if (window.innerWidth <= 768) return; // Disable wheel scroll on mobile
    
    if (scrollTimeout) return;
    
    scrollTimeout = true;
    setTimeout(() => {
        scrollTimeout = false;
    }, 500);

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

// Navigation items click handling
navItems.forEach((item, index) => {
    item.addEventListener('click', () => updateSection(index));
});

// Initialize
window.addEventListener('load', () => {
    initThree();
    animate();
    updateMobileArrow();
    
    // Add mobile touch events
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-scroll-lock');
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
    }
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
    
    // Update particle count and size on resize
    if (particles) {
        const newParticleCount = window.innerWidth <= 768 ? 500 : 1000;
        const newSize = window.innerWidth <= 768 ? 0.01 : 0.02;
        
        particles.material.size = newSize;
        // Recreate particles if count changed
        if (newParticleCount !== particleCount) {
            initThree();
        }
    }
}); 