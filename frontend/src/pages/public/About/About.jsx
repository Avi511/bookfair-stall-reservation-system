import React from "react";

const About = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          About ExpoHub
        </p>
        <h1 className="mt-3 text-4xl font-bold">
          A modern platform for multi-event stall reservations
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          ExpoHub is a multi-event stall reservation and exhibitor management
          platform built for trade fairs, expos, and book fairs. It helps
          organizers bring together local and international vendors under one
          roof while keeping reservations accurate and transparent.
        </p>
        <p className="mt-4 text-lg text-slate-600">
          This system modernizes the traditional stall booking process by
          introducing a reliable, fully digital workflow for vendors and
          organizers.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Our mission</h2>
          <p className="mt-3 text-slate-600">
            Our mission is to reduce paperwork and long queues during stall
            reservations while ensuring fair access for all registered
            publishers and vendors across Sri Lanka.
          </p>
          <p className="mt-3 text-slate-600">
            By digitizing reservations and confirmations, we aim to save time,
            improve accuracy, and enhance the overall experience of exhibitors
            and organizers.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Who it serves</h2>
          <p className="mt-3 text-slate-600">
            This platform is designed for event organizers, exhibitors,
            publishers, educational institutions, and vendors who wish to
            participate in exhibitions and trade fairs.
          </p>
          <p className="mt-3 text-slate-600">
            It also assists event organizers in managing stall allocations,
            exhibitor details, and exhibition logistics efficiently.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What we provide</h2>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>• Online exhibitor registration and secure authentication</li>
            <li>
              • Real-time stall availability with an interactive floor map
            </li>
            <li>• Automated booking confirmation and email notifications</li>
            <li>• QR-based entry passes for exhibitors</li>
            <li>
              • Admin dashboard for organizers to manage stalls and vendors
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Data & integrity</h2>
          <p className="mt-3 text-slate-600">
            To maintain fairness and transparency, each registered business is
            allowed to reserve a maximum of three stalls per event cycle.
          </p>
          <p className="mt-3 text-slate-600">
            All reservations are securely stored and verified, ensuring accurate
            records, preventing duplicate bookings, and supporting the smooth
            operation of exhibitions and trade fairs.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
