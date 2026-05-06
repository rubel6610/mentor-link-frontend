"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 py-20 text-white">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Sparkles className="mx-auto mb-4 h-10 w-10 opacity-80" />
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to start your learning journey?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
          Join thousands of students already mastering new skills with
          MentorLink tutors.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-white px-8 py-3 font-semibold text-emerald-700 hover:scale-105 transition hover:shadow-xl"
          >
            Create Free Account
          </Link>
          <Link
            href="/tutors"
            className="rounded-xl border-2 border-white/80 px-8 py-3 font-semibold text-white hover:bg-white/10 transition"
          >
            Browse Tutors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
