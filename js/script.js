/* ==========================================
   NAVIGATION & SCROLL
   ========================================== */

const mobileToggle = document.getElementById('mobileToggle');
const navMenu      = document.getElementById('navMenu');
const navbar       = document.getElementById('navbar');

// --- Mobile Menu Toggle ---
mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');

    // Bloqueia scroll do body quando menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// --- Fecha menu ao clicar num link ---
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Abrir menu');
        document.body.style.overflow = '';
    });
});

// --- Fecha menu ao clicar fora ---
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// --- Navbar scrolled state ---
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
}, { passive: true });

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
});

// --- Active link highlighting ---
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    const navLinks = document.querySelectorAll('.nav-link:not(.btn-contato)');

    sections.forEach(section => {
        const sectionTop    = section.offsetTop - 120;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId     = section.getAttribute('id');
        const navLink       = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY >= sectionTop && scrollY < sectionBottom) {
            navLinks.forEach(l => l.removeAttribute('style'));
            if (!navLink.classList.contains('btn-contato')) {
                navLink.style.color      = 'var(--primary-color)';
                navLink.style.background = 'var(--light-color)';
                navLink.style.fontWeight = '700';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation, { passive: true });

/* ==========================================
   BACK TO TOP
   ========================================== */
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.pageYOffset > 350);
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================
   SCROLL ANIMATIONS (Intersection Observer)
   ========================================== */
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
};

const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity  = '1';
            entry.target.style.transform = 'translateY(0)';
            animObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(`
    .service-card,
    .testimonial-card,
    .feature-item,
    .about-image,
    .contact-info,
    .contact-form-wrapper,
    .stat-item,
    .footer-column
`).forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    animObserver.observe(el);
});

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function formatNumber(n, suffix) {
    if (suffix === '+') {
        return n >= 1000
            ? (n / 1000).toFixed(0) + '.000+'
            : n + '+';
    }
    return n + (suffix || '');
}

function animateCounter(el) {
    const target  = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''), 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1800;
    const start   = performance.now();

    function step(timestamp) {
        const elapsed  = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.floor(eased * target);

        el.textContent = formatNumber(current, suffix);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = formatNumber(target, suffix);
        }
    }

    requestAnimationFrame(step);
}

let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            document.querySelectorAll('.stat-number').forEach((el, i) => {
                setTimeout(() => animateCounter(el), i * 200);
            });
        }
    });
}, { threshold: 0.4 });

const heroSection = document.querySelector('.hero');
if (heroSection) counterObserver.observe(heroSection);

/* ==========================================
   FORM VALIDATION & SUBMISSION
   ========================================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const validators = {
    name: v => {
        if (!v.trim()) return 'Por favor, insira seu nome completo.';
        if (v.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(v)) return 'O nome deve conter apenas letras.';
        return '';
    },
    email: v => {
        if (!v.trim()) return 'Por favor, insira seu e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Insira um e-mail válido.';
        return '';
    },
    phone: v => {
        if (!v.trim()) return 'Por favor, insira seu telefone.';
        const d = v.replace(/\D/g, '');
        if (d.length < 10 || d.length > 11) return 'Insira um telefone válido (10-11 dígitos).';
        return '';
    },
    subject: v => (!v ? 'Selecione uma área de interesse.' : ''),
    message: v => {
        if (!v.trim()) return 'Por favor, escreva uma mensagem.';
        if (v.trim().length < 10) return 'A mensagem deve ter pelo menos 10 caracteres.';
        return '';
    },
    privacy: v => (!v ? 'Você precisa aceitar a Política de Privacidade.' : '')
};

function showFieldState(id, errorMsg) {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = errorMsg;
    if (el) {
        el.style.borderColor = errorMsg
            ? 'var(--error-color)'
            : (el.value || el.checked ? 'var(--success-color)' : 'var(--border-color)');
    }
}

function clearField(id) {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
    if (el) el.style.borderColor = 'var(--border-color)';
}

// Validação ao sair do campo
['name', 'email', 'phone', 'subject', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('blur', () => {
        const err = validators[id](el.value);
        showFieldState(id, err);
    });

    el.addEventListener('input', () => {
        if (document.getElementById(id + 'Error').textContent) {
            showFieldState(id, validators[id](el.value));
        }
    });
});

const privacyEl = document.getElementById('privacy');
if (privacyEl) {
    privacyEl.addEventListener('change', () => {
        showFieldState('privacy', validators.privacy(privacyEl.checked));
    });
}

// Formatação do telefone
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length <= 2)       e.target.value = v;
        else if (v.length <= 6)  e.target.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
        else if (v.length <= 10) e.target.value = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
        else                     e.target.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7,11)}`;
    });
}

// Envio do formulário
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const fields = ['name', 'email', 'phone', 'subject', 'message'];
        let isValid  = true;

        fields.forEach(id => {
            const el  = document.getElementById(id);
            const err = validators[id](el.value);
            showFieldState(id, err);
            if (err) isValid = false;
        });

        const privacyErr = validators.privacy(privacyEl ? privacyEl.checked : false);
        showFieldState('privacy', privacyErr);
        if (privacyErr) isValid = false;

        if (!isValid) {
            const firstErr = contactForm.querySelector('.error-message:not(:empty)');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Simula envio
        const btn = contactForm.querySelector('.btn-submit');
        const original = btn.innerHTML;
        btn.disabled  = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        setTimeout(() => {
            formSuccess.classList.add('show');
            contactForm.reset();
            fields.forEach(id => clearField(id));
            clearField('privacy');
            btn.disabled  = false;
            btn.innerHTML = original;

            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => formSuccess.classList.remove('show'), 6000);
        }, 1800);
    });
}

/* ==========================================
   KEYBOARD ACCESSIBILITY (menu mobile)
   ========================================== */
document.addEventListener('keydown', e => {
    if (!navMenu.classList.contains('active')) return;

    const focusable = [...navMenu.querySelectorAll('a, button')];
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    }

    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        mobileToggle.focus();
    }
});

/* ==========================================
   PREVENT RESUBMISSION ON REFRESH
   ========================================== */
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

/* ==========================================
   LAZY LOADING
   ========================================== */
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imgObserver.unobserve(img);
                }
            }
        });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ==========================================
   PERFORMANCE – PAGE LOAD TIME
   ========================================== */
window.addEventListener('load', () => {
    const t = window.performance.timing;
    if (t) {
        const ms = t.domContentLoadedEventEnd - t.navigationStart;
        console.log(`%c⚡ Página carregada em ${ms}ms`, 'color:#C9A84C;font-weight:bold;');
    }
});

console.log('%c🏛️ Silva & Associados — Advocacia', 'font-size:18px;font-weight:bold;color:#0B1F4B;');
console.log('%cDesign profissional responsivo para mobile', 'font-size:12px;color:#C9A84C;');
