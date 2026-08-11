"use client";

import Link from "next/link";

const PLANS = [
  {
    name: "Essential Care",
    price: "₹24,999",
    period: "per month",
    description: "Ideal for regional specialty clinics and single-campus hospitals.",
    features: [
      "Admissions & Ward Bed Tracking",
      "Up to 50 Bed Capacity",
      "Standard Patient Flow Analytics",
      "Email & In-App Alerts",
      "Standard Support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Enterprise Clinical",
    price: "₹59,999",
    period: "per month",
    description: "Built for multi-specialty hospitals requiring full OT & CSSD automation.",
    features: [
      "Complete Admissions & Ward Flow",
      "Operating Theatre (OT) Scheduling",
      "CSSD Instrument Pack Sterilization",
      "AI Clinical Assistant Integration",
      "Unlimited Bed Capacity",
      "24/7 Priority Emergency Support",
    ],
    cta: "Request Demo",
    popular: true,
  },
  {
    name: "Hospital Network",
    price: "Custom",
    period: "tailored pricing",
    description: "For multi-hospital networks, health systems, and government facilities.",
    features: [
      "Multi-Campus Central Command Center",
      "Custom EHR & HMS Data Integrations",
      "Dedicated Clinical AI Model Training",
      "Enterprise SLA & On-Premise Options",
      "Dedicated Account Manager",
    ],
    cta: "Contact Enterprise Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#071B34] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            TRANSPARENT PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Plans Tailored to Hospital Scale
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Scale your healthcare operations seamlessly with enterprise pricing options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-3xl flex flex-col justify-between transition-all transform hover:-translate-y-1.5 relative ${
                plan.popular
                  ? "bg-gradient-to-b from-[#0B2545] to-[#0F325C] border-2 border-cyan-400 shadow-[0_0_35px_rgba(24,216,232,0.25)]"
                  : "bg-[#0B2545] border border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular for Hospitals
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">{plan.description}</p>
                <div className="flex items-baseline space-x-2 mb-6 pb-6 border-b border-white/10">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center space-x-3 text-xs text-slate-200">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/signup"
                className={`w-full py-3.5 rounded-xl text-center text-sm font-semibold transition-all shadow-md ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
