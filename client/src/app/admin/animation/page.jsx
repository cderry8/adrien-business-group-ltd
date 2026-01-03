"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/section/footer";
import Image from "next/image";
import axios from "axios";
import AdminNavbar from "@/components/layout/adminnavbar";
import { useRouter } from "next/navigation";

export default function WalkthroughsPage() {
  const [walkthroughs, setWalkthroughs] = useState([]);
  const [loading, setLoading] = useState(true);
const [creating, setCreating] = useState(false);
    const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form state for creating walkthrough
  const [newProjectName, setNewProjectName] = useState("");
  const [newVideo, setNewVideo] = useState(null);
  const [newCover, setNewCover] = useState(null);

  // Fetch all walkthroughs
  const fetchWalkthroughs = async () => {
    try {
      const res = await axios.get("https://adrien-business-group-ltd.onrender.com/adrien/walkthrough");
      setWalkthroughs(res.data);
    } catch (err) {
      console.error("Failed to fetch walkthroughs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalkthroughs();
  }, []);

  // Pagination
  const totalPages = Math.ceil(walkthroughs.length / itemsPerPage);
  const paginatedWalkthroughs = walkthroughs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (num) => setCurrentPage(num);

  // Delete walkthrough
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this walkthrough?")) return;
    try {
      await axios.delete(`https://adrien-business-group-ltd.onrender.com/adrien/walkthrough/${id}`);
      setWalkthroughs((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      console.error("Failed to delete walkthrough:", err);
    }
  };

  // Create walkthrough
  const handleCreate = async (e) => {
  e.preventDefault();
  if (!newProjectName || !newVideo) {
    alert("Project name and video are required.");
    return;
  }

  setCreating(true); // start loading
  try {
    const formData = new FormData();
    formData.append("projectName", newProjectName);
    formData.append("video", newVideo);
    if (newCover) formData.append("coverImage", newCover);

    const res = await axios.post(
      "https://adrien-business-group-ltd.onrender.com/adrien/walkthrough",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setWalkthroughs((prev) => [res.data, ...prev]);
    setNewProjectName("");
    setNewVideo(null);
    setNewCover(null);
  } catch (err) {
    console.error("Failed to create walkthrough:", err);
  } finally {
    setCreating(false); // end loading
  }
};

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
            if (isLoggedIn !== "true") {
                router.push("/admin/login");
            }
        }
    }, [router]);
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <AdminNavbar />

      <main className="pt-[150px] flex-1 max-w-7xl mx-auto px-6">

        {/* CREATE WALKTHROUGH */}
        <section className="mb-16 border-b pb-8">
          <h2 className="text-2xl text-black font-semibold mb-6">Add New Walkthrough</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col">
              <label htmlFor="projectName" className="mb-1 font-medium text-gray-700">Project Name</label>
              <input
                id="projectName"
                type="text"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Video Upload */}
            <div className="flex flex-col">
              <label htmlFor="videoUpload" className="mb-1 font-medium text-gray-700">Walkthrough Video</label>
              <input
                id="videoUpload"
                type="file"
                accept="video/*"
                onChange={(e) => setNewVideo(e.target.files[0])}
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="flex flex-col">
              <label htmlFor="coverUpload" className="mb-1 font-medium text-gray-700">Cover Image (Optional)</label>
              <input
                id="coverUpload"
                type="file"
                accept="image/*"
                onChange={(e) => setNewCover(e.target.files[0])}
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="col-span-1 md:col-span-3 mt-4 flex justify-center">
  <button
    type="submit"
    disabled={creating}
    className={`bg-gray-900 text-white px-6 py-3 rounded text-lg font-medium transition flex items-center gap-2 justify-center ${
      creating ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
    }`}
  >
    {creating && (
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
    )}
    {creating ? "Creating..." : "Create Walkthrough"}
  </button>
</div>

          </form>
        </section>

        {/* WALKTHROUGHS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading walkthroughs...</p>
          </div>
        ) : walkthroughs.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No walkthroughs found.</p>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedWalkthroughs.map((walk) => (
                <div key={walk._id} className="border rounded-lg overflow-hidden group relative">
                  {walk.coverImage ? (
                    <div className="relative aspect-video w-full h-56">
                      <Image
                        src={walk.coverImage}
                        alt={walk.projectName}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-300 aspect-video w-full h-56" />
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{walk.projectName}</h3>
                    <p className="text-gray-500 text-sm mt-1">Uploaded by {walk.createdBy}</p>
                    <p className="text-gray-400 text-xs mt-1">{new Date(walk.createdAt).toLocaleDateString()}</p>

                    <div className="flex justify-between mt-4">
                      <a
                        href={`/walkthrough/${walk._id}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(walk._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* PAGINATION */}
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
                  className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-gray-900 text-white" : "bg-gray-200 text-black"}`}
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

      <Footer />
    </div>
  );
}
