// Portfolio initialization
console.log('Portfolio initializing...');

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

// Theme toggle function
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add animation class
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Restart terminal animation to update colors
    if (typeof restartTerminal === 'function') {
        restartTerminal();
    }
}

// Add event listener
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ===== PARTICLE BACKGROUND =====
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) {
        console.error('Particles canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    window.addEventListener('resize', () => {
        setCanvasSize();
        init();
    });

    // Mouse position
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            const particleColor = theme === 'light' 
                ? 'rgba(0, 102, 204, ' + this.opacity + ')' 
                : 'rgba(0, 240, 255, ' + this.opacity + ')';
            
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    function init() {
        particlesArray = [];
        const numberOfParticles = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Connect particles
    function connect() {
        const theme = document.documentElement.getAttribute('data-theme');
        const lineColor = theme === 'light' ? 'rgba(0, 102, 204, ' : 'rgba(0, 240, 255, ';
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = lineColor + (0.1 * (1 - distance / 100)) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animate particles
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
        
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

// Initialize particles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}

// ===== TERMINAL TYPING ANIMATION =====
function initTerminalAnimation() {
    const terminalOutput = document.getElementById('terminalOutput');
    
    if (!terminalOutput) {
        console.error('Terminal output element not found');
        return;
    }
    
    const lines = [
        { text: 'Muhammad Alfian Tirta Kusuma', colorClass: 'terminal-text-primary', delay: 300 },
        { text: 'Role: Cloud Engineer | SRE | DevOps Engineer', colorClass: 'terminal-text-accent', delay: 600 },
        { text: 'Location: Central Java, Indonesia', colorClass: 'terminal-text-secondary', delay: 900 },
        { text: '', colorClass: '', delay: 1200 },
        { text: 'Top Skills: [OpenStack, Kubernetes, CI/CD, Linux Systems, GCP]', colorClass: 'terminal-text-success', delay: 1500 },
        { text: 'Certifications: [RHCSA, RHCE, RHCS-Containers, GCC-ACE]', colorClass: 'terminal-text-success', delay: 1800 },
        { text: '', colorClass: '', delay: 2100 },
        { text: '$ Ready to collaborate ✓', colorClass: 'terminal-text-accent', delay: 2400 }
    ];

    let lineIndex = 0;
    let totalDelay = 0;
    let isAnimating = false;

    function clearTerminal() {
        terminalOutput.innerHTML = '';
        lineIndex = 0;
        totalDelay = 0;
    }

    function typeLine() {
        if (lineIndex >= lines.length) {
            isAnimating = false;
            return;
        }
        
        const line = lines[lineIndex];
        const delay = line.delay - totalDelay;
        totalDelay = line.delay;
        
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = line.colorClass;
            p.style.marginBottom = '0.5rem';
            terminalOutput.appendChild(p);
            
            let charIndex = 0;
            
            function typeChar() {
                if (charIndex < line.text.length) {
                    p.textContent += line.text[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 30);
                } else {
                    lineIndex++;
                    typeLine();
                }
            }
            
            typeChar();
        }, delay);
    }
    
    function startAnimation() {
        if (isAnimating) return;
        isAnimating = true;
        clearTerminal();
        typeLine();
    }
    
    startAnimation();
    
    // Re-render terminal when theme changes
    return startAnimation;
}

// Start animation when DOM is ready
let restartTerminal;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        restartTerminal = initTerminalAnimation();
    });
} else {
    restartTerminal = initTerminalAnimation();
}

// ===== NAVIGATION =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL TO TOP BUTTON (Optional) =====
let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.setAttribute('id', 'scrollToTop');
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--accent);
    color: var(--bg-primary);
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 5px 20px var(--accent-glow);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
});

// ===== CURSOR TRAIL EFFECT (Optional Enhancement) =====
const createCursorTrail = () => {
    const coords = { x: 0, y: 0 };
    const circles = [];
    const colors = ['#00f0ff', '#0080ff', '#00ff9f'];
    
    for (let i = 0; i < 8; i++) {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            pointer-events: none;
            width: 10px;
            height: 10px;
            background: ${colors[i % colors.length]};
            border-radius: 50%;
            opacity: ${1 - i * 0.1};
            transition: opacity 0.3s ease;
            z-index: 9999;
            mix-blend-mode: screen;
        `;
        circles.push(circle);
        document.body.appendChild(circle);
    }
    
    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });
    
    function animateCircles() {
        let x = coords.x;
        let y = coords.y;
        
        circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;
            
            const nextCircle = circles[index + 1] || circles[0];
            x += (parseFloat(nextCircle.style.left || 0) - x) * 0.3;
            y += (parseFloat(nextCircle.style.top || 0) - y) * 0.3;
        });
        
        requestAnimationFrame(animateCircles);
    }
    
    animateCircles();
};

// Enable cursor trail on desktop only
if (window.innerWidth > 768) {
    createCursorTrail();
}

// ===== EASTER EGG: Konami Code =====
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Show message
        const message = document.createElement('div');
        message.textContent = '🎮 Easter Egg Activated! You found the Konami Code!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--accent);
            color: var(--bg-primary);
            padding: 2rem;
            border-radius: 12px;
            font-family: var(--font-display);
            font-size: 1.5rem;
            z-index: 10000;
            box-shadow: 0 10px 50px var(--accent-glow);
            animation: fadeInUp 0.5s ease;
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
            document.body.style.animation = 'none';
        }, 3000);
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-dependent operations here
            ticking = false;
        });
        ticking = true;
    }
});

console.log('%c👋 Hello, Developer!', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Portfolio designed & built by Alfian', 'color: #00ff9f; font-size: 14px;');
console.log('%c💼 Interested in working together? Let\'s connect!', 'color: #ffffff; font-size: 14px;');
