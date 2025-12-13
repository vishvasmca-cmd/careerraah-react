export interface Job {
    id: string;
    title: string;
    department: string;
    source: string;
    url: string;
    pdf_url?: string;
    raw_text?: string;
    structured?: any;
    hindi_summary?: string;
    summary?: string;
    created_at: string;
    seo_content?: {
        title: string;
        slug: string;
        metaDescription: string;
        keywords: string[];
        articleBody: string;
    };
}
