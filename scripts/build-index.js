#!/usr/bin/env node
/**
 * build-index.js
 * Scans public/philosophy/*.md and public/research/*.md
 * Writes index.json for each.
 *
 * Usage: npm run index
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function buildIndex(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md');
    const articles = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
        const { data } = matter(raw);

        if (!data.id) {
            console.warn(`⚠ Skipping ${file}: missing "id" in frontmatter`);
            continue;
        }

        articles.push({
            id: data.id,
            file: file,
            title_en: data.title_en || data.title || file,
            title_cn: data.title_cn || data.title_en || file,
            tags: data.tags || [],
            year: String(data.year || ''),
            summary_en: data.summary_en || '',
            summary_cn: data.summary_cn || ''
        });
    }

    return articles;
}

// --- Philosophy ---
const philDir = path.resolve(__dirname, '../public/philosophy');
const philArticles = buildIndex(philDir);
fs.writeFileSync(path.join(philDir, 'index.json'), JSON.stringify(philArticles, null, 2), 'utf-8');
console.log(`✅ Philosophy: ${philArticles.length} articles → public/philosophy/index.json`);

// --- Research ---
const resDir = path.resolve(__dirname, '../public/research');
const resArticles = buildIndex(resDir);
fs.writeFileSync(path.join(resDir, 'index.json'), JSON.stringify(resArticles, null, 2), 'utf-8');
console.log(`✅ Research: ${resArticles.length} articles → public/research/index.json`);
