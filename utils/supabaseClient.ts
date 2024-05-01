import {createClient} from "@supabase/supabase-js"

export const supabaseClient = async(supabaseToken: any) => {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPERBASE_URI!,
        process.env.NEXT_PUBLIC_SUPERBASE_KEY!,
        {
            global: {headers: {Authorization: `bearer ${supabaseToken}`}}
        }
    );

    return supabase;
};