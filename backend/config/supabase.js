const {createClient}  = require("@supabase/supabase-js");

const {
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
} = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("SUPABASE_URL is missing");
}

if (!NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is missing");
}

if (!NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
}

const supabase = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
        auth:{
            persistSession:false,
            autoRefreshToken:false,
        }

    }
);

const supabaseAdmin = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);

module.exports = {
    supabase,
    supabaseAdmin,

};