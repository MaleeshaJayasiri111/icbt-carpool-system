const { supabaseAdmin } =
    require("../config/supabase");


const createPayment = async ({
                                 bookingId,
                                 passengerId,
                                 amount,
                                 paymentStatus,
                             }) => {

    const { data, error } = await supabaseAdmin
        .from("payments")
        .insert({
            booking_id: bookingId,
            passenger_id: passengerId,
            amount,
            payment_method: "dummy",
            payment_status: paymentStatus,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


module.exports = {
    createPayment,
};