/* ==========================================================================
   XAVER PINERO PORTFOLIO - Interactive JavaScript
   Nature-inspired interactions and smooth animations
   ========================================================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initProjectFilter();
    initContactForm();
    initCountUp();
    initCursorTrail();
});

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Scroll effect for navigation
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide/show nav on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Update active nav link based on scroll position
        updateActiveNavLink(sections, navLinks);
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveNavLink(sections, navLinks) {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* --------------------------------------------------------------------------
   Mobile Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            // Close mobile menu
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Smooth scroll to target
            if (target) {
                setTimeout(() => {
                    const navHeight = document.getElementById('nav').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Scroll Animations
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Don't unobserve to allow re-animation when scrolling back
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .about-image-container,
        .about-content,
        .project-card,
        .blog-card,
        .contact-info,
        .contact-form,
        .skills-container
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Stagger animations for grids
    const staggerContainers = document.querySelectorAll(`
        .skills-grid,
        .projects-grid,
        .blog-grid
    `);
    
    staggerContainers.forEach(container => {
        container.classList.add('stagger-children');
        observer.observe(container);
    });
}

/* --------------------------------------------------------------------------
   Parallax Effects
   -------------------------------------------------------------------------- */
function initParallax() {
    const mountainLayers = document.querySelectorAll('.mountain-layer');
    const auroraGlow = document.querySelector('.aurora-glow');
    const stars = document.querySelector('.stars');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Only apply parallax in hero section
        if (scrollY < windowHeight) {
            const progress = scrollY / windowHeight;
            
            // Parallax for mountain layers
            if (mountainLayers[0]) {
                mountainLayers[0].style.transform = `translateY(${scrollY * 0.1}px)`;
            }
            if (mountainLayers[1]) {
                mountainLayers[1].style.transform = `translateY(${scrollY * 0.3}px)`;
            }
            if (mountainLayers[2]) {
                mountainLayers[2].style.transform = `translateY(${scrollY * 0.5}px)`;
            }
            
            // Fade out aurora and stars
            if (auroraGlow) {
                auroraGlow.style.opacity = 1 - progress;
            }
            if (stars) {
                stars.style.opacity = (1 - progress) * 0.8;
            }
            
            // Parallax and fade for hero content
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.4}px)`;
                heroContent.style.opacity = 1 - progress * 1.5;
            }
        }
    });
    
    // Mouse parallax for aurora effect
    document.addEventListener('mousemove', (e) => {
        if (auroraGlow && window.pageYOffset < window.innerHeight) {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            
            auroraGlow.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}

/* --------------------------------------------------------------------------
   Project Filter
   -------------------------------------------------------------------------- */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   Contact Form
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success state
        submitBtn.innerHTML = `
            <span>Message Sent!</span>
            <i class="fa-solid fa-check"></i>
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #3dd68c, #2dd4bf)';
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    });
    
    // Input focus effects
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

/* --------------------------------------------------------------------------
   Count Up Animation
   -------------------------------------------------------------------------- */
function initCountUp() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.dataset.count);
                animateCount(target, count);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCount(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.round(start + (target - start) * easeOut);
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   Cursor Trail Effect
   -------------------------------------------------------------------------- */
function initCursorTrail() {
    const canvas = document.getElementById('trail-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Trail particles
    const particles = [];
    const maxParticles = 50;
    
    // Colors from our palette
    const colors = [
        'rgba(61, 214, 140, 0.6)',
        'rgba(45, 212, 191, 0.6)',
        'rgba(168, 85, 247, 0.4)'
    ];
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.02;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
            this.size *= 0.98;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('0.6', this.life * 0.6);
            ctx.fill();
        }
    }
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
    });
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add new particles when moving
        if (isMoving && particles.length < maxParticles) {
            particles.push(new Particle(mouseX, mouseY));
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            particle.draw();
            
            // Remove dead particles
            if (particle.life <= 0 || particle.size <= 0.1) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* --------------------------------------------------------------------------
   Smooth Reveal for Images (when they load)
   -------------------------------------------------------------------------- */
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
    
    // If already loaded
    if (img.complete) {
        img.style.opacity = '1';
    }
});

/* --------------------------------------------------------------------------
   Keyboard Navigation
   -------------------------------------------------------------------------- */
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        const toggle = document.getElementById('nav-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenu.classList.contains('active')) {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/* --------------------------------------------------------------------------
   Performance: Debounce/Throttle helpers
   -------------------------------------------------------------------------- */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* --------------------------------------------------------------------------
   Easter Egg: Konami Code
   -------------------------------------------------------------------------- */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            // Activate aurora mode!
            document.body.style.animation = 'rainbow 5s linear infinite';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                document.body.style.animation = '';
                style.remove();
            }, 5000);
            
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

console.log('%c🏔️ Welcome, fellow explorer!', 'font-size: 20px; font-weight: bold; color: #3dd68c;');
console.log('%cBuilt with passion by Xaver Pinero', 'font-size: 14px; color: #9ca8a3;');

