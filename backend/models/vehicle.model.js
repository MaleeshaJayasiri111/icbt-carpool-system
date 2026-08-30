const {supabaseAdmin} = require("../config/supabase");

const createVehicle = async ({
                                 driverId,
                                 vehicleNumber,
                                 vehicleType,
                                 brand,
                                 model,
                                 color,
                                 seatCapacity,
    })=>{

    const {data,error}= await supabaseAdmin
    .from("vehicles")
    .insert(
        {
            driver_id:driverId,
            vehicle_number:vehicleNumber,
            vehicle_type:vehicleType,
            brand,
            model,
            color,
            seat_capacity:seatCapacity,
        }

    ).select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

const findVehiclesByDriver=async (driverId) => {
    const {data, error} = await supabaseAdmin
    .from("vehicles")
    .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }
    return data;

}

const findVehicleById = async (vehicleId) => {
    const {data, error} = await supabaseAdmin
    .from("vehicles")
    .select("*")
    .eq("id", vehicleId)
    .maybeSingle();
    if (error) {
        throw error;
    }
    return data;
};

const findVehicleByNumber = async (vehicleNumber) => {
    const { data, error } = await supabaseAdmin
        .from("vehicles")
        .select("*")
        .eq("vehicle_number", vehicleNumber)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
};

const updateVehicleById = async (vehicleId,updateData) => {
    const {data, error} = await supabaseAdmin
    .from("vehicles")
    .update(updateData)
    .eq("id", vehicleId)
    .select()
    .single();

    if (error) {
        throw error;
    }
    return data;
}
const deactivateVehicleById = async (vehicleId) => {
    const {data, error} = await supabaseAdmin
    .from("vehicles")
    .update({
        is_active:false,
        }
    ).eq("id", vehicleId)
        .select()
    .single();

    if (error) {
        throw error;
    }
    return data;

}

module.exports = {
    createVehicle,
    findVehicleById,
    findVehicleByNumber,
    findVehiclesByDriver,
    updateVehicleById,
    deactivateVehicleById,
}
