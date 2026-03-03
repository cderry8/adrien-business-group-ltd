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
  const [editingId, setEditingId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const LIMITS = {
    maxCoverBytes: 10 * 1024 * 1024,
    maxVideoBytes: 200 * 1024 * 1024,
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form state for creating walkthrough
  const [newProjectName, setNewProjectName] = useState("");
  const [newVideo, setNewVideo] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

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

  if (newVideo && newVideo.size > LIMITS.maxVideoBytes) {
    alert(`Video is too large. Max ${(LIMITS.maxVideoBytes / (1024 * 1024)).toFixed(0)}MB.`);
    return;
  }
  if (newCover && newCover.size > LIMITS.maxCoverBytes) {
    alert(`Cover image is too large. Max ${(LIMITS.maxCoverBytes / (1024 * 1024)).toFixed(0)}MB.`);
    return;
  }

  setCreating(true); // start loading
  setUploadProgress(0);
  try {
    const formData = new FormData();
    formData.append("projectName", newProjectName);
    if (newVideo) formData.append("video", newVideo);
    if (newCover) formData.append("coverImage", newCover);

    if (editingId) {
      const res = await axios.put(
        `https://adrien-business-group-ltd.onrender.com/adrien/walkthrough/${editingId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 10 * 60 * 1000,
          onUploadProgress: (e) => {
            if (!e.total) return;
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );
      setWalkthroughs((prev) => prev.map((w) => (w._id === editingId ? res.data : w)));
      setEditingId(null);
    } else {
      const res = await axios.post(
        "https://adrien-business-group-ltd.onrender.com/adrien/walkthrough",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 10 * 60 * 1000,
          onUploadProgress: (e) => {
            if (!e.total) return;
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );
      setWalkthroughs((prev) => [res.data, ...prev]);
    }

    setNewProjectName("");
    setNewVideo(null);
    setNewCover(null);
  } catch (err) {
    console.error("Failed to create walkthrough:", err);
  } finally {
    setCreating(false); // end loading
    setUploadProgress(null);
  }
};

  const handleEdit = (walk) => {
    setEditingId(walk._id);
    setNewProjectName(walk.projectName || "");
    setNewVideo(null);
    setNewCover(null);
    setCoverPreview(walk.coverImage || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-2xl text-black font-semibold">{editingId ? "Edit Walkthrough" : "Add New Walkthrough"}</h2>
              <p className="text-sm text-gray-700 mt-1">
                Upload a walkthrough video and an optional cover image. Limits are shown below.
              </p>
            </div>

            <form onSubmit={handleCreate} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="flex flex-col md:col-span-3">
              <label htmlFor="projectName" className="mb-1 text-sm font-medium text-gray-900">Project Name</label>
              <input
                id="projectName"
                type="text"
                placeholder="Enter project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="border border-gray-300 px-4 py-2.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
            </div>

            {/* Video Upload */}
            <div className="rounded-xl border border-gray-200 p-4 md:col-span-2">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-semibold text-gray-900">Walkthrough Video</h3>
                <p className="text-xs text-gray-700">Max {(LIMITS.maxVideoBytes / (1024 * 1024)).toFixed(0)}MB</p>
              </div>
              <label
                htmlFor="videoUpload"
                className="mt-3 flex items-center justify-between rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-sm text-gray-900">Choose video</p>
                <p className="text-xs text-gray-700 truncate max-w-[180px]">
                  {newVideo?.name || "MP4, MOV, etc."}
                </p>
              </label>
              <input
                id="videoUpload"
                type="file"
                accept="video/*"
                onChange={(e) => setNewVideo(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="rounded-xl border border-gray-200 p-4 md:col-span-1">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-semibold text-gray-900">Cover Image</h3>
                <p className="text-xs text-gray-700">Max {(LIMITS.maxCoverBytes / (1024 * 1024)).toFixed(0)}MB</p>
              </div>

              <label
                htmlFor="coverUpload"
                className="mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="text-sm font-medium text-gray-900">Choose image (optional)</p>
                <p className="text-xs text-gray-700 mt-1">PNG, JPG, WEBP</p>
              </label>
              <input
                id="coverUpload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setNewCover(file);
                  if (file) setCoverPreview(URL.createObjectURL(file));
                }}
                className="hidden"
              />

              {coverPreview && (
                <div className="mt-3 relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="md:col-span-3 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-700">
                {editingId ? "Updating will keep existing media if you don’t select new files." : "You can edit this walkthrough later."}
              </p>
  <button
    type="submit"
    disabled={creating}
    className={`bg-gray-900 text-white px-6 py-3 rounded-lg text-lg font-medium transition flex items-center gap-2 justify-center ${
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
    {creating ? "Saving..." : editingId ? "Update Walkthrough" : "Create Walkthrough"}
  </button>
</div>

{creating && uploadProgress !== null && (
  <div className="col-span-1 md:col-span-3 mt-4">
    <div className="flex justify-between text-xs text-gray-700 mb-1">
      <span>Uploading...</span>
      <span>{uploadProgress}%</span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className="h-2 bg-gray-900 rounded transition-all"
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
  </div>
)}

          </form>
          </div>
        </section>

        {/* WALKTHROUGHS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700">Loading walkthroughs...</p>
          </div>
        ) : walkthroughs.length === 0 ? (
          <p className="text-center text-gray-700 py-20">No walkthroughs found.</p>
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
                    <p className="text-gray-700 text-sm mt-1">Uploaded by {walk.createdBy}</p>
                    <p className="text-gray-600 text-xs mt-1">{new Date(walk.createdAt).toLocaleDateString()}</p>

                    <div className="flex justify-between mt-4">
                      <a
                        href={`/walkthrough/${walk._id}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View
                      </a>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleEdit(walk)}
                          className="text-gray-700 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(walk._id)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
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
