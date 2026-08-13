const {supabaseAdmin, supabase} =  require("../config/supabase");

/**
 * Create a profile in public.users.
 */
const createUserProfile = async ({
    id,
     fullName,
     email,
     phone = null,
     role,
     userProfile,
    })=>{

    const {data,error} = await supabaseAdmin
        .from("users")
        .insert({
            id,
            full_name: fullName,
            email,
            phone,
            role,
            user_profile:userProfile,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Find a user profile by Supabase Auth ID.
 */
const findUserById = async (userId) => {


    const { data, error } = await supabaseAdmin
        .from("users")
        .select(
            "*"
        )
        .eq("id", userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

/**
 * Find a user profile by email.
 */
const findUserByEmail = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();

    console.log("Searching custom users table for:", normalizedEmail);

    const { data, error } = await supabaseAdmin
        .from("users")
        .select(
            "*"
        )
        .eq("email", normalizedEmail)
        .maybeSingle();

    console.log("Found profile:", data);
    console.log("Query error:", error);

    if (error) {
        throw error;
    }

    return data;
};

const findAllUsers= async ()=>{
    const {data, error} = await supabase
    .from("users")
    .select("*")
    .in("role", ["driver", "passenger"])
        .order("created_at",{ascending:false});

    if (error) {
        throw error;
    }

    return data ?? [];
}

/**
 * Update a user's own profile.
 */
const updateUserProfile = async (
    userId,
    { fullName, phone }
) => {
    const updateData = {
        updated_at: new Date().toISOString(),
    };

    if (fullName !== undefined) {
        updateData.full_name = fullName;
    }

    if (phone !== undefined) {
        updateData.phone = phone;
    }

    const { data, error } = await supabaseAdmin
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select(
            "id, full_name, email, phone, role, created_at, updated_at,user_profile"
        )
        .single();

    if (error) {
        throw error;
    }

    return data;
};

const findUserByRole= async (role)=>{

    console.log("Role received by model:", role);
    console.log("Role type:", typeof role);
    console.log("Role JSON:", JSON.stringify(role));

    const {data, error} = await supabaseAdmin
    .from("users")
    .select("*")
        .eq("role", role)
        .order("created_at",{ascending:false});

    if (error) {
        throw error;
    }

    return data;
}

module.exports = {
    createUserProfile,
    findUserById,
    findUserByEmail,
    findAllUsers,
    updateUserProfile,
    findUserByRole,
};