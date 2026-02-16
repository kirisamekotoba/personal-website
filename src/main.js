import './styles/global.css';
import './styles/layout.css';
import './styles/typography.css';
import p5 from 'p5';

// Import Sketches
import { HomeSketch } from './sketches/HomeSketch.js';
import { PhilosophySketch } from './sketches/PhilosophySketch.js';
import { ResearchSketch } from './sketches/ResearchSketch.js';
import { AboutSketch } from './sketches/AboutSketch.js'; // New

// Configuration
const ROUTES = {
    'home': {
        dataSource: '/src/data/home.json',
        sketch: HomeSketch,
        theme: 'organic'
    },
    'philosophy': {
        dataSource: '/src/data/philosophy.json',
        sketch: PhilosophySketch,
        theme: 'swiss'
    },
    'research': {
        dataSource: '/src/data/research.json',
        sketch: ResearchSketch,
        theme: 'blueprint'
    },
    'about': {
        dataSource: '/src/data/about.json',
        sketch: AboutSketch,
        theme: 'minimal'
    }
};

class App {
    constructor() {
        this.currentLang = 'en'; // Default language
        this.currentRoute = 'home';
        this.p5Instance = null;
        this.contentContainer = document.getElementById('app');
        this.navItems = document.querySelectorAll('.nav-item');
        this.langToggle = document.getElementById('lang-toggle'); // Needs to be added to HTML

        this.init();
    }

    init() {
        // Nav Listeners
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.navigate(target);
            });
        });

        // Lang Toggle Listener
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Load initial state
        this.navigate('home');
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'cn' : 'en';
        this.updateUIText();
        this.navigate(this.currentRoute); // Reload content with new lang
    }

    updateUIText() {
        // Update fixed UI elements (Nav) if needed
        // For now, let's assume nav remains simple or we update it here
        this.langToggle.innerText = this.currentLang === 'en' ? 'CN' : 'EN';
    }

    async navigate(routeKey) {
        this.currentRoute = routeKey;
        const route = ROUTES[routeKey];
        if (!route) return;

        // 1. Update UI State
        this.navItems.forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`[data-target="${routeKey}"]`);
        if (activeNav) activeNav.classList.add('active');

        // 2. Transition Out (Fade)
        this.contentContainer.classList.add('fade-out');

        // 3. Unmount P5
        if (this.p5Instance) {
            this.p5Instance.remove();
            this.p5Instance = null;
        }

        // 4. Reset Body Classes for Theme
        document.body.className = `theme-${route.theme}`;

        // 5. Fetch Data
        try {
            const response = await fetch(route.dataSource);
            let fullData = await response.json();
            let data = fullData[this.currentLang]; // Select Language

            // 6. Build HTML
            setTimeout(() => {
                this.renderContent(data, routeKey, route.theme);

                // 7. Mount New P5
                const container = document.getElementById('canvas-container');
                container.innerHTML = '';
                this.p5Instance = new p5(route.sketch, container);

                // 8. Transition In
                this.contentContainer.classList.remove('fade-out');
                this.contentContainer.classList.add('fade-in');
                setTimeout(() => this.contentContainer.classList.remove('fade-in'), 500);

            }, 300);

        } catch (e) {
            console.error("Navigation failed", e);
        }
    }

    renderContent(data, type, theme) {
        let html = '';

        if (type === 'home') {
            html = `
                <section class="section-home handwriting">
                    <div class="hero-block">
                        <h1>${data.title}</h1>
                        <p class="hand-text delay-1">${data.intro_1}</p>
                        <p class="hand-text delay-2">${data.intro_2}</p>
                        <p class="hand-text delay-3">${data.intro_3}</p>
                    </div>
                </section>
            `;
        } else if (type === 'philosophy') {
            const articles = data.articles.map(a => `
                <article>
                    <h3>${a.title}</h3>
                    <p class="meta">${a.meta} • ${a.year}</p>
                    <p>${a.summary}</p>
                </article>
            `).join('');

            html = `
                <section class="section-list">
                    <div class="content-block swiss-style">
                        <header class="module-header">
                            <h2>${data.title}</h2>
                            <p class="subtitle">${data.subtitle}</p>
                        </header>
                        <div class="article-list">${articles}</div>
                    </div>
                </section>
            `;
        } else if (type === 'research') {
            const projects = data.projects.map(p => `
                <div class="project-card blueprint-card">
                    <div class="card-header">${p.title}</div>
                    <p>${p.description}</p>
                </div>
            `).join('');

            html = `
                <section class="section-grid">
                    <div class="content-block blueprint-style">
                        <header class="module-header">
                            <h2>${data.title}</h2>
                            <p class="subtitle">${data.subtitle}</p>
                        </header>
                        <div class="project-grid">${projects}</div>
                    </div>
                </section>
            `;
        } else if (type === 'about') {
            const socials = data.socials.map(s => `<a href="${s.link}" class="social-link">${s.name}</a>`).join(' / ');
            html = `
                <section class="section-center">
                    <div class="contact-card-3d">
                        <h2>${data.title}</h2>
                        <div class="card-body">
                            <p><strong>Email:</strong> ${data.email}</p>
                            <p class="links">${socials}</p>
                            <a href="#" class="btn-download">${data.cv}</a>
                        </div>
                    </div>
                </section>
             `;
        }

        this.contentContainer.innerHTML = html;
    }
}

new App();
