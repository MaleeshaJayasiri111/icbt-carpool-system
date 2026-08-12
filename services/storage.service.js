const path = require("path");
const { supabaseAdmin } = require("../config/supabase");

const PROFILE_BUCKET = "profile-images";

const uploadProfileImage = async (userId, file) => {
    if (!file) {
        return null;
    }

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    const safeExtension = extension || ".jpg";

    const filePath =
        `${userId}/profile-${Date.now()}${safeExtension}`;

    const { error: uploadError } = await supabaseAdmin.storage
        .from(PROFILE_BUCKET)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabaseAdmin.storage
        .from(PROFILE_BUCKET)
        .getPublicUrl(filePath);

    console.log("Generated public URL:", data.publicUrl);

    return {
        publicUrl: data.publicUrl,
        filePath,
    };
};

const deleteProfileImage = async (filePath) => {
    if (!filePath) {
        return;
    }

    const { error } = await supabaseAdmin.storage
        .from(PROFILE_BUCKET)
        .remove([filePath]);

    if (error) {
        throw error;
    }
};

module.exports = {
    uploadProfileImage,
    deleteProfileImage,
};