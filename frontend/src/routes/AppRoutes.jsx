import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/public/Home/Home';
import About from '../pages/public/About/About';
import Contact from '../pages/public/Contact/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ReserveStalls from '../pages/ReserveStalls';
import Edit from '../pages/Edit';
import Genres from '../pages/genres';
import Profile from '../pages/Profile';
import EditReservation from '../pages/EditReservation';
import StallMapViewer from '../pages/StallMapViewer';
// import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
// import EmployeeEvents from '../pages/employee/EmployeeEvents';
// import EmployeeReservations from '../pages/employee/EmployeeReservations';
// import EmployeeStallsPage from '../pages/employee/EmployeeStallsPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reserve-stalls" element={<ReserveStalls />} />
            <Route path="/reserve-stalls/:eventId" element={<ReserveStalls />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/me" element={<Profile />} />
            <Route path="/employee" element={<Edit />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/employee/stalls" element={<Edit />} />
            <Route path="/edit-reservation/:id" element={<EditReservation />} />
            <Route path="/stall-map/:eventId" element={<StallMapViewer />} />

            {/* <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/events" element={<EmployeeEvents />} />
            <Route path="/employee/reservations" element={<EmployeeReservations />} />
            <Route path="/employee/stalls" element={<EmployeeStallsPage />} /> */}

            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
