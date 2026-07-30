"use client";

import { Star, Quote, MessageCircle } from "lucide-react";

export default function Testimonials() {
  const list = [
    {
      name: "Tariqul Islam",
      role: "Tenant in Gulshan",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      stars: 5,
      comment: "Renting via RentNest was incredibly easy. I found my apartment in Gulshan, submitted a request, got approval within hours, and paid the booking fee directly with Stripe. Highly recommended!",
    },
    {
      name: "Nusrat Jahan",
      role: "Landlord in Banani",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      stars: 5,
      comment: "As a landlord, managing listings and verifying tenants was always a hassle. RentNest completely solved this. The requests dashboard gives me full control over approvals, and rent collection is automated.",
    },
    {
      name: "Farhan Ahmed",
      role: "Tenant in Dhanmondi",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      stars: 4,
      comment: "Wonderful support and user experience. The property categorization, maps, and amenity filters saved me days of visiting places physically. The listings are verified, so I felt extremely safe.",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full">
            Reviews
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Loved by Landlords <br />
            and Tenants <span className="text-primary">alike</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            See what our verified customers say about their digital rental journey with RentNest.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-8 w-12 h-12 text-slate-200/50 group-hover:text-primary/10 transition-colors duration-300 shrink-0" />

              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className={`w-4 h-4 ${
                        sIdx < item.stars ? "text-orange-400 fill-orange-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-slate-500 text-sm font-medium leading-relaxed italic mb-8 relative z-10">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              {/* User details */}
              <div className="flex items-center gap-3.5 border-t border-slate-100 pt-5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
