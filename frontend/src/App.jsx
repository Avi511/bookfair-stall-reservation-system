import React from "react";
import Navbar from "./components/layout/Navbar";
import MessageBar from "./components/layout/MessageBar";
import { ownerMessages } from "./data/ownerMessages";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./routes/ScrollToTop";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop smooth />
      <MessageBar messages={ownerMessages} />
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
