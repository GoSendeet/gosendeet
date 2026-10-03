import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

export function loadPosts(root = process.cwd(), includeDrafts = false) {
  const files = ['content/blog', 'docs/blog-drafts'].flatMap(dir => {
    const absolute = path.join(root, dir);
    return fs.existsSync(absolute) ? fs.readdirSync(absolute).filter(name => name.endsWith('.md') && name !== 'README.md').map(name => path.join(absolute, name)) : [];
  });
  const entries = files.map(file => ({ file, ...matter(fs.readFileSync(file, 'utf8')) }));
  const slugs = new Set();
  for (const { file, data } of entries) {
    const fail = message => { throw new Error(`${path.relative(root, file)}: ${message}`); };
    for (const key of ['title', 'slug', 'author', 'description', 'category']) if (typeof data[key] !== 'string' || !data[key].trim()) fail(`Missing ${key}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || slugs.has(data.slug)) fail('Invalid or duplicate slug');
    slugs.add(data.slug);
    if (!['draft', 'published'].includes(data.status)) fail('status must be draft or published');
    if (data.status === 'published' && (!/^\d{4}-\d{2}-\d{2}$/.test(data.published_at || '') || Number.isNaN(Date.parse(data.published_at)))) fail('Published articles need published_at (YYYY-MM-DD)');
    for (const key of ['tags', 'related']) if (data[key] !== undefined && (!Array.isArray(data[key]) || data[key].some(value => typeof value !== 'string'))) fail(`${key} must be a list of strings`);
    for (const key of ['published_at', 'updated_at']) if (data[key] !== undefined && (typeof data[key] !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data[key]) || Number.isNaN(Date.parse(data[key])) || new Date(data[key]).toISOString().slice(0, 10) !== data[key])) fail(`${key} must be a valid YYYY-MM-DD date`);
    if (data.cover_image) {
      if (!data.cover_image_alt) fail('Cover image needs descriptive alt text');
      if (!/^https:\/\//.test(data.cover_image) && (!/^\/(?!\/)/.test(data.cover_image) || data.cover_image.includes('..') || !fs.existsSync(path.join(root, 'public', data.cover_image)))) fail('Cover image must be an existing public file or HTTPS URL');
    }
  }
  const visible = entries.filter(entry => includeDrafts || entry.data.status === 'published');
  const visibleSlugs = new Set(visible.map(entry => entry.data.slug));
  const fileSlugs = new Map(entries.map(entry => [path.basename(entry.file), entry.data.slug]));
  return visible.map(({ data, content }) => {
    const headings = [];
    const ids = new Map();
    const md = new MarkdownIt({ html: false, linkify: true });
    md.renderer.rules.heading_open = (tokens, index, options, env, renderer) => {
      const title = tokens[index + 1].children?.filter(token => token.type === 'text' || token.type === 'code_inline').map(token => token.content).join('') || tokens[index + 1].content;
      const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
      const count = (ids.get(base) || 0) + 1; ids.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      tokens[index].attrSet('id', id);
      if (tokens[index].tag === 'h2') headings.push({ title, id });
      return renderer.renderToken(tokens, index, options);
    };
    md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
      const href = tokens[index].attrGet('href') || '';
      const match = href.match(/^([^#?]+\.md)(#.*)?$/);
      if (match) {
        const slug = fileSlugs.get(path.basename(match[1]));
        if (!slug) throw new Error(`${data.slug}: Unknown Markdown link ${href}`);
        tokens[index].attrSet('href', visibleSlugs.has(slug) ? `/blog/${slug}${match[2] || ''}` : '/blog');
      }
      if (/^https?:\/\//.test(href)) tokens[index].attrSet('rel', 'noopener noreferrer');
      return renderer.renderToken(tokens, index, options);
    };
    const originalImage = md.renderer.rules.image;
    md.renderer.rules.image = (tokens, index, options, env, renderer) => {
      tokens[index].attrSet('loading', 'lazy'); tokens[index].attrSet('decoding', 'async');
      return originalImage(tokens, index, options, env, renderer);
    };
    md.renderer.rules.table_open = () => '<div class="blog-table-scroll" tabindex="0" role="region" aria-label="Scrollable table"><table>';
    md.renderer.rules.table_close = () => '</table></div>';
    content = content.replace(/^# .+\r?\n/, '').replace(/^\s*By .+\r?\n/, '').trim();
    const html = md.render(content);
    return { ...data, seo_title: data.seo_title || `${data.title} | Gosendeet`, tags: data.tags || [], related: (data.related || []).filter(slug => visibleSlugs.has(slug)), html, headings, reading_minutes: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)) };
  }).sort((a, b) => (a.priority_rank || 100) - (b.priority_rank || 100) || String(b.published_at || '').localeCompare(String(a.published_at || '')));
}

export function blogContentPlugin() {
  let root; let includeDrafts;
  return {
    name: 'gosendeet-markdown',
    configResolved(config) { root = config.root; includeDrafts = config.command === 'serve'; },
    resolveId(id) { if (id === 'virtual:blog-posts') return '\0virtual:blog-posts'; },
    load(id) { if (id === '\0virtual:blog-posts') return `export default ${JSON.stringify(loadPosts(root, includeDrafts))}`; },
    configureServer(server) {
      for (const dir of ['content/blog', 'docs/blog-drafts']) server.watcher.add(path.join(root, dir));
      server.watcher.on('all', (event, file) => {
        if (file.endsWith('.md') && /(?:content\/blog|docs\/blog-drafts)/.test(file)) {
          const module = server.moduleGraph.getModuleById('\0virtual:blog-posts');
          if (module) server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}
