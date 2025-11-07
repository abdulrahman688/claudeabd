/**
 * ZENOBIA'S LEGACY - Main JavaScript
 * Handles navigation, animations, forms, and general interactions
 */

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initAnimations();
    initTestimonials();
    initCounters();
    initNewsletter();
    initScrollEffects();
});

// ===========================================
// NAVIGATION
// ===========================================

function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Change icon
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 0) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });

    // Active page indicator
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===========================================
// ANIMATIONS
// ===========================================

function initAnimations() {
    // Intersection Observer for fade-up animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all fade-up elements
    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
}

// ===========================================
// TESTIMONIALS SLIDER
// ===========================================

function initTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');

    if (testimonials.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        // Remove active class from all
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        // Add active class to current
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-play
    setInterval(nextSlide, slideInterval);
}

// ===========================================
// COUNTER ANIMATIONS
// ===========================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===========================================
// NEWSLETTER FORM
// ===========================================

function initNewsletter() {
    const form = document.getElementById('newsletterForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('newsletterEmail');
        const emailValue = email.value.trim();

        // Validate email
        if (!isValidEmail(emailValue)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Simulate subscription (replace with actual API call)
        subscribeToNewsletter(emailValue);
    });
}

function subscribeToNewsletter(email) {
    // Show loading state
    const form = document.getElementById('newsletterForm');
    const button = form.querySelector('button');
    const originalText = button.textContent;

    button.innerHTML = '<span class="loading"></span>';
    button.disabled = true;

    // Simulate API call
    setTimeout(function() {
        // Success
        showMessage('Thank you for subscribing! Check your email.', 'success');
        form.reset();

        // Reset button
        button.textContent = originalText;
        button.disabled = false;

        // Store in localStorage (for demo purposes)
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        subscribers.push({ email, date: new Date().toISOString() });
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }, 1500);
}

// ===========================================
// SCROLL EFFECTS
// ===========================================

function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Parallax effect on hero section (subtle)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showMessage(message, type = 'success') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;

    // Style the message
    Object.assign(messageEl.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        backgroundColor: type === 'success' ? '#6B8E23' : '#dc3545',
        color: '#fff',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease-out'
    });

    // Add to page
    document.body.appendChild(messageEl);

    // Remove after 4 seconds
    setTimeout(function() {
        messageEl.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => messageEl.remove(), 300);
    }, 4000);
}

// Add animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================================
// PRODUCT DATA (for cart functionality)
// ===========================================

const PRODUCTS = {
    1: {
        id: 1,
        name: 'Royal Aleppo',
        category: 'Classic Collection',
        price: 3.50,
        image: 'images/products/royal-aleppo.jpg',
        description: 'Our signature soap. 88% olive oil, 12% laurel oil.'
    },
    2: {
        id: 2,
        name: 'Damascus Rose',
        category: 'Premium Collection',
        price: 3.80,
        image: 'images/products/damascus-rose.jpg',
        description: 'Luxurious rose-infused Aleppo soap.'
    },
    3: {
        id: 3,
        name: 'Pure Olive',
        category: 'Essential Collection',
        price: 3.20,
        image: 'images/products/olive-pure.jpg',
        description: '100% olive oil for sensitive skin.'
    },
    4: {
        id: 4,
        name: 'Lavender Dream',
        category: 'Premium Collection',
        price: 3.80,
        image: 'images/products/lavender.jpg',
        description: 'Calming lavender-infused Aleppo soap.'
    },
    5: {
        id: 5,
        name: 'Black Seed',
        category: 'Therapeutic Collection',
        price: 4.20,
        image: 'images/products/black-seed.jpg',
        description: 'Therapeutic black seed oil soap.'
    },
    6: {
        id: 6,
        name: 'Jasmine Night',
        category: 'Premium Collection',
        price: 3.80,
        image: 'images/products/jasmine.jpg',
        description: 'Exotic jasmine-scented luxury soap.'
    }
};

// Make products globally available
window.PRODUCTS = PRODUCTS;

// ===========================================
// FORM VALIDATION
// ===========================================

function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showFieldError(input, 'This field is required');
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    showFieldError(input, 'Please enter a valid email');
                } else {
                    clearFieldError(input);
                }
            });

            if (isValid) {
                // Form is valid, submit
                this.submit();
            }
        });
    });
}

function showFieldError(input, message) {
    clearFieldError(input);

    input.style.borderColor = '#dc3545';

    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.color = '#dc3545';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';

    input.parentNode.appendChild(error);
}

function clearFieldError(input) {
    input.style.borderColor = '';

    const error = input.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', initFormValidation);

// ===========================================
// LAZY LOADING IMAGES
// ===========================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        return;
    }

    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', initLazyLoading);

// ===========================================
// EXPORT FUNCTIONS
// ===========================================

window.zenobiaApp = {
    showMessage,
    isValidEmail,
    PRODUCTS
};
