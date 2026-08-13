const { supabaseAdmin } =
    require("../config/supabase");


const createRide = async ({
                              driverId,
                              vehicleId,

                              startLocation,
                              startLatitude,
                              startLongitude,

                              destination,
                              destinationLatitude,
                              destinationLongitude,

                              rideDate,
                              departureTime,

                              totalSeats,
                              feePerSeat,
                          }) => {

    const { data, error } =
        await supabaseAdmin
            .from("rides")
            .insert({
                driver_id: driverId,
                vehicle_id: vehicleId,

                start_location: startLocation,
                start_latitude: startLatitude,
                start_longitude: startLongitude,

                destination,
                destination_latitude:
                destinationLatitude,
                destination_longitude:
                destinationLongitude,

                ride_date: rideDate,
                departure_time: departureTime,

                total_seats: totalSeats,
                available_seats: totalSeats,

                fee_per_seat: feePerSeat,

                status: "available",
            })
            .select()
            .single();

    if (error) {
        throw error;
    }

    return data;
};


const findRidesByDriver = async (
    driverId
) => {
    const { data, error } =
        await supabaseAdmin
            .from("rides")
            .select(`
        *,
        vehicles (
          id,
          vehicle_number,
          vehicle_type,
          brand,
          model,
          color,
          seat_capacity
        )
      `)
            .eq("driver_id", driverId)
            .order("ride_date", {
                ascending: true,
            });

    if (error) {
        throw error;
    }

    return data || [];
};


const findRideById = async (rideId) => {
    const { data, error } =
        await supabaseAdmin
            .from("rides")
            .select(`
        *,
        vehicles (
          id,
          vehicle_number,
          vehicle_type,
          brand,
          model,
          color,
          seat_capacity
        )
      `)
            .eq("id", rideId)
            .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

const updateRideById = async (rideId,updateData) => {
    const {data,error} = await supabaseAdmin
    .from("rides")
    .update(updateData)
    .eq("id", rideId)
        .select()
    .single();
    if (error) {
        throw error;
    }
    return data;
}

const updateRideStatus = async (rideId,status) => {
    const {data, error} = await supabaseAdmin
    .from("rides")
    .update({
        status,
    })
    .eq("id", rideId)
    .select()
    .single();
    if (error) {
        throw error;
    }
    return data;
}

const findAvailableRides = async ({
    startLocation,
    destination,
    rideDate,
 }) => {

    let query = supabaseAdmin
        .from("rides")
        .select(`
            *,
            vehicles (
                id,
                vehicle_number,
                vehicle_type,
                brand,
                model,
                color,
                seat_capacity
            )
        `)
        .eq("status", "available")
        .gt("available_seats", 0);

    if (startLocation) {
        query = query.ilike(
            "start_location",
            `%${startLocation}%`
        );
    }


    if (destination) {
        query = query.ilike(
            "destination",
            `%${destination}%`
        );
    }


    if (rideDate) {
        query = query.eq(
            "ride_date",
            rideDate
        );
    }

    const { data, error } = await query
        .order("ride_date", {
            ascending: true,
        })
        .order("departure_time", {
            ascending: true,
        });


    if (error) {
        throw error;
    }

    return data || [];
};

const updateRideSeats = async (
    rideId,
    availableSeats,
    status,
)=>{
    const {data,error} = await supabaseAdmin
    .from("rides")
    .update({
         available_seats:availableSeats,
         status,
    })
    .eq("id", rideId)
        .select()
    .single();

    if(error){
        throw error;
    }
    return data;
}

module.exports = {
    createRide,
    findRidesByDriver,
    findRideById,
    updateRideById,
    updateRideStatus,
    findAvailableRides,
    updateRideSeats,
};