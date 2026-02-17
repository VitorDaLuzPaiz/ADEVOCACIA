// ==========================================
// NAVIGATION & SCROLL BEHAVIOR
// ==========================================

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar background on scroll
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link Highlighting
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            if (navLink) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.style.color = '';
                    link.style.background = '';
                });
                if (!navLink.classList.contains('btn-contato')) {
                    navLink.style.color = '#1a2c4e';
                    navLink.style.background = '#f8f9fa';
                }
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Form field validation functions
const validators = {
    name: (value) => {
        if (!value.trim()) {
            return 'Por favor, insira seu nome completo.';
        }
        if (value.trim().length < 3) {
            return 'O nome deve ter pelo menos 3 caracteres.';
        }
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            return 'O nome deve conter apenas letras.';
        }
        return '';
    },
    
    email: (value) => {
        if (!value.trim()) {
            return 'Por favor, insira seu e-mail.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Por favor, insira um e-mail válido.';
        }
        return '';
    },
    
    phone: (value) => {
        if (!value.trim()) {
            return 'Por favor, insira seu telefone.';
        }
        // Remove non-numeric characters for validation
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 10 || phoneDigits.length > 11) {
            return 'Por favor, insira um telefone válido (10-11 dígitos).';
        }
        return '';
    },
    
    subject: (value) => {
        if (!value) {
            return 'Por favor, selecione uma área de interesse.';
        }
        return '';
    },
    
    message: (value) => {
        if (!value.trim()) {
            return 'Por favor, escreva uma mensagem.';
        }
        if (value.trim().length < 10) {
            return 'A mensagem deve ter pelo menos 10 caracteres.';
        }
        return '';
    },
    
    privacy: (checked) => {
        if (!checked) {
            return 'Você precisa aceitar a Política de Privacidade.';
        }
        return '';
    }
};

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        if (message) {
            inputElement.style.borderColor = '#e53e3e';
        } else {
            inputElement.style.borderColor = '#38a169';
        }
    }
}

// Clear error message
function clearError(fieldId) {
    showError(fieldId, '');
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.style.borderColor = '#e2e8f0';
    }
}

// Validate single field
function validateField(fieldId, value, isCheckbox = false) {
    const validator = validators[fieldId];
    if (!validator) return true;
    
    const error = isCheckbox ? validator(value) : validator(value);
    
    if (error) {
        showError(fieldId, error);
        return false;
    } else {
        showError(fieldId, '');
        return true;
    }
}

// Real-time validation on blur
const formFields = ['name', 'email', 'phone', 'subject', 'message'];

formFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.addEventListener('blur', () => {
            validateField(fieldId, field.value);
        });
        
        field.addEventListener('input', () => {
            if (document.getElementById(`${fieldId}Error`).textContent) {
                validateField(fieldId, field.value);
            }
        });
    }
});

// Privacy checkbox validation
const privacyCheckbox = document.getElementById('privacy');
if (privacyCheckbox) {
    privacyCheckbox.addEventListener('change', () => {
        validateField('privacy', privacyCheckbox.checked, true);
    });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 2) {
                e.target.value = value;
            } else if (value.length <= 6) {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length <= 10) {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
            } else {
                e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }
    });
}

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear all previous errors
    formFields.forEach(fieldId => clearError(fieldId));
    clearError('privacy');
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        privacy: document.getElementById('privacy').checked
    };
    
    // Validate all fields
    let isValid = true;
    
    formFields.forEach(fieldId => {
        if (!validateField(fieldId, formData[fieldId])) {
            isValid = false;
        }
    });
    
    if (!validateField('privacy', formData.privacy, true)) {
        isValid = false;
    }
    
    // If validation passes
    if (isValid) {
        // Simulate form submission
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Simulate API call with timeout
        setTimeout(() => {
            // Show success message
            formSuccess.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            // Clear all field borders
            formFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.style.borderColor = '#e2e8f0';
                }
            });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Log form data (in production, this would be sent to a server)
            console.log('Form submitted successfully:', formData);
        }, 2000);
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animatedElements = document.querySelectorAll(`
    .service-card,
    .testimonial-card,
    .feature-item,
    .about-image,
    .contact-info,
    .contact-form-wrapper
`);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// Animate stats when hero section is visible
const heroStats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            
            // Extract numbers and animate
            heroStats.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const originalText = text;
                stat.textContent = '0';
                
                setTimeout(() => {
                    animateCounter(stat, number);
                    // Restore original formatting
                    setTimeout(() => {
                        stat.textContent = originalText;
                    }, 2000);
                }, 300);
            });
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    statsObserver.observe(heroSection);
}

// ==========================================
// SERVICE CARDS HOVER EFFECT
// ==========================================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// ==========================================
// PREVENT FORM RESUBMISSION ON REFRESH
// ==========================================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c🏛️ Silva & Associados - Advocacia', 'font-size: 20px; font-weight: bold; color: #1a2c4e;');
console.log('%cLanding Page desenvolvida com HTML, CSS e JavaScript', 'font-size: 12px; color: #718096;');
console.log('%c✨ Design responsivo e otimizado para conversão', 'font-size: 12px; color: #d4af37;');

// ==========================================
// PERFORMANCE MONITORING (Optional)
// ==========================================

// Log page load time
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`⚡ Página carregada em ${loadTime}ms`);
});

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

// Trap focus in mobile menu when open
document.addEventListener('keydown', (e) => {
    if (navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
        
        if (e.key === 'Escape') {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileToggle.focus();
        }
    }
});

// ==========================================
// LAZY LOADING FOR IMAGES (if needed in future)
// ==========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
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

// Throttle function for scroll events
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

// Apply throttle to scroll events for better performance
window.addEventListener('scroll', throttle(() => {
    // Scroll event handlers already defined above
}, 100));