document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Initialize loading sequence
    window.addEventListener('load', () => {
        // Ensure minimum loader display time (2.5 seconds)
        setTimeout(() => {
            const loader = document.querySelector('.loader-wrapper');
            loader.classList.add('fade-out');
            document.body.classList.remove('loading');
            
            // Remove loader from DOM after fade out
            setTimeout(() => {
                loader.remove();
                // Initialize all animations after loader
                initAnimations();
            }, 500);
        }, 2500); // Increased to 2.5s to allow for text animation
    });

    // Start the typewriter effect when the section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heading.textContent = '';
                setTimeout(typeWriter, 500);
            }
        });
    });
    
    observer.observe(heading);

    // Smooth scroll function
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.links-container a');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100; // Adjust offset as needed

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', highlightNavigation);
    
    // Optional: Add a scroll progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'scroll-progress';
    document.body.appendChild(progressIndicator);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressIndicator.style.width = `${scrolled}%`;
    });
});

// Animate tokenomics bars when they come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.getAttribute('data-width');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.chart-bar').forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    bar.setAttribute('data-width', width);
    observer.observe(bar);
});

document.addEventListener('mousemove', (e) => {
    const floatingElements = document.querySelectorAll('.float-item');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    floatingElements.forEach(element => {
        const shift = element.getBoundingClientRect().top / window.innerHeight;
        element.style.transform = `translate(${mouseX * 50 * shift}px, ${mouseY * 50 * shift}px)`;
    });
});

// Add these functions to your existing script.js
function createParticle(x, y) {
    const particles = ['$', 'F', 'L', 'U', 'F', 'O'];
    const container = document.querySelector('.cursor-effects');
    const particle = document.createElement('span');
    particle.className = 'cursor-particle';
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    container.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Mouse click effect
document.addEventListener('click', (e) => {
    const numParticles = 8;
    for (let i = 0; i < numParticles; i++) {
        setTimeout(() => {
            createParticle(e.clientX, e.clientY);
        }, i * 50);
    }
});

// Mouse trail effect
let mouseTrail = [];
const trailLength = 20;

function createTrailDot(x, y) {
    const container = document.querySelector('.cursor-effects');
    const dot = document.createElement('div');
    dot.className = 'mouse-trail';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    container.appendChild(dot);
    
    setTimeout(() => {
        dot.remove();
    }, 500);
    
    return dot;
}

document.addEventListener('mousemove', (e) => {
    // Existing mouse move code for floating elements...

    // Add trail effect
    mouseTrail.push({
        x: e.clientX,
        y: e.clientY,
        element: createTrailDot(e.clientX, e.clientY)
    });
    
    if (mouseTrail.length > trailLength) {
        const removed = mouseTrail.shift();
        removed.element.remove();
    }
    
    // Add subtle movement to nearby floating elements
    const floatingElements = document.querySelectorAll('.float-item');
    floatingElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const maxDistance = 200;
        
        if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 30;
            const angleX = (e.clientX - centerX) / distance;
            const angleY = (e.clientY - centerY) / distance;
            
            element.style.transform = `translate(${-angleX * force}px, ${-angleY * force}px)`;
        }
    });
});

// Reset floating elements position when mouse stops moving
let moveTimeout;
document.addEventListener('mousemove', () => {
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
        document.querySelectorAll('.float-item').forEach(element => {
            element.style.transform = '';
        });
    }, 100);
});

// Add these styles to your CSS
const styles = document.createElement('style');
styles.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: var(--color-primary);
        z-index: 9999;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(styles);

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// GSAP Animations
function initAnimations() {

    // Mouse move parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        gsap.to('.ye-img', {
            duration: 1,
            x: mouseX * 20,
            y: mouseY * 20,
            rotation: mouseX * 5,
            ease: "power2.out"
        });
    });

}
