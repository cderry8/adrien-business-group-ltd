"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://adrien-business-group-ltd.onrender.com/adrien/projects");
      // Sort by latest year and take 5 latest projects
      const sorted = res.data
        .sort((a, b) => new Date(b.year) - new Date(a.year))
        .slice(0, 5);
      setProjects(sorted);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleViewProject = (id) => {
    router.push(`/projects/${id}`);
  };

  return (
    <section className="w-full bg-white py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section title */}
        <h2 className="mb-24 text-xs tracking-[0.4em] uppercase text-gray-800 text-center">
          Featured Projects
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-700 py-20">
            No featured projects found.
          </p>
        ) : (
          <div className="space-y-32">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full cursor-pointer" onClick={() => handleViewProject(project._id)}>
                  <Image
                    src={project.mainImage || "/placeholder.jpg"}
                    alt={project.name || project.title}
                    fill
                    className="object-cover rounded-lg shadow-lg transition duration-500 hover:scale-105"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center text-center lg:text-left">
                  <span className="mb-6 text-sm tracking-widest uppercase text-gray-700">
                    {project.location || "Unknown"}
                  </span>

                  <h3 className="mb-10 text-3xl md:text-4xl font-light tracking-wide text-black">
                    {project.name || project.title}
                  </h3>

                  <p className="mb-12 text-sm text-gray-700">
                    {project.overview || project.subtitle || ""}
                  </p>

                  <button
                    onClick={() => handleViewProject(project._id)}
                    className="w-fit px-5 py-2 text-sm border cursor-pointer border-gray-900 text-black hover:bg-gray-900 hover:text-white transition mx-auto lg:mx-0"
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
