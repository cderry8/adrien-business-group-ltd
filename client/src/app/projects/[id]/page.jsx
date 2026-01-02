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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/adrien/projects/${id}`);
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl text-black font-semibold mb-6">Project Overview</h2>
            <p className="text-gray-700 leading-7">{project.overview}</p>
            <p className="text-gray-700 leading-7">{project.designConcept}</p>
          </div>

          <div className="border-l pl-8 space-y-4 text-sm">
            <Info label="Location" value={project.location} />
            <Info label="Year" value={project.year} />
            <Info label="Area" value={project.area} />
            <Info label="Client" value={project.client} />
            <Info label="Style" value={project.style} />
            <Info label="Status" value={project.status} />
            <Info label="Team" value={project.architects?.join(", ")} />
          </div>
        </section>

        {/* COMPLETED IMAGES */}
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
                    <Image src={src} alt={`Completed ${index + 1}`} fill className="object-cover" />
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
                    <Image src={src} alt={`In-progress ${index + 1}`} fill className="object-cover" />
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
        <section>
          <h2 className="text-2xl text-black font-semibold mb-6">Materials & Sustainability</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700">
            {project.materials?.map((mat, i) => (
              <p key={i}>{mat}</p>
            ))}
            {project.sustainability?.map((sust, i) => (
              <p key={i}>{sust}</p>
            ))}
          </div>
        </section>
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
