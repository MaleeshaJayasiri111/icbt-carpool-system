const {createClient}  = require("@supabase/supabase-js");

const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY
} = process.env;
console.log(SUPABASE_URL);
console.log(SUPABASE_ANON_KEY);

if (!SUPABASE_URL) {
    throw new Error("SUPABASE_URL is missing");
}

if (!SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY is missing");
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
}

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth:{
            persistSession:false,
            autoRefreshToken:false,
        }

    }
);

const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
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