"use client";

import { useEffect, useRef, useState } from "react";
import { Users, BookOpen, Star, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  {
    label: "Active Mentors",
    value: 1250,
    suffix: "+",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Lessons Delivered",
    value: 45000,
    suffix: "+",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Success Stories",
    value: 12000,
    suffix: "+",
    icon: Star,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "Countries Represented",
    value: 85,
    suffix: "",
    icon: Globe,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

const PlatformStats = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll(".stat-item");
      
      gsap.fromTo(
        elements,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );

      // Counter animation logic
      elements.forEach((el) => {
        const target = el.querySelector(".counter");
        if (target) {
          const val = parseInt(target.getAttribute("data-value") || "0");
          const obj = { count: 0 };
          
          gsap.to(obj, {
            count: val,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
            onUpdate: () => {
              target.textContent = Math.floor(obj.count).toLocaleString();
            },
          });
        }
      });
    }
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div 
          ref={containerRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="stat-item flex flex-col items-center text-center group"
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[2rem] ${stat.bg} ${stat.color} transition-all duration-500 group-hover:rounded-2xl group-hover:rotate-12`}>
                <stat.icon size={28} />
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">
                <span className="counter" data-value={stat.value}>0</span>
                <span className="text-emerald-600">{stat.suffix}</span>
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
