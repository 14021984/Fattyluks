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

    /* ---- Project Carousels ---- */
    function initCarousels() {
        const carousels = $$('.project-carousel');
        if (!carousels.length) return;

        carousels.forEach(carousel => {
            const items = $$('.carousel-item', carousel);
            const dots = $$('.dot', carousel);
            const prevBtn = $('.carousel-prev', carousel);
            const nextBtn = $('.carousel-next', carousel);
            let current = 0;
            let autoPlayInterval;

            function goTo(index) {
                items[current].classList.remove('active');
                dots[current].classList.remove('active');
                current = (index + items.length) % items.length;
                items[current].classList.add('active');
                dots[current].classList.add('active');
            }

            function next() { goTo(current + 1); }
            function prev() { goTo(current - 1); }

            function startAutoPlay() {
                autoPlayInterval = setInterval(next, 3500);
            }

            function stopAutoPlay() {
                clearInterval(autoPlayInterval);
            }

            if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prev(); startAutoPlay(); });
            if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); next(); startAutoPlay(); });

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => { stopAutoPlay(); goTo(i); startAutoPlay(); });
            });

            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);

            startAutoPlay();
        });
    }

    /* ---- Music Player ---- */
    function initMusicPlayer() {
        const playBtn = $('#playBtn');
        const prevBtn = $('#prevBtn');
        const nextBtn = $('#nextBtn');
        const progressFill = $('#progressFill');
        const progressBar = $('#progressBar');
        const currentTimeEl = $('#currentTime');
        const durationEl = $('#duration');
        const volumeSlider = $('#volumeSlider');
        const trackNameEl = $('#trackName');
        const trackItems = $$('.track-item');
        const musicPlayer = $('.music-player');
        
        if (!playBtn || !trackItems.length) return;
        
        let audio = new Audio();
        let currentTrack = 0;
        let isPlaying = false;
        
        function loadTrack(index) {
            const track = trackItems[index];
            const src = track.dataset.src;
            audio.src = src;
            audio.load();
            
            trackItems.forEach(t => t.classList.remove('active'));
            track.classList.add('active');
            
            const title = track.querySelector('.track-title').textContent;
            trackNameEl.textContent = title;
            currentTrack = index;
        }
        
        function playTrack() {
            audio.play();
            isPlaying = true;
            playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            musicPlayer.classList.add('playing');
        }
        
        function pauseTrack() {
            audio.pause();
            isPlaying = false;
            playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
            musicPlayer.classList.remove('playing');
        }
        
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseTrack();
            } else {
                if (audio.src) {
                    playTrack();
                } else {
                    loadTrack(0);
                    playTrack();
                }
            }
        });
        
        prevBtn.addEventListener('click', () => {
            currentTrack = (currentTrack - 1 + trackItems.length) % trackItems.length;
            loadTrack(currentTrack);
            if (isPlaying) playTrack();
        });
        
        nextBtn.addEventListener('click', () => {
            currentTrack = (currentTrack + 1) % trackItems.length;
            loadTrack(currentTrack);
            if (isPlaying) playTrack();
        });
        
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percent + '%';
                currentTimeEl.textContent = formatTime(audio.currentTime);
                durationEl.textContent = formatTime(audio.duration);
            }
        });
        
        audio.addEventListener('ended', () => {
            currentTrack = (currentTrack + 1) % trackItems.length;
            loadTrack(currentTrack);
            playTrack();
        });
        
        progressBar.addEventListener('click', (e) => {
            if (audio.duration) {
                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audio.currentTime = percent * audio.duration;
            }
        });
        
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value / 100;
        });
        
        trackItems.forEach((track, index) => {
            track.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
            });
        });
        
        audio.volume = 0.8;
        
        // Get track durations
        trackItems.forEach((track, index) => {
            const tempAudio = new Audio();
            tempAudio.src = track.dataset.src;
            tempAudio.addEventListener('loadedmetadata', () => {
                const durationEl = track.querySelector('.track-duration');
                if (durationEl) {
                    durationEl.textContent = formatTime(tempAudio.duration);
                }
            });
        });
    }

    /* ---- Image Lightbox ---- */
    function initLightbox() {
        const lightbox = $('#lightbox');
        if (!lightbox) return;

        const imgEl = $('#lightboxImg');
        const captionEl = $('#lightboxCaption');
        const openLink = $('#lightboxOpenLink');
        const closeBtn = $('#lightboxClose');
        const prevBtn = $('#lightboxPrev');
        const nextBtn = $('#lightboxNext');

        let images = [];
        let index = 0;

        function render() {
            const current = images[index];
            if (!current) return;

            imgEl.src = current.src;
            imgEl.alt = current.alt || '';
            captionEl.textContent = `${current.alt || 'Podgląd'} (${index + 1}/${images.length})`;
            openLink.href = current.src;

            const multiple = images.length > 1;
            prevBtn.hidden = !multiple;
            nextBtn.hidden = !multiple;
        }

        function open(list, startIndex) {
            if (!list.length) return;
            images = list;
            index = startIndex < 0 ? 0 : startIndex;
            render();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('lightbox-open');
            closeBtn.focus();
        }

        function close() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lightbox-open');
        }

        function step(dir) {
            if (images.length < 2) return;
            index = (index + dir + images.length) % images.length;
            render();
        }

        // Klik w zdjecie projektu (poza strzalkami i kropkami) otwiera powiekszenie
        $$('.project-carousel').forEach(carousel => {
            carousel.addEventListener('click', (e) => {
                if (e.target.closest('.carousel-btn, .carousel-dots, .dot')) return;

                const all = $$('.carousel-img', carousel);
                if (!all.length) return;

                e.preventDefault();
                const activeImg = $('.carousel-item.active .carousel-img', carousel) || all[0];
                open(all, all.indexOf(activeImg));
            });
        });

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); step(1); });

        // Klik w tlo zamyka podglad
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) close();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight') step(1);
            else if (e.key === 'ArrowLeft') step(-1);
        });
    }

    /* ---- Initialize Everything ---- */
    function init() {
        // Typing effects
        const nameEl = $('#typedName');
        const roleEl = $('#typedRole');

        if (nameEl) typeName(nameEl, 'Łukasz Macioszczyk', 120);

        if (roleEl) {
            setTimeout(() => {
                new TypeWriter(roleEl, [
                    'Full Stack Developer',
                    'UI/UX Designer',
                    'App Developer',
                    'DJ & Music Creator'
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
        initCarousels();
        initLightbox();
        initMusicPlayer();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
