import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import posts from "virtual:blog-posts";
import BlogContent from "./BlogContent";
import { blogDescription, blogSchema, blogTitle } from "./meta";
import "./blog.css";

export default function Blog() {
  const { slug } = useParams();
  const post = posts.find(item => item.slug === slug);
  if (slug && !post) return <Layout><PageMeta title="Guide not found | GoSendeet" description="This delivery guide could not be found." path={`/blog/${slug}`} noIndex /><div className="blog-shell blog-hero"><h1>Guide not found</h1><p>Browse our delivery guides for Nigeria.</p><Link to="/blog" className="blog-button">Back to the blog</Link></div></Layout>;
  return <Layout>
    <PageMeta title={post ? post.seo_title : blogTitle} description={post?.description ?? blogDescription} path={post ? `/blog/${post.slug}` : "/blog"} noIndex={import.meta.env.DEV || post?.status === "draft"} />
    <Helmet>{post?.cover_image && <><meta property="og:image" content={new URL(post.cover_image, "https://gosendeet.com").href} /><meta property="og:image:alt" content={post.cover_image_alt} /><meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content={new URL(post.cover_image, "https://gosendeet.com").href} /></>}<meta property="og:type" content={post ? "article" : "website"} /><script type="application/ld+json">{JSON.stringify(blogSchema(posts, post)).replace(/</g, "\\u003c")}</script></Helmet>
    <BlogContent posts={posts} post={post} />
  </Layout>;
}
