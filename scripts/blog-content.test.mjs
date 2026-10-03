import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadPosts } from './blog-content.mjs';

function fixture(t, changes = {}, body = '## Details\n\nUseful advice.') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gosendeet-blog-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'content/blog'), { recursive: true });
  const data = { title: 'A guide', slug: 'a-guide', author: 'Ore', category: 'Delivery', description: 'Practical advice', status: 'published', published_at: '2026-10-03', ...changes };
  fs.writeFileSync(path.join(root, 'content/blog/a.md'), `---\n${Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n${body}`);
  return root;
}
test('drafts are preview-only', t => {
  const root = fixture(t, { status: 'draft', published_at: undefined });
  assert.equal(loadPosts(root).length, 0);
  assert.equal(loadPosts(root, true).length, 1);
});
test('raw HTML and unsafe Markdown links cannot execute', t => {
  const [post] = loadPosts(fixture(t, {}, '<script>alert(1)</script>\n\n[bad](javascript:alert(1))'));
  assert.ok(!post.html.includes('<script>'));
  assert.ok(!post.html.includes('href="javascript:'));
});
test('table wrapping, unique heading anchors and duplicate title removal', t => {
  const [post] = loadPosts(fixture(t, {}, '# A guide\nBy Ore\n\n## Cost\n\n## Cost\n\n| Route | Fee |\n| --- | --- |\n| A | Quote |'));
  assert.deepEqual(post.headings.map(h => h.id), ['cost', 'cost-2']);
  assert.ok(post.html.includes('blog-table-scroll'));
  assert.ok(!post.html.includes('<h1'));
});
test('images need alt text and local files must exist', t => {
  assert.throws(() => loadPosts(fixture(t, { cover_image: '/missing.jpg' })), /alt text/);
  assert.throws(() => loadPosts(fixture(t, { cover_image: '/missing.jpg', cover_image_alt: 'Parcel' })), /existing public file/);
});
test('published posts need a date', t => {
  assert.throws(() => loadPosts(fixture(t, { published_at: undefined })), /published_at/);
});
test('Markdown links resolve to blog routes', t => {
  const [post] = loadPosts(fixture(t, {}, '[Read](a.md#details)'));
  assert.ok(post.html.includes('href="/blog/a-guide#details"'));
});
