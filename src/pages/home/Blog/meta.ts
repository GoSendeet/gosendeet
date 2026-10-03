import type { BlogPost } from "./types";
export const blogTitle = "Delivery guides for Nigeria | GoSendeet Blog";
export const blogDescription = "Practical answers to delivery questions in Nigeria: courier costs, Lagos to Ibadan shipping, delayed parcels and delivery for online sellers.";
export const sectionId = (index: number) => `section-${index + 1}`;

export function blogSchema(posts: BlogPost[], post?: BlogPost) {
  const url = `https://gosendeet.com/blog${post ? `/${post.slug}` : ""}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      post ? {
        "@type": "BlogPosting", headline: post.title, description: post.description,
        ...(post.published_at ? { datePublished: post.published_at } : {}), dateModified: post.updated_at || post.published_at,
        ...(post.cover_image ? { image: new URL(post.cover_image, "https://gosendeet.com").href } : {}),
        author: { "@type": "Person", name: post.author },
        publisher: { "@type": "Organization", name: "GoSendeet", url: "https://gosendeet.com" },
        mainEntityOfPage: url, inLanguage: "en-NG",
      } : {
        "@type": "Blog", name: blogTitle, description: blogDescription, url,
        blogPost: posts.filter(item => item.status === "published").map(item => ({ "@type": "BlogPosting", headline: item.title, url: `https://gosendeet.com/blog/${item.slug}` })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://gosendeet.com" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://gosendeet.com/blog" },
          ...(post ? [{ "@type": "ListItem", position: 3, name: post.title, item: url }] : []),
        ],
      },
    ],
  };
}

