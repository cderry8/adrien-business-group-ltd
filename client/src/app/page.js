"use client";

import { motion } from "framer-motion";

import Navbar from "@/components/layout/navbar";
import HeroVideo from "@/components/layout/hero";
import HeroContent from "@/components/section/herocontent";
import ProjectsVideoGrid from "@/components/section/projectvideo";
import FeaturedProjects from "@/components/section/featuredprojects";
import RecentNews from "@/components/section/recentnews";
import Footer from "@/components/section/footer";

/* ------------------ ANIMATION ------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const AnimatedSection = ({ children }) => (
  <motion.section
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.25 }}
  >
    {children}
  </motion.section>
);

/* ------------------ PAGE ------------------ */

export default function Home() {
  return (
    <div className="relative pb-20 w-full">
      {/* NO animation */}
      <Navbar />
      <HeroVideo />
      <HeroContent />

      {/* Animated sections only */}
      <AnimatedSection>
        <ProjectsVideoGrid />
      </AnimatedSection>

      <AnimatedSection>
        <FeaturedProjects />
      </AnimatedSection>

      <AnimatedSection>
        <RecentNews />
      </AnimatedSection>

    
      <Footer />
    </div>
  );
}
