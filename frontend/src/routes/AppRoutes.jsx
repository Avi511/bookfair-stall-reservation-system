import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/public/Home/Home';
import About from '../pages/public/About/About';
import Contact from '../pages/public/Contact/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ReserveStalls from '../pages/ReserveStalls';
import Genres from '../pages/genres';
import Profile from '../pages/Profile';
import EditReservation from '../pages/EditReservation';
import StallMapViewer from '../pages/StallMapViewer';
import RequireRole from '../auth/RequireRole';
import EmployeeStallsPage from '../pages/employee/EmployeeStallsPage';
import EmployeeEventsPage from '../pages/employee/Events/EmployeeEventsPage';
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
            <Route
              path="/reserve-stalls"
              element={
                <RequireRole roles={["USER", "ROLE_USER"]} redirectTo="/">
                  <ReserveStalls />
                </RequireRole>
              }
            />
            <Route
              path="/reserve-stalls/:eventId"
              element={
                <RequireRole roles={["USER", "ROLE_USER"]} redirectTo="/">
                  <ReserveStalls />
                </RequireRole>
              }
            />
            <Route
              path="/genres"
              element={
                <RequireRole roles={["USER", "ROLE_USER"]} redirectTo="/">
                  <Genres />
                </RequireRole>
              }
            />
            <Route
              path="/me"
              element={
                <RequireRole roles={["USER", "ROLE_USER"]} redirectTo="/">
                  <Profile />
                </RequireRole>
              }
            />
            <Route
              path="/employee"
              element={
                <RequireRole roles={["EMPLOYEE", "ROLE_EMPLOYEE"]} redirectTo="/login">
                  <EmployeeStallsPage />
                </RequireRole>
              }
            />
            <Route
              path="/edit"
              element={
                <RequireRole roles={["EMPLOYEE", "ROLE_EMPLOYEE"]} redirectTo="/login">
                  <EmployeeStallsPage />
                </RequireRole>
              }
            />
            <Route
              path="/employee/stalls"
              element={
                <RequireRole roles={["EMPLOYEE", "ROLE_EMPLOYEE"]} redirectTo="/login">
                  <EmployeeStallsPage />
                </RequireRole>
              }
            />
            <Route
              path="/employee/events"
              element={
                <RequireRole roles={["EMPLOYEE", "ROLE_EMPLOYEE"]} redirectTo="/login">
                  <EmployeeEventsPage />
                </RequireRole>
              }
            />
            <Route
              path="/edit-reservation/:id"
              element={
                <RequireRole roles={["USER", "ROLE_USER"]} redirectTo="/">
                  <EditReservation />
                </RequireRole>
              }
            />
            <Route path="/stall-map" element={<StallMapViewer />} />
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
