import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { loadPosts } from './blog-content.mjs';

// Render the same article component used by the app, so crawlers and readers
// receive the complete content even before JavaScript loads.
const componentUrl = new URL('../src/pages/home/Blog/BlogContent.tsx', import.meta.url);
const compiledUrl = new URL('./.blog-content.mjs', import.meta.url);
const metaUrl = new URL('./.blog-meta.mjs', import.meta.url);
await writeFile(metaUrl, ts.transpileModule(await readFile(new URL('../src/pages/home/Blog/meta.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText);
const source = await readFile(componentUrl, 'utf8');
await writeFile(compiledUrl, ts.transpileModule(source, {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText);
try {
  const { default: BlogContent } = await import(compiledUrl.href);
  const { blogTitle, blogDescription, blogSchema } = await import(metaUrl.href);
  const posts = loadPosts();
  const template = await readFile('dist/index.html', 'utf8');
  const css = await readFile(new URL('../src/pages/home/Blog/blog.css', import.meta.url), 'utf8');
  const escape = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  for (const post of [undefined, ...posts]) {
    const path = `/blog${post ? `/${post.slug}` : ''}`;
    const title = post ? post.seo_title : blogTitle;
    const description = post?.description ?? blogDescription;
    const url = `https://gosendeet.com${path}`;
    let html = template.replace(/<title>[\s\S]*?<\/title>/, '')
      .replace(/<meta\s+(?:name="(?:description|keywords|twitter:title|twitter:description|twitter:image|twitter:card)"|property="og:(?:title|description|url|type|image|image:alt)")[^>]*>/g, '');
    const meta = `<title data-rh="true">${escape(title)}</title>
      <meta data-rh="true" name="description" content="${escape(description)}" />
      <link data-rh="true" rel="canonical" href="${url}" />
      <meta data-rh="true" property="og:title" content="${escape(title)}" />
      <meta data-rh="true" property="og:description" content="${escape(description)}" />
      <meta data-rh="true" property="og:url" content="${url}" />
      <meta data-rh="true" property="og:type" content="${post ? 'article' : 'website'}" />
      <meta data-rh="true" name="twitter:title" content="${escape(title)}" />
      <meta data-rh="true" name="twitter:description" content="${escape(description)}" />
      ${post?.cover_image ? `<meta data-rh="true" property="og:image" content="${escape(new URL(post.cover_image, url).href)}" /><meta data-rh="true" property="og:image:alt" content="${escape(post.cover_image_alt)}" /><meta data-rh="true" name="twitter:card" content="summary_large_image" /><meta data-rh="true" name="twitter:image" content="${escape(new URL(post.cover_image, url).href)}" />` : ''}
      <script data-rh="true" type="application/ld+json">${JSON.stringify(blogSchema(posts, post)).replace(/</g, '\\u003c')}</script>
      <style>${css}</style>`;
    const content = renderToStaticMarkup(createElement(BlogContent, { posts, post }));
    html = html.replace('</head>', `${meta}</head>`).replace('<div id="root"></div>', `<div id="root"><header style="padding:20px 24px;border-bottom:1px solid #dce6df"><a href="/" style="font-weight:700;color:#146d43">GoSendeet</a> · <a href="/blog">Blog</a> · <a href="/cost-calculator">Get a quote</a></header><main>${content}</main></div>`);
    await mkdir(`dist${path}`, { recursive: true });
    await writeFile(`dist${path}/index.html`, html);
  }
  let sitemap = await readFile('public/sitemap.xml', 'utf8');
  sitemap = sitemap.replace(/\s*<url>\s*<loc>https:\/\/gosendeet\.com\/blog[^<]*<\/loc>[\s\S]*?<\/url>/g, '');
  const urls = ['/blog', ...posts.map(post => `/blog/${post.slug}`)].map(route => `<url><loc>https://gosendeet.com${route}</loc></url>`).join('\n');
  await writeFile('dist/sitemap.xml', sitemap.replace('</urlset>', `${urls}\n</urlset>`));
  console.log(`Generated blog index and ${posts.length} articles with full HTML and metadata.`);
} finally {
  await unlink(compiledUrl);
  await unlink(metaUrl);
}
