import './styles/global.css';
import './styles/layout.css';
import './styles/typography.css';
import p5 from 'p5';
import { marked } from 'marked';

import { HomeSketch } from './sketches/HomeSketch.js';
import { PhilosophySketch } from './sketches/PhilosophySketch.js';
import { ResearchSketch } from './sketches/ResearchSketch.js';
import { AboutSketch } from './sketches/AboutSketch.js';

// --- Bilingual Nav Labels ---
const NAV_LABELS = {
    home: {
        en: { title: '01. Home', sub: 'Welcome' },
        cn: { title: '01. 首页', sub: '欢迎' }
    },
    philosophy: {
        en: { title: '02. Philosophy', sub: 'Popular philosophy articles' },
        cn: { title: '02. 哲学导论', sub: '为哲学爱好者而写的哲学普及文章' }
    },
    research: {
        en: { title: '03. Research', sub: 'My research projects' },
        cn: { title: '03. 研究项目', sub: '我的研究项目和研究内容' }
    },
    about: {
        en: { title: '04. About', sub: 'About me' },
        cn: { title: '04. 关于我', sub: '关于我' }
    }
};

const ROUTES = {
    home: { sketch: HomeSketch, theme: 'organic' },
    philosophy: { sketch: PhilosophySketch, theme: 'swiss' },
    research: { sketch: ResearchSketch, theme: 'blueprint' },
    about: { sketch: AboutSketch, theme: 'minimal' }
};

