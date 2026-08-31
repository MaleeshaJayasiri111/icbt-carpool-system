const {supabaseAdmin} = require("../config/supabase");

//get Fare rate by vehicle
const findFareRateByVehicleType =async (
    vehicleType
)=>{
    const {data,error}= await supabaseAdmin
        .from("vehicle_fare_rates")
        .select("*")
        .eq("vehicle_type",vehicleType)
        .maybeSingle();

    if (error) {
        throw error;
    }


    return data;
}

module.exports = {
    findFareRateByVehicleType,
}