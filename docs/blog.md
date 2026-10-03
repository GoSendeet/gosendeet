# Gosendeet blog

Gosendeet keeps its existing React/Vite stack. Markdown parsing happens in Node at development/build time, so neither the parser nor Astro is shipped to visitors. The build also creates full article HTML for search engines and readers before JavaScript loads.

## Editing articles

The four existing public guides live in `content/blog/`. The first 15 new articles live in `docs/blog-drafts/`. Both directories are read automatically; filenames are independent of URLs. `README.md` is ignored.

Run `npm run dev` and open `/blog` to review all articles, including clearly marked draft previews. Markdown edits reload the preview. Production builds include only articles with `status: published`.

Each file starts with YAML metadata:

```yaml
---
title: "My Clothing Business Is Growing. How Do I Keep Up With Deliveries?"
slug: "growing-clothing-business-deliveries"
author: "Ore"
status: "draft"
category: "Running a business"
description: "Practical delivery advice for a growing clothing business in Nigeria."
seo_title: "Deliveries for a Growing Clothing Business | Gosendeet"
cover_image: "/parcel.png"
cover_image_alt: "Illustration of a Gosendeet delivery truck"
tags: [Nigeria, Clothing business]
related: [delivery-fees-for-customers, deliver-clothes-across-nigeria]
---

## Start with your orders

Write the article here.
```

Required: title, slug, author, status, category and description. Published articles also require `published_at: "YYYY-MM-DD"`. Optional: seo_title, updated_at, cover_image, cover_image_alt, cover_image_caption, tags and related (article slugs). Existing research fields such as primary_keyword and last_verified can remain as editorial metadata; they do not imply a publication date. Slugs must be unique lowercase words separated by hyphens.

The three authors are Damilare Gosendeet, Ore and Seun Gosendeet. Authors appear in the byline and structured data. Reading time and the table of contents are computed from the article body. Metadata is authoritative: an existing opening H1 and `By ...` line are removed from rendered content to avoid duplication.

Put local images in `public/` and reference them with `/filename.jpg`; HTTPS image URLs also work. Cover images require descriptive alt text. Cards, article covers and social sharing metadata use the same image. A caption is optional. Articles currently use a text-only layout. Add a cover only when you have a relevant photograph or useful illustration; there is no default image. Body images use normal Markdown: `![Descriptive alt text](/photo.jpg)`. Raw HTML is escaped; headings, lists, tables, links and images work without custom components. Tables scroll on narrow screens.

Links to other Markdown articles, such as `[Guide](08-delivery-fees-for-customers.md)`, become `/blog/<slug>` links. A production link to an unpublished draft points to the blog index until the destination is published. Explicit root-relative links can also be used.

## Publishing

After editorial review, change `status` to `published`, add the actual `published_at` date, and run `npm run build`. No move or manual registration is needed. Use `updated_at` for a subsequent substantive revision. Do not backdate publication to the research date.

The build generates `/blog` and each published article with canonical URLs, SEO titles, descriptions, social images, author structured data and breadcrumbs. Published blog URLs are added to `dist/sitemap.xml` automatically. Drafts are excluded from production HTML, application data and sitemap. Vercel rewrites serve article HTML; Vite preview applies its own SPA fallback to slashless paths, so use `/blog/<slug>/` when inspecting generated HTML locally.

Run `npm run test:blog` to check draft exclusion, metadata validation, HTML safety, heading anchors, tables and cross-article links. Run `npm run build` to verify the application and static output.

Keep claims tied to verified product capabilities. Confirm current provider restrictions and route availability. Label illustrative prices clearly. Search rankings and featured snippets cannot be guaranteed by markup.
