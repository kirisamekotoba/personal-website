# `public/` — 你的内容管理中心

所有网站内容都在这里管理。**不需要改任何 JS 代码。**

## 目录结构

```
public/
├── philosophy/          ← 哲学文章
│   ├── taxonomy.json    ← 分类树（Metaphysics + Value Theory）
│   ├── index.json       ← ⚙️ 自动生成，不要手动编辑
│   └── *.md             ← 你的文章
├── research/            ← 研究项目
│   ├── index.json       ← ⚙️ 自动生成
│   └── *.md             ← 你的项目
├── home.json            ← 首页欢迎文字
├── about.json           ← 关于我
└── README.md            ← 你正在看的这个文件
```

## 添加文章（零操作版）

1. 在 `philosophy/` 或 `research/` 下新建 `.md` 文件
2. 写好 YAML 头和正文
3. 就这样。没了。

`index.json` 会在以下时刻**自动重新生成**：
- `npm run dev` 启动时
- 开发中添加/修改/删除 `.md` 文件时
- `npm run build` 打包部署时

**GitHub 部署工作流**：
```
git add public/philosophy/my-article.md
git commit -m "add article"
git push
→ CI/CD 运行 npm run build → 自动生成 index → 部署完成
```

## .md 文件模板

```yaml
---
id: my-article
title_en: "My Article"
title_cn: "我的文章"
tags: ["Ontology"]
year: 2026
summary_en: "Short English summary."
summary_cn: "简短中文摘要。"
---

# 正文标题

用 Markdown 写正文。
```

## 可用标签

**形而上学 (Metaphysics)**：Ontology, Modality, Causation, Epistemology, Classical Logic, Modal Logic, Consciousness, Intentionality, Reference, Meaning

**价值论 (Value Theory)**：Normative Ethics, Metaethics, Applied Ethics, Aesthetics, Political Philosophy

需要新标签？编辑 `philosophy/taxonomy.json`。
