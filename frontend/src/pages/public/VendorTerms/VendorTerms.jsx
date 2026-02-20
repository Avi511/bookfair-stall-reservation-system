import React from "react";

const VendorTerms = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Header Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Legal & Compliance
        </p>
        <h1 className="mt-3 text-4xl font-bold">Vendor Terms & Conditions</h1>
        <p className="mt-5 text-lg text-slate-600">
          These comprehensive terms establish the legal framework governing
          vendor participation on the ExpoHub platform. By registering and using
          our services, you acknowledge accepting all provisions outlined
          herein.
        </p>
      </section>

      {/* Content Sections */}
      <section className="max-w-5xl mx-auto px-4 pb-16 space-y-6">
        {/* Section 1: Scope & Acceptance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            1. Scope & Acceptance
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            These Terms & Conditions establish the complete legal framework
            governing vendor participation on the ExpoHub platform. By creating
            an account, uploading information, or engaging with our services,
            you acknowledge that you have read, understood, and unconditionally
            agree to be bound by all provisions outlined herein. Non-compliance
            may result in account restrictions, suspension, or permanent
            termination at ExpoHub's sole discretion.
          </p>
        </div>

        {/* Section 2: Vendor Eligibility & Registration */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            2. Vendor Eligibility & Registration
          </h2>
          <div className="mt-4 space-y-3">
            <p className="text-slate-600">
              All prospective vendors must complete a comprehensive registration
              and verification process. By submitting registration information,
              you certify that all details are accurate, complete, and current.
              ExpoHub reserves the right to conduct background checks, license
              verification, and business credential validation at any stage of
              the vendor relationship.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Registration information must be accurate, complete, and kept
                  current at all times
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Business licenses, certifications, and credentials are subject
                  to verification and review
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Provision of false, misleading, or fraudulent information may
                  result in immediate account termination
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Stall Allocation & Booking */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            3. Stall Allocation & Booking
          </h2>
          <div className="mt-4 space-y-3">
            <p className="text-slate-600">
              Stall availability, allocation, and assignment are determined
              solely by ExpoHub based on event requirements, venue capacity,
              vendor eligibility, and platform policies. All reservations are
              provisional and subject to payment confirmation and final approval
              from ExpoHub management. No rights are conveyed until payment is
              received and confirmed in writing.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Stall allocations are subject to real-time availability and
                  event-specific requirements
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Full payment must be completed within the specified timeframe
                  to secure and confirm the reservation
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Transfer of stall rights to third parties requires prior
                  written approval from ExpoHub
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4: Payment & Financial Obligations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Payment & Financial Obligations
          </h2>
          <div className="mt-4 space-y-3">
            <p className="text-slate-600">
              All payments shall be processed through approved, secure payment
              channels only. Vendor invoices and booking confirmations
              explicitly detail refund eligibility, cancellation procedures,
              applicable timeframes, and associated terms. Payment plans and
              negotiated arrangements require written confirmation from ExpoHub
              management.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Secure payment gateways and approved methods are the sole
                  authorized payment channels
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Refund policies, terms, and conditions are explicitly
                  communicated at booking confirmation
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Failure to complete payment by the deadline may result in
                  automatic reservation cancellation
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 5: Operational Standards & Compliance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            5. Operational Standards & Compliance
          </h2>
          <div className="mt-4 space-y-3">
            <p className="text-slate-600">
              Vendors are entrusted with the responsibility of maintaining the
              highest standards of professional conduct, operational safety,
              regulatory compliance, and ethical behavior throughout their
              participation. All products, services, and business practices must
              comply with applicable local, state, and national laws.
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Professional, courteous, and ethical conduct toward customers
                  and ExpoHub staff is mandatory
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  All offerings must comply with applicable legal, regulatory,
                  and ethical requirements
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Vendors must maintain stall cleanliness, security, and
                  compliance with venue standards
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 6: Prohibited Conduct */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            6. Prohibited Conduct
          </h2>
          <div className="mt-4 space-y-3">
            <p className="text-slate-600 font-semibold">
              The following activities are strictly prohibited and may result in
              account suspension, termination, or legal action:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Sale, distribution, or exhibition of counterfeit, prohibited,
                  illegal, or harmful merchandise
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Unauthorized access, manipulation, or misuse of the ExpoHub
                  platform or systems
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Fraudulent misrepresentation of business credentials,
                  licenses, or offerings
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-slate-900 font-bold">•</span>
                <span>
                  Harassment, discrimination, or unethical conduct toward other
                  vendors or customers
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 7: Enforcement & Account Suspension */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            7. Enforcement & Account Suspension
          </h2>
          <p className="mt-4 text-slate-600">
            Suspected violations of these terms will trigger immediate
            investigation and corrective action. ExpoHub retains full discretion
            and authority to restrict access, suspend, or permanently terminate
            vendor accounts in cases of non-compliance, breach, or violations.
            Suspended vendors may be prohibited from future participation.
          </p>
        </div>

        {/* Section 8: Limitation of Liability */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            8. Limitation of Liability
          </h2>
          <p className="mt-4 text-slate-600">
            ExpoHub assumes no responsibility, liability, or obligation for
            disputes, losses, damages, injuries, or conflicts arising between
            vendors and customers, or between vendors and third parties. Each
            vendor operates as an independent business entity and bears full
            responsibility for their business operations, conduct, and legal
            compliance.
          </p>
        </div>

        {/* Section 9: Policy Amendments & Updates */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            9. Policy Amendments & Updates
          </h2>
          <p className="mt-4 text-slate-600">
            ExpoHub reserves the unrestricted right to modify, amend, or update
            these Terms & Conditions at any time without prior notice. Material
            changes will be communicated to vendors via email. Continued use of
            the platform following notification of changes constitutes
            acceptance of the revised terms.
          </p>
        </div>

        {/* Contact Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Contact & Support
          </h2>
          <div className="mt-4 space-y-3 text-slate-600">
            <p>
              For legal questions, policy clarifications, disputes, or formal
              inquiries, please contact our Legal & Compliance Department:
            </p>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-slate-900">Email:</span>{" "}
                legal@expohub.lk
              </p>
              <p>
                <span className="font-semibold text-slate-900">Support:</span>{" "}
                info@expohub.lk
              </p>
              <p>
                <span className="font-semibold text-slate-900">
                  Last Updated:
                </span>{" "}
                February 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorTerms;
