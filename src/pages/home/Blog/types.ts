export interface BlogPost {
  slug: string; title: string; seo_title: string; category: string; description: string;
  author: string; status: "draft" | "published"; published_at?: string; updated_at?: string;
  cover_image?: string; cover_image_alt?: string; cover_image_caption?: string;
  tags: string[]; related: string[]; reading_minutes: number; html: string;
  headings: { title: string; id: string }[];
}
