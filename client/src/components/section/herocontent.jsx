"use client"
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function HeroContent() {
  return (
    <motion.section
      className="w-full bg-white py-24 md:py-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* LEFT COLUMN */}
          <motion.div
            className="flex flex-col justify-center"
            variants={fadeLeft}
          >
            <p className="max-w-md text-lg leading-relaxed tracking-wide text-gray-900 mb-6">
              11 years, we have been designing unique structures for better cities
              and a more aesthetic life around our Country.
            </p>
            <p className="max-w-md text-lg leading-relaxed tracking-wide text-gray-900">
              We design original and unique structures in every field, from house
              design, the smallest building unit, to floating parks, vertical
              farms for sustainable living, hospitals, offices, factories, museums,
              and art centers reflecting the collective spirit of social life. Every
              detail is meticulously considered to create lasting, thoughtful designs.
            </p>
          </motion.div>

          {/* RIGHT COLUMN */}
          <motion.div
            className="flex flex-col justify-center"
            variants={fadeRight}
          >
            <p className="max-w-xl text-lg leading-relaxed tracking-wide text-gray-900">
              While we renovate old buildings for a sustainable future, we also
              design new structures in empty spaces. Renovation and new construction
              are both part of our workflow, blending history with modern vision.
            </p>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