class App {
    constructor() {
        this.currentLang = 'en';
        this.currentRoute = 'home';
        this.currentArticle = null; // Track active article { id, type }
        this.p5Instance = null;
        this.contentContainer = document.getElementById('app');
        this.navItems = document.querySelectorAll('.nav-item');
        this.langToggle = document.getElementById('lang-toggle');

        // Cached data
        this.taxonomy = null;
        this.philArticles = null;
        this.resArticles = null;

        this.init();
    }

    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                this.navigate(e.currentTarget.dataset.target);
            });
        });
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        this.updateNavLabels();
        this.navigate('home');
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'en' ? 'cn' : 'en';
        this.langToggle.innerText = this.currentLang === 'en' ? '中文' : 'EN';
        document.body.classList.toggle('lang-cn', this.currentLang === 'cn');
        this.updateNavLabels();

        // If viewing an article, reload it in the new language
        if (this.currentArticle) {
            this.showArticleDetail(this.currentArticle.id, this.currentArticle.type);
        } else {
            this.navigate(this.currentRoute);
        }
    }

    updateNavLabels() {
        this.navItems.forEach(item => {
            const key = item.dataset.target;
            const labels = NAV_LABELS[key]?.[this.currentLang];
            if (labels) {
                item.querySelector('.nav-title').textContent = labels.title;
                item.querySelector('.nav-subtitle').textContent = labels.sub;
            }
        });
    }

    async navigate(routeKey) {
        this.currentRoute = routeKey;
        this.currentArticle = null; // Clear active article on nav change
        const route = ROUTES[routeKey];
        if (!route) return;

        // Active state
        this.navItems.forEach(n => n.classList.remove('active'));
        document.querySelector(`[data-target="${routeKey}"]`)?.classList.add('active');

        // Fade out
        this.contentContainer.classList.add('fade-out');

        // Kill old sketch
        if (this.p5Instance) { this.p5Instance.remove(); this.p5Instance = null; }

        // Theme (preserve lang-cn class)
        const langClass = this.currentLang === 'cn' ? ' lang-cn' : '';
        document.body.className = `theme-${route.theme}${langClass}`;

        try {
            setTimeout(async () => {
                await this.renderContent(routeKey);

                // New sketch
                const container = document.getElementById('canvas-container');
                container.innerHTML = '';
                this.p5Instance = new p5(route.sketch, container);

                // Fade in
                this.contentContainer.classList.remove('fade-out');
                this.contentContainer.classList.add('fade-in');
                setTimeout(() => this.contentContainer.classList.remove('fade-in'), 600);
            }, 300);
        } catch (e) {
            console.error('Navigation failed:', e);
        }
    }

    // Helper to resolve paths with base URL (for GitHub Pages)
    resolvePath(path) {
        // Vite's import.meta.env.BASE_URL includes trailing slash (e.g. "/personal-website/")
        const base = import.meta.env.BASE_URL;
        // Remove leading slash from path to avoid double slashes
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${base}${cleanPath}`;
    }

    async renderContent(type) {
        let html = '';

        if (type === 'home') {
            const res = await fetch(this.resolvePath('home.json'));
            const data = (await res.json())[this.currentLang];

            // Title is ALWAYS English. Do not translate.
            html = `
                <section class="section-home">
                    <h1 class="home-title">HE Kunquan's<br>Personal Website</h1>
                    <div class="home-lines">
                        <p class="hand-line">${data.line_1}</p>
                        <p class="hand-line">${data.line_2}</p>
                        <p class="hand-line">${data.line_3}</p>
                        <p class="hand-line">${data.line_4}</p>
                    </div>
                </section>
            `;
        } else if (type === 'philosophy') {
            html = await this.renderPhilosophy();
        } else if (type === 'research') {
            html = await this.renderResearch();
        } else if (type === 'about') {
            const res = await fetch(this.resolvePath('about.json'));
            const data = (await res.json())[this.currentLang];
            const sections = data.sections.map(s => `
                <div class="about-section">
                    <h3>${s.heading}</h3>
                    <p>${s.content}</p>
                </div>
            `).join('');
            html = `
                <section class="section-about">
                    <h2>${data.title}</h2>
                    <p class="about-bio">${data.bio}</p>
                    ${sections}
                </section>
            `;
        }

        this.contentContainer.innerHTML = html;
    }

    // =====================
    // PHILOSOPHY MODULE
    // =====================
    async renderPhilosophy() {
        // Load taxonomy and articles from public/
        if (!this.taxonomy) {
            const taxRes = await fetch(this.resolvePath('philosophy/taxonomy.json'));
            this.taxonomy = await taxRes.json();
        }
        if (!this.philArticles) {
            const artRes = await fetch(this.resolvePath('philosophy/index.json'));
            this.philArticles = await artRes.json();
        }

        const lang = this.currentLang;
        const title = lang === 'en' ? 'Introduction to Philosophy' : '哲学导论';
        const subtitle = lang === 'en' ? 'Popular philosophy articles for enthusiasts.' : '为哲学爱好者而写的哲学普及文章。';

        const treeHTML = this.buildTaxonomyTree(this.taxonomy, this.philArticles, lang);

        const articleCards = this.philArticles.map(a => {
            const artTitle = lang === 'en' ? a.title_en : a.title_cn;
            const artSummary = lang === 'en' ? a.summary_en : a.summary_cn;
            return `
                <div class="phil-article clickable-card" data-id="${a.id}" data-tags="${a.tags.join(',')}">
                    <h3>${artTitle}</h3>
                    <span class="phil-year">${a.year}</span>
                    <p>${artSummary}</p>
                    <div class="phil-tags">${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                </div>
            `;
        }).join('');

        const randomLabel = lang === 'en' ? '🎲 Random' : '🎲 随机';
        const allLabel = lang === 'en' ? 'Show All' : '全部';

        const html = `
            <section class="section-philosophy">
                <header class="module-header">
                    <h2>${title}</h2>
                    <p class="module-subtitle">${subtitle}</p>
                </header>
                <div class="philosophy-layout">
                    <aside class="taxonomy-tree">
                        <div class="tree-controls">
                            <button id="btn-random" class="tree-btn">${randomLabel}</button>
                            <button id="btn-show-all" class="tree-btn">${allLabel}</button>
                        </div>
                        <ul class="tree-root">${treeHTML}</ul>
                    </aside>
                    <div class="article-panel">${articleCards}</div>
                </div>
            </section>
        `;

        setTimeout(() => this.bindPhilosophyTree(), 0);
        return html;
    }

    // =====================
    // RESEARCH MODULE
    // =====================
    async renderResearch() {
        // Load from .md-based index
        if (!this.resArticles) {
            const artRes = await fetch(this.resolvePath('research/index.json'));
            this.resArticles = await artRes.json();
        }

        const lang = this.currentLang;
        const title = lang === 'en' ? 'Research Projects' : '研究项目';
        const subtitle = lang === 'en' ? 'My research projects and content.' : '我的研究项目和研究内容。';

        const cards = this.resArticles.map(a => {
            const artTitle = lang === 'en' ? a.title_en : a.title_cn;
            const artSummary = lang === 'en' ? a.summary_en : a.summary_cn;
            return `
                <div class="research-card clickable-card" data-id="${a.id}">
                    <h3>${artTitle}</h3>
                    <span class="phil-year">${a.year}</span>
                    <p>${artSummary}</p>
                </div>
            `;
        }).join('');

        const html = `
            <section class="section-research">
                <header class="module-header">
                    <h2>${title}</h2>
                    <p class="module-subtitle">${subtitle}</p>
                </header>
                <div class="research-grid">${cards}</div>
            </section>
        `;

        setTimeout(() => this.bindResearchCards(), 0);
        return html;
    }

    bindResearchCards() {
        document.querySelectorAll('.research-card.clickable-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                if (id) this.showArticleDetail(id, 'research');
            });
        });
    }

    // =====================
    // ARTICLE DETAIL VIEW
    // =====================
    async showArticleDetail(id, type) {
        const backLabel = this.currentLang === 'en' ? '← Back' : '← 返回';

        // Find article object
        let collection = type === 'philosophy' ? this.philArticles : this.resArticles;
        const article = collection?.find(a => a.id === id);

        if (!article) {
            console.error('Article not found:', id);
            return;
        }

        // Set active state
        this.currentArticle = { id, type };

        // Determine filename based on lang
        let filename = this.currentLang === 'cn' ? article.file_cn : article.file_en;
        // Fallback: if CN file missing, use EN (or vice versa), which build-index.js already handles
        // by populating both fields. But just in case:
        if (!filename) filename = article.file_en || article.file_cn;

        const folder = type; // 'philosophy' or 'research'

        // Hide canvas so it doesn't bleed through
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) canvasContainer.style.display = 'none';

        try {
            const res = await fetch(this.resolvePath(`${folder}/${filename}`));
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const raw = await res.text();

            // Strip YAML frontmatter
            const bodyMatch = raw.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
            const body = bodyMatch ? bodyMatch[1].trim() : raw;

            // Render markdown
            const htmlBody = marked(body);

            this.contentContainer.innerHTML = `
                <section class="article-detail">
                    <button class="back-btn" id="btn-back">${backLabel}</button>
                    <div class="article-body">${htmlBody}</div>
                </section>
            `;

            document.getElementById('btn-back')?.addEventListener('click', () => {
                // Restore canvas
                if (canvasContainer) canvasContainer.style.display = 'block';
                this.currentArticle = null;
                this.navigate(this.currentRoute);
            });
        } catch (e) {
            console.error('Failed to load article:', e);
            this.contentContainer.innerHTML = `<p class="error">Failed to load content. Please try again.</p>`;
        }
    }

    // =====================
    // TAXONOMY TREE
    // =====================
    buildTaxonomyTree(taxonomy, articles, lang) {
        const activeTags = new Set();
        articles.forEach(a => a.tags.forEach(t => activeTags.add(t)));

        let html = '';
        for (const [topCat, topNode] of Object.entries(taxonomy)) {
            const topLabel = lang === 'cn' ? (topNode.label_cn || topCat) : topCat;
            const children = topNode.children || {};
            const childHTML = this.buildSubTree(children, activeTags, lang);

            html += `
                <li class="tree-top" data-tag="${topCat}">
                    <span class="tree-top-label">${topLabel}</span>
                    <ul class="tree-children">${childHTML}</ul>
                </li>
            `;
        }
        return html;
    }

    buildSubTree(nodes, activeTags, lang) {
        let html = '';
        for (const [name, node] of Object.entries(nodes)) {
            const label = lang === 'cn' ? (node.label_cn || name) : name;
            const children = node.children || {};
            const childKeys = Object.keys(children);
            const hasArticles = activeTags.has(name);
            const hasActiveDescendant = this.hasActiveDescendants(children, activeTags);

            if (!hasArticles && !hasActiveDescendant) continue;

            if (childKeys.length > 0) {
                const subHTML = this.buildSubTree(children, activeTags, lang);
                if (subHTML) {
                    html += `
                        <li class="tree-branch" data-tag="${name}">
                            <span class="tree-label">${label}</span>
                            <ul class="tree-children">${subHTML}</ul>
                        </li>
                    `;
                } else if (hasArticles) {
                    html += `<li class="tree-leaf" data-tag="${name}"><span class="tree-label">${label}</span></li>`;
                }
            } else if (hasArticles) {
                html += `<li class="tree-leaf" data-tag="${name}"><span class="tree-label">${label}</span></li>`;
            }
        }
        return html;
    }

    hasActiveDescendants(nodes, activeTags) {
        for (const [name, node] of Object.entries(nodes)) {
            if (activeTags.has(name)) return true;
            if (node.children && this.hasActiveDescendants(node.children, activeTags)) return true;
        }
        return false;
    }

    bindPhilosophyTree() {
        // Click leaf/branch → filter
        document.querySelectorAll('.tree-leaf, .tree-branch').forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                const tag = node.dataset.tag;
                document.querySelectorAll('.tree-leaf, .tree-branch, .tree-top').forEach(n => n.classList.remove('active-tag'));
                node.classList.add('active-tag');
                document.querySelectorAll('.phil-article').forEach(art => {
                    const tags = art.dataset.tags.split(',');
                    art.style.display = tags.includes(tag) ? 'block' : 'none';
                });
            });
        });

        // Click top-level → toggle expand/collapse
        document.querySelectorAll('.tree-top').forEach(top => {
            top.addEventListener('click', (e) => {
                if (e.target.closest('.tree-leaf') || e.target.closest('.tree-branch')) return;
                top.classList.toggle('collapsed');
            });
        });

        // Show All
        document.getElementById('btn-show-all')?.addEventListener('click', () => {
            document.querySelectorAll('.tree-leaf, .tree-branch, .tree-top').forEach(n => n.classList.remove('active-tag'));
            document.querySelectorAll('.phil-article').forEach(a => a.style.display = 'block');
        });

        // Random
        document.getElementById('btn-random')?.addEventListener('click', () => {
            const articles = this.philArticles;
            if (!articles.length) return;
            const pick = articles[Math.floor(Math.random() * articles.length)];

            document.querySelectorAll('.phil-article').forEach(a => {
                a.style.display = a.dataset.id === pick.id ? 'block' : 'none';
            });

            document.querySelectorAll('.tree-leaf, .tree-branch, .tree-top').forEach(n => {
                n.classList.remove('active-tag');
                if (pick.tags.includes(n.dataset.tag)) {
                    n.classList.add('active-tag');
                    const parent = n.closest('.tree-top');
                    if (parent) parent.classList.remove('collapsed');
                }
            });
        });

        // Click article card → open detail view
        document.querySelectorAll('.phil-article.clickable-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                if (id) this.showArticleDetail(id, 'philosophy');
            });
        });
    }
}

new App();
