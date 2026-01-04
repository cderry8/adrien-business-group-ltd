"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // get id from URL
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/section/footer";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import axios from "axios";

export default function ProjectDetail() {
  const { id } = useParams(); // get project ID from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState < string | null > (null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`https://adrien-business-group-ltd.onrender.com/adrien/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <p className="text-center py-20 text-gray-500">Project not found.</p>
    );
  }

  return (
    <div className="bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[80vh] w-full">
        <Image
          src={project.mainImage || "/placeholder.jpg"}
          alt={project.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-white max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            {project.name}
          </h1>
          <p className="tracking-[0.3em] text-sm uppercase">{project.type}</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* PROJECT OVERVIEW */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
  {/* LEFT CONTENT */}
  <div className="lg:col-span-2 space-y-6">
    <h2 className="text-2xl font-semibold text-black">
      Project Overview
    </h2>

    <p className="text-gray-700 leading-relaxed max-w-prose">
      {project.overview}
    </p>

    <p className="text-gray-700 leading-relaxed max-w-prose">
      {project.designConcept}
    </p>
  </div>

  {/* RIGHT INFO PANEL */}
  <div className="lg:border-l border-t lg:border-t-0 pt-6 lg:pt-0 lg:pl-8 space-y-5">
    <Info label="Location" value={project.location} />
    <Info label="Year" value={project.year} />
    <Info label="Area" value={project.area} />
    <Info label="Client" value={project.client} />
    <Info label="Style" value={project.style} />
    <Info label="Status" value={project.status} />
    <Info label="Team" value={project.architects?.join(", ")} />
  </div>
</section>


        {project.completedImages?.length > 0 && (
          <section>
            <h2 className="text-2xl text-black font-semibold mb-10">Completed Project Gallery</h2>
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            >
              {project.completedImages.map((src, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-lg">
                    <div
                      onClick={() => setActiveImage(src)}
                      className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl"
                    >
                      <Image
                        src={src}
                        alt={`Completed ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* subtle overlay on hover */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* IN-PROGRESS IMAGES */}
        {project.inProgressImages?.length > 0 && (
          <section>
            <h2 className="text-2xl text-black font-semibold mb-10">In-Progress Gallery</h2>
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              loop
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            >
              {project.inProgressImages.map((src, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-lg">
                    <div
                      onClick={() => setActiveImage(src)}
                      className="group relative h-[400px] w-full cursor-pointer overflow-hidden rounded-2xl shadow-xl"
                    >
                      <Image
                        src={src}
                        alt={`Completed ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* subtle overlay on hover */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* VIDEOS */}
        {project.videos?.length > 0 && (
          <section>
            <h2 className="text-2xl text-black font-semibold mb-10">Project Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {project.videos.map((video, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                    <video src={video.url} controls className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-gray-600">{video.caption || "Video"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MATERIALS & SUSTAINABILITY */}
        
        {activeImage && (
          <div
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl h-[90vh] px-4"
            >
              <button
                onClick={() => setActiveImage(null)}
                className="absolute -top-12 right-4 text-white text-4xl font-light hover:opacity-70"
              >
                ×
              </button>

              <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src={activeImage}
                  alt="Fullscreen view"
                  fill
                  className="object-contain bg-black"
                  priority
                />
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="uppercase tracking-wide text-black text-xs">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}
