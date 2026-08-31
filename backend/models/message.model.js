const {supabaseAdmin} = require('../config/supabase');

//create message
const createMessage= async ({
    rideId,
    senderId,
    message,
})=>{
    const {data,error} = await supabaseAdmin
        .from("ride_messages")
        .insert({
            ride_id: rideId,
            sender_id: senderId,
            message,
        })
        .select(`
                *,
                users (
                    id,
                    full_name,
                    role,
                    user_profile
                )
            `)
        .single();

    if(error) throw error;
    return data;
}

const findMessagesByRide = async (rideId)=>{
    const { data, error } =
        await supabaseAdmin
            .from("ride_messages")
            .select(`
                *,
                users (
                    id,
                    full_name,
                    role,
                    user_profile
                )
            `)
            .eq(
                "ride_id",
                rideId
            )
            .order(
                "created_at",
                {
                    ascending: true,
                }
            );

    if (error) {
        throw error;
    }

    return data || [];
}

module.exports={
    createMessage,
    findMessagesByRide
}