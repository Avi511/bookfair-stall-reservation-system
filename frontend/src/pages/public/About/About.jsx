import React from "react";

const About = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          About Colombo International Bookfair
        </p>
        <h1 className="mt-3 text-4xl font-bold">
          Empowering publishers and vendors
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          Organized by the Sri Lanka Book Publishers’ Association, the Colombo
          International Bookfair is the largest annual book exhibition in Sri
          Lanka. Our reservation management system is designed to make stall
          booking transparent, efficient, and accessible for every publisher and
          vendor.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Our mission</h2>
          <p className="mt-3 text-slate-600">
            Reduce manual reservation work, give vendors clarity on
            availability, and ensure every booking is confirmed with a QR-based
            entry pass.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Who it serves</h2>
          <p className="mt-3 text-slate-600">
            Book publishers, authors, and vendors who want to reserve stalls and
            showcase their titles to thousands of visitors during the
            exhibition.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What we provide</h2>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>• Online registration and secure login</li>
            <li>• Interactive map with stall availability</li>
            <li>• Confirmation emails with QR entry passes</li>
            <li>• Organizer portal for availability management</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Data & integrity</h2>
          <p className="mt-3 text-slate-600">
            Each business can reserve up to three stalls. Reservations are
            verified and recorded to keep allocations fair and transparent.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
