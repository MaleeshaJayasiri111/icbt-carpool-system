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

const refundPaymentByBookingId = async (bookingId) => {
    const {data,error}= await supabaseAdmin
        .from("payments")
        .update({
            payment_status:"refunded",
            refunded_at: new Date().toISOString(),
        })
        .eq("booking_id", bookingId)
        .eq(
            "payment_status",
            "successful"
        )
        .select()
        .single();

    if(error) throw error;
    return data;
}



module.exports = {
    createPayment,
    refundPaymentByBookingId,

};