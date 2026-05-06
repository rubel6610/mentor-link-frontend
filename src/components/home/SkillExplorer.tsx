"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { LayoutGrid, ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Category = { id: number; name: string; icon?: string | null };

const SkillExplorer = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  useEffect(() => {
    fetch(`${baseUrl}/tutors/categories`)
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result.data)) {
          setCategories(result.data.slice(0, 8)); // Show top 8
        }
      })
      .catch(() => {});
  }, [baseUrl]);

  useEffect(() => {
    if (categories.length > 0 && cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".skill-card");
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [categories]);

  return (
    <section id="skills" ref={sectionRef} className="bg-slate-50 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <LayoutGrid size={12} /> Explore Skills
            </div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Master any skill with <span className="text-indigo-600">expert-led</span> mentoring
            </h2>
            <p className="mt-4 text-slate-500">
              Choose from hundreds of specialized categories. Whether you're starting a new career or leveling up, we have the right mentor for you.
            </p>
          </div>
          <Link
            href="/tutors"
            className="group inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tutors?category=${cat.id}`}
                className="skill-card group relative overflow-hidden rounded-3xl border border-white bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50"
              >
                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {cat.icon || <Sparkles size={24} className="text-indigo-600 group-hover:text-white" />}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Explore mentors
                  </p>
                </div>
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-indigo-50/50 group-hover:bg-indigo-100/50 transition-colors duration-300" />
              </Link>
            ))
          ) : (
            // Skeleton loader
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-3xl bg-slate-200" />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillExplorer;
