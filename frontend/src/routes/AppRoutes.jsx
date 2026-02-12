import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/public/Home/Home';
import About from '../pages/public/About/About';
import Contact from '../pages/public/Contact/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Optional: 404 fallback */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
