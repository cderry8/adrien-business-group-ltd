"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation"; 

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // "" = all

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const router = useRouter();

    const fetchProjects = async () => {
        try {
            const res = await axios.get("https://adrien-business-group-ltd.onrender.com/adrien/projects");
            setProjects(res.data.sort((a, b) => new Date(b.year) - new Date(a.year)));
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter((p) => {
        const matchesName = p.name
            ? p.name.toLowerCase().includes(search.toLowerCase())
            : false;
        const matchesStatus = statusFilter ? p.status === statusFilter : true;
        return matchesName && matchesStatus;
    });

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const handlePageClick = (num) => setCurrentPage(num);

    

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar />

            <main className="pt-[150px] flex-1">
                {/* FILTERS */}
                <div className="max-w-7xl mx-auto text-black px-6 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search by project name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 text-black px-4 py-2 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        <option value="">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                    </select>
                </div>

                {/* PROJECTS GRID */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-700">Loading projects...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <p className="text-center text-gray-700 py-20">No projects found.</p>
                ) : (
                    <>
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-4">
                            {paginatedProjects.map((project, index) => (
                                <ProjectCard
                                    key={project._id || index}
                                    project={project}
                                    onClick={() => router.push(`/projects/${project._id}`)}
                                />
                            ))}
                        </section>

                        {/* PAGINATION CONTROLS */}
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageClick(i + 1)}
                                    className={`px-4 py-2 rounded ${
                                        currentPage === i + 1
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-200 text-black"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

function ProjectCard({ project, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group border-r border-b border-[#e5e5e5] cursor-pointer"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f2f2f2]">
                <Image
                    src={project.mainImage || "/placeholder.jpg"}
                    alt={project.name || project.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                />
            </div>

            <div className="bg-white py-6 text-center">
                <h3 className="text-[18px] font-normal text-black">{project.name || project.title}</h3>
                <p className="mt-1 text-[14px] text-gray-700">{project.location || "Unknown"}</p>
            </div>
        </div>
    );
}
