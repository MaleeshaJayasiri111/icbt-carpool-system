import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import DriverLayout from "./layouts/DriverLayout";
import PassengerLayout from "./layouts/PassengerLayout";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import DriverDashboard from "./pages/driverComponents/DriverDashboard";
import Vehicles from "./pages/driverComponents/Vehicles";
import CreateRide from "./pages/driverComponents/CreateRide";
import MyRides from "./pages/driverComponents/MyRides";
import RidePassengers from "./pages/driverComponents/RidePassengers";
import JoinRequests from "./pages/driverComponents/JoinRequests";
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import PassengerDashboard from "./pages/passengerComponenets/PassengerDashboard";
import FindRides from "./pages/passengerComponenets/FindRides";
import PassengerMyRides from "./pages/passengerComponenets/PassengerMyRides";
import RideHistory from "./pages/passengerComponenets/RideHistory";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
      <BrowserRouter>
        <Routes>

          {/* PUBLIC WEBSITE */}
          <Route element={<PublicLayout />}>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/about"
                element={<About />}
            />
            <Route
                path="/contact"
                element={<Contact />}
            />

            <Route
                path="/help"
                element={<Help />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* ADMIN PROTECTED AREA */}
            <Route element={<AdminProtectedRoute />}>
              <Route
                  path="/admin"
                  element={<AdminDashboard />}
              />
            </Route>

          </Route>


          {/* DRIVER AREA */}
          <Route
              path="/driver"
              element={<DriverLayout />}
          >

            <Route
                path="dashboard"
                element={<DriverDashboard />}
            />

            <Route
                path="vehicles"
                element={<Vehicles />}
            />
            <Route
                path="rides/create"
                element={<CreateRide />}
            />
            <Route
                path="rides"
                element={<MyRides />}
            />

            <Route
                path="rides/:rideId/passengers"
                element={<RidePassengers />}
            />

            <Route
                path="requests"
                element={<JoinRequests />}
            />

          </Route>

          <Route
              path="/passenger"
              element={<PassengerLayout />}
          >
            <Route
                path="dashboard"
                element={<PassengerDashboard />}
            />
            <Route
                path="find-rides"
                element={<FindRides />}
            />
            <Route
                path="my-rides"
                element={<PassengerMyRides />}
            />
            <Route
                path="history"
                element={<RideHistory />}
            />
          </Route>

        </Routes>
      </BrowserRouter>
  );
}

export default App;