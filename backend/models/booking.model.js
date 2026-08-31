const { supabaseAdmin } =
    require("../config/supabase");


const createBooking = async ({
                                 rideId,
                                 passengerId,
                             }) => {

    const { data, error } = await supabaseAdmin
        .from("ride_bookings")
        .insert({
            ride_id: rideId,
            passenger_id: passengerId,
            status: "requested",
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


const findBookingById = async (bookingId) => {

    const { data, error } = await supabaseAdmin
        .from("ride_bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};


const findBookingByRideAndPassenger = async (
    rideId,
    passengerId
) => {

    const { data, error } = await supabaseAdmin
        .from("ride_bookings")
        .select("*")
        .eq("ride_id", rideId)
        .eq("passenger_id", passengerId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};


const updateBookingStatus = async (
    bookingId,
    status
) => {

    const { data, error } = await supabaseAdmin
        .from("ride_bookings")
        .update({
            status,
        })
        .eq("id", bookingId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};


const findBookingsByPassenger = async (
    passengerId
) => {

    const { data, error } =
        await supabaseAdmin
            .from("ride_bookings")
            .select(`
                *,

                payments (
                    id,
                    amount,
                    payment_status,
                    refunded_at,
                    paid_at
                ),

                rides (
                    *,
                    vehicles (
                        id,
                        vehicle_number,
                        vehicle_type,
                        brand,
                        model,
                        color
                    )
                )
            `)
            .eq(
                "passenger_id",
                passengerId
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            );

    if (error) {
        throw error;
    }

    return data || [];
};

const findConfirmedPassengerByRide= async (
    rideId
)=>{
    const {data,error} = await supabaseAdmin
        .from("ride_bookings")
        .select(`
            id,
            status,
            created_at,
            users (
                id,
                full_name,
                email,
                phone,
                user_profile
            )
        `)
        .eq("ride_id",rideId)
        .eq("status","confirmed");
    if (error) {
        throw error;
    }
    return data || [];
}

const findBookingRequestsByDriver = async (driverId) => {

    const { data, error } = await supabaseAdmin
        .from("ride_bookings")
        .select(`
            id,
            ride_id,
            passenger_id,
            status,
            created_at,

            users (
                id,
                full_name,
                email,
                phone,
                user_profile
            ),

            rides!inner (
                id,
                driver_id,
                start_location,
                destination,
                ride_date,
                departure_time,
                fee_per_seat
            )
        `)
        .eq("rides.driver_id", driverId)
        .in("status", [
            "requested",
            "payment_pending"
        ])
        .order("created_at", {
            ascending: false
        });

    if (error) {
        throw error;
    }

    return data || [];
};
const findActiveBookingsByRide = async (rideId)=>{
    const {data, error}= await supabaseAdmin
        .from("ride_bookings")
        .select("*")
        .eq("ride_id", rideId)
        .in(
            "status",
            [
                "requested",
                "payment_pending",
                "confirmed",
            ]
        );

    if (error) {
        throw error;
    }


    return data || [];
}

const cancelBookingByRide = async (rideId)=>{
    const { data, error } =
        await supabaseAdmin
            .from("ride_bookings")
            .update({
                status: "cancelled",
            })
            .eq(
                "ride_id",
                rideId
            )
            .in(
                "status",
                [
                    "requested",
                    "payment_pending",
                    "confirmed",
                ]
            )
            .select();


    if (error) {
        throw error;
    }


    return data || [];
}

const findConfirmedBookingByRideAndPassenger =
    async (
        rideId,
        passengerId
    ) => {

        const { data, error } =
            await supabaseAdmin
                .from("ride_bookings")
                .select("*")
                .eq(
                    "ride_id",
                    rideId
                )
                .eq(
                    "passenger_id",
                    passengerId
                )
                .eq(
                    "status",
                    "confirmed"
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        return data;
    };

module.exports = {
    createBooking,
    findBookingById,
    findBookingByRideAndPassenger,
    updateBookingStatus,
    findBookingsByPassenger,
    findConfirmedPassengerByRide,
    findBookingRequestsByDriver,

    findActiveBookingsByRide,
    cancelBookingByRide,
    findConfirmedBookingByRideAndPassenger,
};