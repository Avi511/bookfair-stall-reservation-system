import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/public/Home/Home';
import About from '../pages/public/About/About';
import Contact from '../pages/public/Contact/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ReserveStalls from '../pages/ReserveStalls';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reserve-stalls" element={<ReserveStalls />} />

            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
