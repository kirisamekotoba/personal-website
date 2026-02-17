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
    const articlesMap = new Map();

    for (const file of files) {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
        const { data } = matter(raw);

        if (!data.id) {
            console.warn(`⚠ Skipping ${file}: missing "id" in frontmatter`);
            continue;
        }

        if (!articlesMap.has(data.id)) {
            articlesMap.set(data.id, {
                id: data.id,
                // Default metadata from the first file encountered (usually fine if they match)
                title_en: data.title_en || data.title,
                title_cn: data.title_cn || data.title_en,
                tags: data.tags || [],
                year: String(data.year || ''),
                summary_en: data.summary_en || '',
                summary_cn: data.summary_cn || '',
                // Initialize file paths
                file_en: null,
                file_cn: null
            });
        }

        const entry = articlesMap.get(data.id);

        // Determine language based on filename (e.g., name.cn.md) or fallback
        if (file.includes('.cn.md')) {
            entry.file_cn = file;
            // Merge CN specific metadata if available and not set
            if (data.title_cn) entry.title_cn = data.title_cn;
            if (data.summary_cn) entry.summary_cn = data.summary_cn;
        } else {
            // Assume .en.md or just .md is English/Default
            entry.file_en = file;
            if (data.title_en) entry.title_en = data.title_en;
            if (data.summary_en) entry.summary_en = data.summary_en;
        }
    }

    // Convert map to array and handle missing files fallback
    return Array.from(articlesMap.values()).map(a => {
        // If one is missing, fallback to the other
        if (!a.file_en) a.file_en = a.file_cn;
        if (!a.file_cn) a.file_cn = a.file_en;
        return a;
    });
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
