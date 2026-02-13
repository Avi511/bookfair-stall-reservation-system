import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const isLoggedIn =
    Boolean(localStorage.getItem("token")) ||
    Boolean(localStorage.getItem("accessToken"));

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-white to-accent/10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Colombo International Bookfair 2026
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900">
              Reserve your stall in Sri Lanka&apos;s largest book exhibition
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              A modern reservation platform for publishers and vendors to book
              stalls, manage confirmations, and receive QR-based entry passes
              for the exhibition.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-secondary px-6 py-3 text-white font-semibold shadow-sm hover:brightness-110"
                >
                  Get started
                </Link>
              )}
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-slate-700 font-semibold hover:border-slate-400"
              >
                Learn more
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <p className="text-2xl font-bold text-slate-900">3</p>
                <p>Maximum stalls per business</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">A-Z</p>
                <p>Alphabetical stall naming</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-slate-200 p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              What you can do
            </h2>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                Register your business and reserve stalls online.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                View a venue map with real-time availability.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                Receive confirmation email with QR entry pass.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                Add literary genres to personalize your profile.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Stall categories",
              description:
                "Choose from small, medium, and large stalls based on your display needs.",
            },
            {
              title: "Smart confirmations",
              description:
                "Pop-up confirmation and automated email notifications keep your team updated.",
            },
            {
              title: "Organizer portal",
              description:
                "Authorized staff can review availability, reservations, and daily updates.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-3 text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Reserve a stall in four simple steps
              </h2>
              <p className="mt-3 text-slate-600">
                Built to reduce manual handling and ensure every reservation is
                verified, confirmed, and ready for the exhibition day.
              </p>
            </div>
            <div className="flex-1 grid gap-4">
              {[
                {
                  step: "1",
                  title: "Register your business",
                  text: "Create an account and submit business details for verification.",
                },
                {
                  step: "2",
                  title: "Select stall(s)",
                  text: "Pick up to three available stalls from the venue map.",
                },
                {
                  step: "3",
                  title: "Confirm reservation",
                  text: "Review the summary and confirm via the pop-up dialog.",
                },
                {
                  step: "4",
                  title: "Receive QR pass",
                  text: "Get an email confirmation with QR entry pass for download.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Stall sizes
            </h2>
            <p className="mt-2 text-slate-600">
              Each stall is named alphabetically and grouped by size and
              dimensions.
            </p>
            <div className="mt-6 space-y-4">
              {(() => {
                const stalls = [
                  {
                    label: "Small",
                    details:
                      "Ideal for single-title publishers or compact displays.",
                  },
                  {
                    label: "Medium",
                    details:
                      "Perfect for multi-title showcases and promotions.",
                  },
                  {
                    label: "Large",
                    details:
                      "Best for larger publishers with interactive experiences.",
                  },
                ];
                return stalls.map((stall) => (
                  <div
                    key={stall.label}
                    className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {stall.label}
                      </p>
                      <p className="text-sm text-slate-600">{stall.details}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Available
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Venue map preview
            </h2>
            <p className="mt-2 text-slate-600">
              The reservation page displays an interactive map showing available
              and reserved stalls.
            </p>
            <div className="mt-6 grid grid-cols-6 gap-3">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-10 rounded-lg text-xs font-semibold flex items-center justify-center ${
                    index % 7 === 0
                      ? "bg-slate-300 text-slate-500"
                      : "bg-accent/20 text-accent"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Gray stalls represent reserved units. Green stalls are available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
