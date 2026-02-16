import './styles/global.css';
import './styles/layout.css';
import './styles/typography.css';
import p5 from 'p5';

// Import Sketches
import { HomeSketch } from './sketches/HomeSketch.js';
import { PhilosophySketch } from './sketches/PhilosophySketch.js';
import { ResearchSketch } from './sketches/ResearchSketch.js';

// Configuration
const ROUTES = {
    'home': {
        dataSource: '/src/data/home.json',
        sketch: HomeSketch,
        theme: 'minimal'
    },
    'philosophy': {
        dataSource: '/src/data/philosophy.json',
        sketch: PhilosophySketch,
        theme: 'structural'
    },
    'research': {
        dataSource: '/src/data/research.json',
        sketch: ResearchSketch,
        theme: 'chaotic'
    }
};

class App {
    constructor() {
        this.currentSketch = null;
        this.p5Instance = null;
        this.contentContainer = document.getElementById('app');
        this.navItems = document.querySelectorAll('.nav-item');

        this.init();
    }

    init() {
        // Event Listeners
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.target;
                this.navigate(target);
            });
        });

        // Load initial state
        this.navigate('home');
    }

    async navigate(routeKey) {
        const route = ROUTES[routeKey];
        if (!route) return;

        // 1. Update UI State
        this.navItems.forEach(n => n.classList.remove('active'));
        document.querySelector(`[data-target="${routeKey}"]`).classList.add('active');

        // 2. Transition Out (Fade)
        this.contentContainer.classList.add('fade-out');

        // 3. Unmount P5
        if (this.p5Instance) {
            this.p5Instance.remove();
            this.p5Instance = null;
        }

        // 4. Fetch Data
        try {
            // In Vite dev, we can import JSON directly or fetch it. Fetch implies public/ folder usually, 
            // but we can just dynamic import for now or use fetch if in public.
            // Let's use fetch assuming we serve correctly, or simple dynamic import.
            // For simplicity in this Setup: use variables. Real app: fetch.
            // Let's mock fetch for now or use the raw json files we will write.
            // We'll trust Vite to serve /src/data json if referenced.
            const response = await fetch(route.dataSource);
            const data = await response.json();

            // 5. Build HTML
            setTimeout(() => {
                this.renderContent(data, routeKey);

                // 6. Mount New P5
                const container = document.getElementById('canvas-container');
                // Ensure container is clean
                container.innerHTML = '';
                this.p5Instance = new p5(route.sketch, container);

                // 7. Transition In
                this.contentContainer.classList.remove('fade-out');
                this.contentContainer.classList.add('fade-in');
                setTimeout(() => this.contentContainer.classList.remove('fade-in'), 500);

            }, 300); // Wait for fade out

        } catch (e) {
            console.error("Navigation failed", e);
        }
    }

    renderContent(data, type) {
        let html = '';

        if (type === 'home') {
            html = `
                <section class="section-home">
                    <div class="hero-block">
                        <h1>${data.title}</h1>
                        <p class="subtitle">${data.subtitle}</p>
                        <div class="divider"></div>
                        <div class="body-text">${data.intro}</div>
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
                    <div class="content-block">
                        <h2>${data.title}</h2>
                        <div class="article-list">${articles}</div>
                    </div>
                </section>
            `;
        } else if (type === 'research') {
            const projects = data.projects.map(p => `
                <div class="project-card">
                    <div class="card-header">${p.title}</div>
                    <p>${p.description}</p>
                </div>
            `).join('');

            html = `
                <section class="section-grid">
                    <div class="content-block">
                        <h2>${data.title}</h2>
                        <div class="project-grid">${projects}</div>
                    </div>
                </section>
            `;
        }

        this.contentContainer.innerHTML = html;

        // Dynamic Grid update (Optional: Could add classes to body to shift grid lines)
        document.body.className = `theme-${type}`;
    }
}

// Start
new App();
