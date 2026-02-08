"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import AdminNavbar from "@/components/layout/adminnavbar";
import { useRouter } from "next/navigation";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const router = useRouter();

  const [editingId, setEditingId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const LIMITS = {
    maxMainImageCount: 1,
    maxCompletedImagesCount: 10,
    maxInProgressImagesCount: 10,
    maxVideosCount: 5,
    maxImageBytes: 10 * 1024 * 1024,
    maxVideoBytes: 200 * 1024 * 1024,
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setMessage(null);

    setForm({
      name: project.name || "",
      type: project.type || "",
      location: project.location || "",
      year: project.year || "",
      area: project.area || "",
      client: project.client || "",
      status: project.status || "Draft",
      style: project.style || "",
      overview: project.overview || "",
      designConcept: project.designConcept || "",
      materials: Array.isArray(project.materials) ? project.materials.join(", ") : project.materials || "",
      sustainability: Array.isArray(project.sustainability) ? project.sustainability.join(", ") : project.sustainability || "",
      architects: Array.isArray(project.architects) && project.architects.length > 0
        ? project.architects.map((name) => ({ name, role: "", image: "" }))
        : [{ name: "", role: "", image: "" }],
      mainImage: null,
      completedImages: [],
      inProgressImages: [],
      videos: [],
    });

    setMainImagePreview(project.mainImage || null);
    setImagePreviews({
      completedImages: project.completedImages || [],
      inProgressImages: project.inProgressImages || [],
    });
    setVideoPreviews((project.videos || []).map((v) => v.url).filter(Boolean));
    setModalOpen(true);
  };

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    year: "",
    area: "",
    client: "",
    status: "Draft",
    style: "",
    overview: "",
    designConcept: "",
    materials: "",
    sustainability: "",
    architects: [{ name: "", role: "", image: "" }],
    mainImage: null,
    completedImages: [],
    inProgressImages: [],
    videos: [],
  });

  const [imagePreviews, setImagePreviews] = useState({
    completedImages: [],
    inProgressImages: [],
  });

  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Search, sort, pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;

  // ---------------- Form Handlers ----------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArchitectChange = (index, key, value) => {
    const updated = [...form.architects];
    updated[index] = { ...updated[index], [key]: value };
    setForm((prev) => ({ ...prev, architects: updated }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > LIMITS.maxImageBytes) {
      setMessage({
        type: "error",
        text: `Main image is too large. Max ${(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB.`,
      });
      e.target.value = "";
      return;
    }

    setForm((prev) => ({ ...prev, mainImage: file }));
    setMainImagePreview(URL.createObjectURL(file));
  };

  const addArchitectField = () => {
    setForm((prev) => ({
      ...prev,
      architects: [...prev.architects, { name: "", role: "", image: "" }],
    }));
  };

  const removeArchitectField = (index) => {
    const updated = [...form.architects];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, architects: updated }));
  };

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);

    const maxCount =
      type === "completedImages"
        ? LIMITS.maxCompletedImagesCount
        : LIMITS.maxInProgressImagesCount;
    const remaining = Math.max(0, maxCount - form[type].length);
    if (remaining === 0) {
      setMessage({
        type: "error",
        text:
          type === "completedImages"
            ? `You already selected the maximum of ${LIMITS.maxCompletedImagesCount} completed images.`
            : `You already selected the maximum of ${LIMITS.maxInProgressImagesCount} in-progress images.`,
      });
      e.target.value = "";
      return;
    }

    const selected = files.slice(0, remaining);
    const oversized = selected.find((f) => f.size > LIMITS.maxImageBytes);
    if (oversized) {
      setMessage({
        type: "error",
        text: `One of the selected images is too large. Max ${(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB per image.`,
      });
      e.target.value = "";
      return;
    }

    if (selected.length < files.length) {
      setMessage({
        type: "error",
        text:
          type === "completedImages"
            ? `Only ${remaining} completed images can be added (max ${LIMITS.maxCompletedImagesCount}).`
            : `Only ${remaining} in-progress images can be added (max ${LIMITS.maxInProgressImagesCount}).`,
      });
    }

    setForm((prev) => ({ ...prev, [type]: [...prev[type], ...selected] }));
    setImagePreviews((prev) => ({
      ...prev,
      [type]: [...prev[type], ...selected.map((file) => URL.createObjectURL(file))],
    }));
    e.target.value = "";
  };

  const removeImage = (type, index) => {
    const updatedFiles = [...form[type]];
    updatedFiles.splice(index, 1);
    setForm((prev) => ({ ...prev, [type]: updatedFiles }));
    const updatedPreviews = [...imagePreviews[type]];
    updatedPreviews.splice(index, 1);
    setImagePreviews((prev) => ({ ...prev, [type]: updatedPreviews }));
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);

    const remaining = Math.max(0, LIMITS.maxVideosCount - form.videos.length);
    if (remaining === 0) {
      setMessage({
        type: "error",
        text: `You already selected the maximum of ${LIMITS.maxVideosCount} videos.`,
      });
      e.target.value = "";
      return;
    }

    const selected = files.slice(0, remaining);
    const oversized = selected.find((f) => f.size > LIMITS.maxVideoBytes);
    if (oversized) {
      setMessage({
        type: "error",
        text: `One of the selected videos is too large. Max ${(LIMITS.maxVideoBytes / (1024 * 1024)).toFixed(0)}MB per video.`,
      });
      e.target.value = "";
      return;
    }

    if (selected.length < files.length) {
      setMessage({
        type: "error",
        text: `Only ${remaining} videos can be added (max ${LIMITS.maxVideosCount}).`,
      });
    }

    setForm((prev) => ({ ...prev, videos: [...prev.videos, ...selected] }));
    setVideoPreviews((prev) => [...prev, ...selected.map((file) => URL.createObjectURL(file))]);
    e.target.value = "";
  };

  const removeVideo = (index) => {
    const updatedFiles = [...form.videos];
    updatedFiles.splice(index, 1);
    setForm((prev) => ({ ...prev, videos: updatedFiles }));
    const updatedPreviews = [...videoPreviews];
    updatedPreviews.splice(index, 1);
    setVideoPreviews(updatedPreviews);
  };

  // ---------------- Submit Form ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Text fields
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("location", form.location);
      formData.append("year", form.year);
      formData.append("area", form.area);
      formData.append("client", form.client);
      formData.append("status", form.status);
      formData.append("style", form.style);
      formData.append("overview", form.overview);
      formData.append("designConcept", form.designConcept);
      formData.append("materials", form.materials);
      formData.append("sustainability", form.sustainability);

      if (form.mainImage) formData.append("mainImage", form.mainImage);

      form.architects.forEach((arch) => {
        if (arch.name.trim()) formData.append("architects", arch.name);
      });

      form.completedImages.forEach((file) => formData.append("completedImages", file));
      form.inProgressImages.forEach((file) => formData.append("inProgressImages", file));
      form.videos.forEach((file) => formData.append("videos", file));

      if (editingId) {
        await axios.put(
          `https://adrien-business-group-ltd.onrender.com/adrien/projects/${editingId}`,
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
      } else {
        await axios.post("https://adrien-business-group-ltd.onrender.com/adrien/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 10 * 60 * 1000,
          onUploadProgress: (e) => {
            if (!e.total) return;
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          },
        });
      }

      setMessage({
        type: "success",
        text: editingId ? "Project updated successfully!" : "Project created successfully!",
      });
      fetchProjects();
      setModalOpen(false);
      setEditingId(null);
      setForm({
        name: "",
        type: "",
        location: "",
        year: "",
        area: "",
        client: "",
        status: "Draft",
        style: "",
        overview: "",
        designConcept: "",
        materials: "",
        sustainability: "",
        architects: [{ name: "", role: "", image: "" }],
        mainImage: null,
        completedImages: [],
        inProgressImages: [],
        videos: [],
      });
      setMainImagePreview(null);
      setImagePreviews({ completedImages: [], inProgressImages: [] });
      setVideoPreviews([]);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  // ---------------- Fetch & Delete Projects ----------------

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://adrien-business-group-ltd.onrender.com/adrien/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`https://adrien-business-group-ltd.onrender.com/adrien/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ---------------- Filter, Sort, Paginate ----------------

  const filteredProjects = projects
  .filter((project) => {
    const name = project.name?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term);
  })
  .sort((a, b) => {
    if (sortKey === "year") {
      return sortOrder === "asc" ? (a.year || 0) - (b.year || 0) : (b.year || 0) - (a.year || 0);
    } else if (sortKey === "status") {
      const statusValue = { Completed: 2, "In Progress": 1, Draft: 0 };
      return sortOrder === "asc"
        ? (statusValue[a.status] || 0) - (statusValue[b.status] || 0)
        : (statusValue[b.status] || 0) - (statusValue[a.status] || 0);
    } else {
      const aVal = (a[sortKey] || "").toString().toLowerCase();
      const bVal = (b[sortKey] || "").toString().toLowerCase();
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
  });

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
            if (isLoggedIn !== "true") {
                router.push("/admin/login");
            }
        }
    }, [router]);

  // ---------------- Render ----------------
  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-100 px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500 mt-1">Manage all architecture projects</p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-gray-900 cursor-pointer text-white px-5 py-3 rounded-md hover:bg-gray-800 transition"
            >
              <FiPlus />
              Add Project
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-4 py-2 rounded w-full md:w-1/3 text-black"
            />

            <div className="flex gap-2 items-center">
              <label className="text-black font-medium">Sort by:</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="border px-2 py-1 rounded text-black"
              >
                <option value="name">Name</option>
                <option value="year">Year</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="border px-2 py-1 rounded text-black"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {/* Projects List */}
          <div className="rounded-xl overflow-hidden">
            {loading ? (
              <p className="text-center py-10">Loading projects...</p>
            ) : paginatedProjects.length === 0 ? (
              <p className="text-center py-10">No projects found.</p>
            ) : (
              paginatedProjects.map((project) => (
                <div key={project._id} className="bg-white rounded-xl shadow mb-8 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl text-black font-semibold">{project.name}</h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-gray-700 hover:text-gray-900"
                        title="Edit Project"
                      >
                        <FiEdit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Project"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <p><strong>Type:</strong> {project.type}</p>
                      <p><strong>Status:</strong> {project.status}</p>
                      <p><strong>Location:</strong> {project.location}</p>
                      <p><strong>Year:</strong> {project.year}</p>
                      <p><strong>Area:</strong> {project.area}</p>
                      <p><strong>Client:</strong> {project.client}</p>
                      <p><strong>Style:</strong> {project.style}</p>
                    </div>
                    <div>
                      <p><strong>Overview:</strong> {project.overview}</p>
                      <p><strong>Design Concept:</strong> {project.designConcept}</p>
                      <p><strong>Architects:</strong> {project.architects.join(", ")}</p>
                      <p><strong>Materials:</strong> {project.materials.join(", ")}</p>
                      <p><strong>Sustainability:</strong> {project.sustainability.join(", ")}</p>
                    </div>
                  </div>

                  {/* Completed Images */}
                  {project.completedImages.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-black mb-2">Completed Images</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.completedImages.map((img, idx) => (
                          <div key={idx} className="relative w-40 h-40 rounded overflow-hidden border">
                            <Image src={img} alt={`Completed ${idx}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* In-progress Images */}
                  {project.inProgressImages.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-black mb-2">In-Progress Images</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.inProgressImages.map((img, idx) => (
                          <div key={idx} className="relative w-40 h-40 rounded overflow-hidden border">
                            <Image src={img} alt={`In-progress ${idx}`} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {project.videos.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-black mb-2">Videos</h3>
                      <div className="flex flex-wrap gap-4">
                        {project.videos.map((vid, idx) => (
                          <video
                            key={idx}
                            src={vid.url}
                            controls
                            className="w-80 h-48 rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === idx + 1 ? "bg-gray-900 text-white" : "text-black"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto">
                    <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full my-10 p-8 relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-700 hover:text-gray-900"
                        >
                            <FiX size={24} />
                        </button>

                        <h2 className="text-2xl font-semibold mb-6 text-black">{editingId ? "Edit Project" : "Create Project"}</h2>
                        {message && (
                            <div
                                className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                            >
                                {message.text}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Project Name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 rounded text-black w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    name="type"
                                    placeholder="Project Type"
                                    value={form.type}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 rounded text-black w-full"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Location"
                                    value={form.location}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 rounded text-black w-full"
                                    required
                                />
                                <input
                                    type="text"
                                    name="year"
                                    placeholder="Year"
                                    value={form.year}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 rounded text-black w-full"
                                />
                                <input
                                    type="text"
                                    name="area"
                                    placeholder="Area"
                                    value={form.area}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 rounded text-black w-full"
                                />
                                <input
                                    type="text"
                                    name="client"
                                    placeholder="Client"
                                    value={form.client}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 rounded text-black w-full"
                                />
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleInputChange}
                                    className="border px-4 py-2 rounded text-black w-full"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <input
                                type="text"
                                name="style"
                                placeholder="Project Style"
                                value={form.style}
                                onChange={handleInputChange}
                                className="border px-4 py-2 rounded text-black w-full"
                            />

                            <textarea
                                name="overview"
                                placeholder="Project Overview"
                                value={form.overview}
                                onChange={handleInputChange}
                                className="border px-4 py-2 rounded text-black w-full"
                            />

                            <textarea
                                name="designConcept"
                                placeholder="Design Concept"
                                value={form.designConcept}
                                onChange={handleInputChange}
                                className="border px-4 py-2 rounded text-black w-full"
                            />

                            <div className="flex gap-2">
                                <label className="text-black font-medium">Materials</label>
                                <input
                                    type="text"
                                    placeholder="Add Material"
                                    value={form.materials}
                                    onChange={handleInputChange}
                                    name="materials"
                                    className="border px-4 py-2 rounded text-black flex-1"
                                />
                            </div>

                            <div className="flex gap-2">
                                <label className="text-black font-medium">Sustainability</label>
                                <input
                                    type="text"
                                    placeholder="Add Sustainability Info"
                                    value={form.sustainability}
                                    onChange={handleInputChange}
                                    name="sustainability"
                                    className="border px-4 py-2 rounded text-black flex-1"
                                />
                            </div>

                            {form.architects.map((arch, index) => (
                                <div key={index} className="flex gap-2 items-center mb-2">
                                    <input
                                        type="text"
                                        name={`architects[${index}]`}
                                        placeholder="Architect Name"
                                        value={arch.name}
                                        onChange={(e) => handleArchitectChange(index, "name", e.target.value)}
                                        className="border px-2 py-1 rounded text-black"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArchitectField(index)}
                                        className="text-red-500 px-2"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addArchitectField}
                                className="bg-gray-900 text-white px-4 py-2 rounded mt-2"
                            >
                                Add Architect
                            </button>

                            <label className="block mb-2 font-medium">Main Image</label>
                            <p className="text-xs text-gray-500 mb-2">
                                Max {LIMITS.maxMainImageCount} image, up to {(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB.
                            </p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageChange}
                            />

                            {mainImagePreview && (
                                <div className="mt-2 relative w-40 h-40">
                                    <Image
                                        src={mainImagePreview}
                                        alt="Main preview"
                                        fill
                                        className="object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm((prev) => ({ ...prev, mainImage: null }));
                                            setMainImagePreview(null);
                                        }}
                                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            )}

                            <div>
                                <label className="text-black font-medium">Completed Images</label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Max {LIMITS.maxCompletedImagesCount} images, up to {(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB each.
                                </p>
                                <input
                                    type="file"
                                    name="completedImages"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, "completedImages")}
                                    className="mt-2 text-black cursor-pointer"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {imagePreviews.completedImages.map((src, idx) => (
                                        <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
                                            <Image src={src} alt="Preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage("completedImages", idx)}
                                                className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-black font-medium">In Progress Images</label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Max {LIMITS.maxInProgressImagesCount} images, up to {(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB each.
                                </p>
                                <input
                                    type="file"
                                    name="inProgressImages"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, "inProgressImages")}
                                    className="mt-2 text-black cursor-pointer"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {imagePreviews.inProgressImages.map((src, idx) => (
                                        <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
                                            <Image src={src} alt="Preview" fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage("inProgressImages", idx)}
                                                className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-black font-medium">Videos</label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Max {LIMITS.maxVideosCount} videos, up to {(LIMITS.maxVideoBytes / (1024 * 1024)).toFixed(0)}MB each.
                                </p>
                                <input
                                    type="file"
                                    name="videos"
                                    multiple
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="mt-2"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {videoPreviews.map((src, idx) => (
                                        <div key={idx} className="relative w-32 h-24 border rounded overflow-hidden">
                                            <video src={src} controls className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeVideo(idx)}
                                                className="absolute top-1 right-1 text-red-500 bg-white rounded-full p-1"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="bg-gray-900 cursor-pointer text-white px-6 py-3 rounded hover:bg-gray-800 transition"
                            >
                                {loading ? "Saving..." : editingId ? "Update Project" : "Create Project"}
                            </button>

                            {loading && uploadProgress !== null && (
                              <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
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
                </div>
            )}
        </>
    );
}

