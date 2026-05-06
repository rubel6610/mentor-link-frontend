"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedTutors, { TutorProfile } from "@/components/home/FeaturedTutors";
import WhyMentorLink from "@/components/home/WhyMentorLink";
import CTASection from "@/components/home/CTASection";
import PlatformStats from "@/components/home/PlatformStats";
import SkillExplorer from "@/components/home/SkillExplorer";

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/tutors`, { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data && Array.isArray(result.data)) {
          // Filter out banned tutors and slice to first 6
          const activeTutors = result.data
            .filter((t: any) => !t.user?.isBanned)
            .slice(0, 6);
          setFeaturedTutors(activeTutors);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [baseUrl]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <PlatformStats />
      <HowItWorks />
      <SkillExplorer />
      <FeaturedTutors tutors={featuredTutors} isLoading={isLoading} />
      <WhyMentorLink />
      <CTASection />
    </div>
  );
}
