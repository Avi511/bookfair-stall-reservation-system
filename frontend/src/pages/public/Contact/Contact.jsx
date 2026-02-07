import React from "react";

const Contact = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Contact the organizers
        </p>
        <h1 className="mt-3 text-4xl font-bold">Let&apos;s plan your stall</h1>
        <p className="mt-4 text-lg text-slate-600">
          Need help with registration or stall reservations? Reach out to the
          Colombo International Bookfair organizing team.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Contact details</h2>
            <div className="mt-4 space-y-3 text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Email:</span>{" "}
                info@colombobookfair.lk
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span> +94
                11 234 5678
              </p>
              <p>
                <span className="font-semibold text-slate-900">Location:</span>{" "}
                BMICH, Colombo, Sri Lanka
              </p>
              <p>
                <span className="font-semibold text-slate-900">Hours:</span>{" "}
                9:00 AM – 6:00 PM (Mon–Fri)
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Quick tips</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>• Register your business before selecting stalls.</li>
              <li>• Reservations are limited to three stalls per business.</li>
              <li>• QR entry passes are sent via email after confirmation.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Send an inquiry</h2>
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-secondary focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-secondary focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Business name
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-secondary focus:outline-none"
                placeholder="Publishing house or vendor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                rows="4"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-secondary focus:outline-none"
                placeholder="Tell us how we can help"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-2.5 text-white font-semibold hover:brightness-110"
            >
              Submit inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
