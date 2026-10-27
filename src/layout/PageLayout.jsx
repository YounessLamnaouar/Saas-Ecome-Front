import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Shared layout for every page except Home (Home has its own Hero+Navbar setup)
export default function PageLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
