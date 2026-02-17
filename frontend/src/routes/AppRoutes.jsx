import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

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
import RequireAuth from '../auth/RequireAuth';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import EmployeeStallsPage from '../pages/employee/EmployeeStallsPage';
import EmployeeEventsPage from '../pages/employee/Events/EmployeeEventsPage';
import EmployeeReservations from '../pages/employee/EmployeeReservations';
import EmployeeGenresPage from '../pages/employee/EmployeeGenresPage';
import NotFound from '../pages/NotFound';

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
              path="/profile"
              element={
                <RequireRole roles={["USER", "ROLE_USER"]} redirectTo="/">
                  <Profile />
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

            {/* employee area - protected routes */}
            <Route
              path="/employee"
              element={
                <RequireAuth>
                  <RequireRole roles={["EMPLOYEE", "ROLE_EMPLOYEE"]} redirectTo="/login">
                    <Outlet />
                  </RequireRole>
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="stalls" element={<EmployeeStallsPage />} />
              <Route path="events" element={<EmployeeEventsPage />} />
              <Route path="reservations" element={<EmployeeReservations />} />
              <Route path="genres" element={<EmployeeGenresPage />} />
            </Route>

            {/* catch-all should show 404 now */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
