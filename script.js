/**
 * iOS Hits - Ultra Premium Interactive Experience
 * Advanced animations, particle system, and micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================
    // CONFIGURATION
    // =========================================
    const CONFIG = {
        particles: {
            count: 30,
            minSize: 1,
            maxSize: 3,
            minDuration: 15,
            maxDuration: 30
        },
        parallax: {
            intensity: 0.03
        },
        header: {
            scrollThreshold: 50
        }
    };

    // =========================================
    // HEADER SCROLL EFFECT
    // =========================================
    const header = document.getElementById('header');
    let lastScrollY = 0;
    let ticking = false;

    const updateHeader = () => {
        const scrollY = window.scrollY;

        if (scrollY > CONFIG.header.scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // =========================================
    // FLOATING PARTICLES SYSTEM
    // =========================================
    const createParticles = () => {
        const container = document.getElementById('particles');
        if (!container) return;

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < CONFIG.particles.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Randomize properties
            const size = Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize;
            const left = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * (CONFIG.particles.maxDuration - CONFIG.particles.minDuration) + CONFIG.particles.minDuration;
            const opacity = Math.random() * 0.5 + 0.1;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                opacity: ${opacity};
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            fragment.appendChild(particle);
        }

        container.appendChild(fragment);
    };

    createParticles();

    // =========================================
    // INTERSECTION OBSERVER - REVEAL ANIMATIONS
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation based on element index
                const delay = index * 80;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.glass-card, .section-title, .section-subtitle, .hero-content, .about-section, .contact-section'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
    });

    // Add revealed styles
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(revealStyle);

    // =========================================
    // CARD MOUSE TRACKING (Glow Effect)
    // =========================================
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', '50%');
            card.style.setProperty('--mouse-y', '50%');
        });
    });

    // =========================================
    // SUBTLE 3D TILT EFFECT
    // =========================================
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });

    // =========================================
    // APP ICON FALLBACK
    // =========================================
    document.querySelectorAll('.app-icon img').forEach((img) => {
        img.addEventListener('error', () => {
            const container = img.closest('.app-icon');
            if (!container) return;

            const fallback = container.getAttribute('data-fallback') || '📱';
            container.innerHTML = fallback;
            container.style.fontSize = '2.5rem';
            container.style.background = 'linear-gradient(135deg, hsl(270, 95%, 65%), hsl(217, 91%, 60%))';
        }, { once: true });
    });

    // =========================================
    // SMOOTH SCROLL
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (!href || href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Close mobile menu if open
            closeMobileMenu();

            // Calculate offset
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 24;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // =========================================
    // MOBILE MENU
    // =========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const closeMobileMenu = () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            mobileMenuToggle?.focus();
        }
    });

    // =========================================
    // PARALLAX BACKGROUND
    // =========================================
    const glob1 = document.querySelector('.background-glob');
    const glob2 = document.querySelector('.background-glob-2');
    let parallaxTicking = false;

    const updateParallax = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            parallaxTicking = false;
            return;
        }

        const scrollY = window.scrollY;
        const intensity = CONFIG.parallax.intensity;

        if (glob1) {
            glob1.style.transform = `translate(${scrollY * intensity}px, ${scrollY * intensity * 0.5}px)`;
        }
        if (glob2) {
            glob2.style.transform = `translate(${-scrollY * intensity}px, ${-scrollY * intensity * 0.5}px)`;
        }

        parallaxTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });

    // =========================================
    // MAGNETIC BUTTONS
    // =========================================
    const magneticButtons = document.querySelectorAll('.primary-button, .app-link');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // =========================================
    // GRADIENT TEXT GLOW SYNC
    // =========================================
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        const text = gradientText.textContent;
        gradientText.setAttribute('data-text', text);
    }

    // =========================================
    // PAGE LOAD COMPLETE
    // =========================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger initial animations
        setTimeout(() => {
            document.querySelector('.hero-content')?.classList.add('revealed');
        }, 100);
    });

    // =========================================
    // PERFORMANCE: Cleanup on page hide
    // =========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause intensive animations when tab is hidden
            document.querySelectorAll('.particle').forEach(p => {
                p.style.animationPlayState = 'paused';
            });
        } else {
            document.querySelectorAll('.particle').forEach(p => {
                p.style.animationPlayState = 'running';
            });
        }
    });
});
