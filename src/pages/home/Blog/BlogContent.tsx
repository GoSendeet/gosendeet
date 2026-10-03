import type { BlogPost } from "./types";

function PostCard({ post }: { post: BlogPost }) {
  return <article className="blog-card">
    {post.cover_image && <a href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true"><img className="blog-cover" src={post.cover_image} alt="" width="800" height="450" loading="lazy" decoding="async" /></a>}
    <span className="blog-eyebrow">{post.category}{post.status === "draft" ? " · Draft preview" : ""}</span>
    <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
    <p>{post.description}</p><p className="blog-byline">{post.author} · {post.reading_minutes} min read</p>
    <a className="blog-text-link" href={`/blog/${post.slug}`}>Read article</a>
  </article>;
}

export default function BlogContent({ posts, post }: { posts: BlogPost[]; post?: BlogPost }) {
  const related = post ? posts.filter(item => item.slug !== post.slug && (!post.related.length || post.related.includes(item.slug))).slice(0, 3) : [];
  return <div className="blog-shell">
    <nav className="blog-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span>{post ? <><a href="/blog">Blog</a><span>/</span><span>{post.category}</span></> : <span>Blog</span>}</nav>
    {post ? <>
      <article>
        <header className="blog-hero blog-article-hero">
          <span className="blog-eyebrow">{post.category}{post.status === "draft" ? " · Draft preview" : ""}</span>
          <h1>{post.title}</h1><p className="blog-description">{post.description}</p>
          <p className="blog-byline">By {post.author} · {post.reading_minutes} min read{post.published_at && <> · <time dateTime={post.published_at}>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(post.published_at))}</time></>}</p>
          {post.cover_image && <figure><img className="blog-cover" src={post.cover_image} alt={post.cover_image_alt} width="1200" height="675" fetchPriority="high" />{post.cover_image_caption && <figcaption>{post.cover_image_caption}</figcaption>}</figure>}
        </header>
        <div className="blog-article-grid">
          {post.headings.length > 0 && <aside className="blog-toc"><h2>In this guide</h2><ol>{post.headings.map(heading => <li key={heading.id}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ol></aside>}
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        {post.tags.length > 0 && <p className="blog-tags">{post.tags.join(" · ")}</p>}
      </article>
      {related.length > 0 && <section className="blog-related"><h2>Keep reading</h2><div className="blog-card-grid">{related.map(item => <PostCard key={item.slug} post={item} />)}</div></section>}
    </> : <>
      <header className="blog-hero"><span className="blog-eyebrow">Gosendeet blog</span><h1>Delivery advice for Nigeria</h1><p className="blog-description">Help with delivery costs, customer orders, courier pickups and sending gifts.</p><a className="blog-button" href="/cost-calculator">Get a delivery quote</a></header>
      <section aria-label="Delivery guides"><div className="blog-section-heading"><h2>Articles</h2></div><div className="blog-card-grid">{posts.map(item => <PostCard key={item.slug} post={item} />)}</div></section>
    </>}
    <section className="blog-cta"><div><h2>How much will your delivery cost?</h2><p>Enter your addresses and parcel details to see available delivery options.</p></div><a className="blog-button" href="/cost-calculator">Get a quote</a><a className="blog-text-link" href="/track">Track a delivery</a></section>
  </div>;
}
