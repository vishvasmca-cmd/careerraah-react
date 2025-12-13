
import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Helper to validate UUID
const isUUID = (str: string) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    try {
        let query = supabase.from('jobs').select('*');

        if (isUUID(id)) {
            query = query.eq('id', id);
        } else {
            // Query by JSONB slug field: seo_content->>slug
            query = query.eq('seo_content->>slug', id);
        }

        const { data, error } = await query.single();

        if (error) {
            // If not found by slug, maybe try title match? Or just return 404.
            // The original code returned 404 if data was null.
            if (error.code === 'PGRST116') { // code for no rows returned
                return NextResponse.json({ error: 'Job not found' }, { status: 404 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(data);

    } catch (err: any) {
        console.error('Server Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
