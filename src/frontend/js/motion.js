/* Motion layer: scroll reveals, parallax, counters, header behaviour, route progress */
const Motion = {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    lastY: 0,
    parallaxEls: [],

    init() {
        document.documentElement.classList.add('js-motion');
        const bar = document.createElement('div');
        bar.id = 'route-progress';
        document.body.appendChild(bar);

        this.io = new IntersectionObserver(entries => entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('in');
            if (e.target.hasAttribute('data-count')) this.count(e.target);
            this.io.unobserve(e.target);
        }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        new MutationObserver(() => this.scan()).observe(document.getElementById('main-content'), { childList: true, subtree: true });
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('resize', () => this.onScroll());
        this.scan();
        this.onScroll();
    },

    scan() {
        document.querySelectorAll('#main-content [data-reveal]:not(.seen), #main-content [data-count]:not(.seen)').forEach(el => {
            el.classList.add('seen');
            this.io.observe(el);
        });
        this.parallaxEls = [...document.querySelectorAll('#main-content [data-parallax]')];
    },

    count(el) {
        const target = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
        const suffix = el.dataset.suffix || '';
        if (this.reduced) { el.textContent = target.toFixed(dec) + suffix; return; }
        const t0 = performance.now(), dur = 1600;
        const tick = t => {
            const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
            el.textContent = (target * eased).toFixed(dec) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    },

    onScroll() {
        const y = window.scrollY, header = document.getElementById('navbar');
        if (header) {
            const overlayOpen = document.body.classList.contains('no-scroll');
            const heroPage = ['home', 'restaurant'].includes(App.currentPage);
            header.classList.toggle('is-transparent', heroPage && y < 60 && !overlayOpen);
            const away = y > 360 && y > this.lastY + 4 && !overlayOpen;
            if (y < this.lastY - 4 || y < 360) header.classList.remove('is-hidden');
            else if (away) header.classList.add('is-hidden');
            document.body.classList.toggle('header-away', header.classList.contains('is-hidden'));
        }
        this.lastY = y;
        if (!this.reduced && !this.ticking) {
            this.ticking = true;
            requestAnimationFrame(() => {
                const vh = window.innerHeight;
                this.parallaxEls.forEach(el => {
                    const r = el.parentElement.getBoundingClientRect();
                    if (r.bottom < 0 || r.top > vh) return;
                    const p = (r.top + r.height / 2 - vh / 2) / vh;
                    el.style.transform = `translate3d(0, ${(-p * 60).toFixed(1)}px, 0)`;
                });
                this.ticking = false;
            });
        }
    },

    progressStart() { const b = document.getElementById('route-progress'); if (!b) return; b.className = ''; void b.offsetWidth; b.className = 'run'; },
    progressDone() { const b = document.getElementById('route-progress'); if (b) b.className = 'done'; }
};
