(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ---- Typing Effect ---- */
    class TypeWriter {
        constructor(el, words, wait = 3000) {
            this.el = el;
            this.words = words;
            this.wait = wait;
            this.wordIndex = 0;
            this.txt = '';
            this.isDeleting = false;
            this.type();
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            this.txt = this.isDeleting
                ? fullTxt.substring(0, this.txt.length - 1)
                : fullTxt.substring(0, this.txt.length + 1);

            this.el.textContent = this.txt;

            let speed = this.isDeleting ? 50 : 100;

            if (!this.isDeleting && this.txt === fullTxt) {
                speed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                speed = 500;
            }

            setTimeout(() => this.type(), speed);
        }
    }

    /* ---- Simple Name Typer ---- */
    function typeName(el, name, speed = 100) {
        let i = 0;
        function type() {
            if (i < name.length) {
                el.textContent += name.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    /* ---- Cursor Glow ---- */
    function initCursorGlow() {
        const glow = $('#cursorGlow');
        if (!glow) return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animate);
        }
        animate();
    }

    /* ---- Navbar Scroll ---- */
    function initNavbar() {
        const nav = $('#mainNav');
        if (!nav) return;

        function updateNav() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateNav, { passive: true });
        updateNav();

        // Smooth scroll for nav links
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile nav
                    const collapse = $('.navbar-collapse');
                    if (collapse && collapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                        if (bsCollapse) bsCollapse.hide();
                    }
                }
            });
        });

        // Active nav link on scroll
        const sections = $$('section[id]');
        function updateActiveLink() {
            const scrollPos = window.scrollY + 200;
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                const link = $(`.nav-link[href="#${id}"]`);
                if (link) {
                    if (scrollPos >= top && scrollPos < top + height) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }

    /* ---- Counter Animation ---- */
    function initCounters() {
        const counters = $$('.stat-number[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, 30);
    }

    /* ---- Skill Bars Animation ---- */
    function initSkillBars() {
        const skillItems = $$('.skill-item[data-skill]');
        if (!skillItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const percent = el.dataset.skill;
                    const fill = el.querySelector('.skill-fill');
                    if (fill) {
                        setTimeout(() => {
                            fill.style.width = percent + '%';
                        }, 200);
                    }
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        skillItems.forEach(item => observer.observe(item));
    }

    /* ---- Reveal on Scroll ---- */
    function initReveal() {
        const elements = $$('[data-reveal]');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    /* ---- Project Filters ---- */
    function initProjectFilters() {
        const buttons = $$('.filter-btn');
        const cards = $$('.project-card');
        if (!buttons.length || !cards.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                cards.forEach(card => {
                    const category = card.dataset.category;
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.display = '';
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    /* ---- Particles ---- */
    function initParticles() {
        const container = $('#particles');
        if (!container) return;

        const count = 30;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            container.appendChild(particle);
        }
    }

    /* ---- Form Handling ---- */
    function initContactForm() {
        const form = $('#contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<span>Wysyłanie...</span> <i class="bi bi-hourglass-split"></i>';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span>Wysłano!</span> <i class="bi bi-check-lg"></i>';
                btn.style.background = 'var(--color-neon)';

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.style.background = '';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    }

    /* ---- Glitch Text Effect ---- */
    function initGlitch() {
        const el = $('.glitch-text');
        if (!el) return;

        setInterval(() => {
            el.style.animation = 'glitch 0.3s ease';
            setTimeout(() => {
                el.style.animation = '';
            }, 300);
        }, 5000);
    }

    /* ---- Initialize Everything ---- */
    function init() {
        // Typing effects
        const nameEl = $('#typedName');
        const roleEl = $('#typedRole');

        if (nameEl) typeName(nameEl, 'Code Artist', 120);

        if (roleEl) {
            setTimeout(() => {
                new TypeWriter(roleEl, [
                    'Full Stack Developer',
                    'UI/UX Designer',
                    'App Developer',
                    'Code Artist'
                ], 2000);
            }, 1500);
        }

        initCursorGlow();
        initNavbar();
        initCounters();
        initSkillBars();
        initReveal();
        initProjectFilters();
        initParticles();
        initContactForm();
        initGlitch();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
