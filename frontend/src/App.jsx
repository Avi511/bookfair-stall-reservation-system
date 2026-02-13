import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import MessageBar from "./components/layout/MessageBar";
import { ownerMessages } from "./data/ownerMessages";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./routes/ScrollToTop";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop smooth />
        <MessageBar messages={ownerMessages} />
        <Navbar />
        <Toaster position="top-right" />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
