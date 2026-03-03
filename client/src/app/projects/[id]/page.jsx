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
  const [fullscreenImage, setFullscreenImage] = useState(null);


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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setFullscreenImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <p className="text-center py-20 text-gray-700">Project not found.</p>
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
          <p className="tracking-[0.3em] text-sm uppercase text-white/90">
            {project.type || "Project"}
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            {project.name}
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/90">
            {project.location && <span>{project.location}</span>}
            {project.year && <span>{project.year}</span>}
            {project.status && <span>{project.status}</span>}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl text-black font-semibold tracking-tight">
                Project Overview
              </h2>
              <p className="mt-4 text-gray-700 leading-7 break-words">
                {project.overview || ""}
              </p>
              {project.designConcept && (
                <p className="mt-4 text-gray-700 leading-7 break-words">
                  {project.designConcept}
                </p>
              )}
            </div>

            {Array.isArray(project.architects) && project.architects.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-sm font-semibold text-gray-900">Team</h3>
                <p className="mt-2 text-gray-700">
                  {project.architects.join(", ")}
                </p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-gray-900">Project Info</h3>
              <div className="mt-5 space-y-4 text-sm">
                <Info label="Location" value={project.location} />
                <Info label="Year" value={project.year} />
                <Info label="Area" value={project.area} />
                <Info label="Client" value={project.client} />
                <Info label="Style" value={project.style} />
                <Info label="Status" value={project.status} />
                <Info
                  label="Materials"
                  value={Array.isArray(project.materials) ? project.materials.join(", ") : project.materials}
                />
                <Info
                  label="Sustainability"
                  value={Array.isArray(project.sustainability) ? project.sustainability.join(", ") : project.sustainability}
                />
              </div>
            </div>
          </aside>
        </section>


        {/* COMPLETED IMAGES */}
        {project.completedImages?.length > 0 && (
          <section>
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-2xl text-black font-semibold tracking-tight">Completed Gallery</h2>
              <p className="text-sm text-gray-700">Click any image to view fullscreen.</p>
            </div>
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
                  <div
                    className="relative h-[380px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm cursor-pointer group"
                    onClick={() => setFullscreenImage(src)}
                  >
                    <Image
                      src={src}
                      alt={`Completed ${index + 1}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                  </div>

                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* IN-PROGRESS IMAGES */}
        {project.inProgressImages?.length > 0 && (
          <section>
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-2xl text-black font-semibold tracking-tight">In-Progress Gallery</h2>
              <p className="text-sm text-gray-700">Click any image to view fullscreen.</p>
            </div>
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
                  <div
                    className="relative h-[380px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm cursor-pointer group"
                    onClick={() => setFullscreenImage(src)}
                  >
                    <Image
                      src={src}
                      alt={`In Progress ${index + 1}`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                  </div>

                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        {/* VIDEOS */}
        {project.videos?.length > 0 && (
          <section>
            <h2 className="text-2xl text-black font-semibold tracking-tight mb-8">Project Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.videos.map((video, index) => (
                <div key={index} className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                  <div className="aspect-video w-full bg-black">
                    <video src={video.url} controls className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900">{video.caption || "Video"}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl font-light"
            onClick={() => setFullscreenImage(null)}
          >
            ✕
          </button>

          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullscreenImage}
              alt="Fullscreen view"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}


      <Footer />
    </div>
  );
}

function Info({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="flex items-start justify-between gap-6">
      <p className="uppercase tracking-wide text-gray-700 text-xs">{label}</p>
      <p className="text-gray-900 font-medium text-right break-words">{value}</p>
    </div>
  );
}
