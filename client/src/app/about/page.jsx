"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/section/footer";
import {
  FaBuilding,
  FaCogs,
  FaRecycle,
  FaUserTie,
} from "react-icons/fa";

/* ------------------ ANIMATION VARIANTS ------------------ */

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/* ------------------ COMPONENT ------------------ */

const About = () => {
  const services = [
    {
      title: "DESIGN OF NEW BUILDING",
      icon: FaBuilding,
      description:
        "We are designing buildings from scratch for our clients on new empty plots, in line with the needs programs they will recommend.",
      extra:
        "We also design the interiors of the projects we design with a modern understanding.",
    },
    {
      title: "ENGINEERING",
      icon: FaCogs,
      description:
        "We design the structural, mechanical, and electrical projects of the projects we design with our engineers.",
      extra:
        "We design our buildings with sustainable engineering and low carbon solutions.",
    },
    {
      title: "RENOVATION & ADAPTIVE REUSE",
      icon: FaRecycle,
      description:
        "Instead of demolishing existing structures, we preserve the column and floor structure.",
      extra:
        "We re-functionalize buildings with new plans according to today's needs.",
    },
    {
      title: "CONSULTING & SUPERVISION",
      icon: FaUserTie,
      description:
        "We review projects drawn by other architects and prepare detailed reports.",
      extra:
        "We supervise projects to ensure correct construction.",
    },
  ];

  return (
    <div className="bg-white">
      <Navbar />

      {/* SERVICES */}
      <motion.div
        className="min-h-screen pt-[150px] px-4"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="bg-black/20 backdrop-blur-md text-[#7a7a7a] p-8 rounded-lg flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6" />
                  <h2 className="ml-2 font-bold text-lg">{service.title}</h2>
                </div>

                <p>{service.description}</p>
                <p className="mt-4">{service.extra}</p>

               
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ABOUT TEXT + STATS */}
      <motion.section
        className="py-16 px-6 text-center"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={fadeUp} className="text-4xl text-black font-bold mb-6">
          WALL Corporation
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto"
        >
          Kigali and Nairobi based architecture office WALL Corporation was founded
          by architect Selim Senin in 2010. WALL continues to work on various projects
          across Africa and beyond, receiving more than 91 international awards.
        </motion.p>

        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            ["37", "Different Types of Project Design"],
            ["150+", "Projects"],
            ["17", "Countries & 36 Cities"],
            ["91", "International Design Awards"],
          ].map(([num, label], i) => (
            <motion.div key={i} variants={scaleIn} className="bg-white p-6">
              <p className="text-4xl text-black font-bold">{num}</p>
              <p className="text-lg text-gray-600">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* FOUNDER */}
      <motion.section
        className="bg-white py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <motion.div variants={fadeLeft}>
            <Image
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
              alt="Founder"
              width={500}
              height={400}
            />
          </motion.div>

          <motion.div variants={fadeRight}>
            <p className="uppercase tracking-[0.3em] text-black text-sm mb-8">Founder</p>
            <p className="text-gray-700 mb-8">
              Selim Senin graduated in 2010 from Yildiz Technical University and
              holds a master’s degree in Architecture History.
            </p>
            <p className="text-gray-700">
              His approach to architecture is to constantly discover the new.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CLIENTS */}
      <motion.section
        className="py-24"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-center text-black text-[48px] tracking-[0.4em] mb-20"
        >
          OUR CLIENTS
        </motion.h2>

        <motion.div
          variants={container}
          className="flex flex-wrap justify-center gap-20"
        >
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={scaleIn}>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Logo_placeholder.svg/512px-Logo_placeholder.svg.png"
                alt={`Client ${i}`}
                width={160}
                height={80}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default About;
