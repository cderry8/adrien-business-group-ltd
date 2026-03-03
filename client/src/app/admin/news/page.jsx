"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import AdminNavbar from "@/components/layout/adminnavbar";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminNews() {
  const [newsList, setNewsList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const LIMITS = {
    maxFeaturedImageCount: 1,
    maxGalleryImagesCount: 10,
    maxVideosCount: 5,
    maxImageBytes: 10 * 1024 * 1024,
    maxVideoBytes: 200 * 1024 * 1024,
  };

  const [editingId, setEditingId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    shortDescription: "",
    content: [""], // array of paragraphs
    featuredImage: null,
    galleryImages: [],
    videos: [],
    author: "",
  });

  const [imagePreviews, setImagePreviews] = useState({
    galleryImages: [],
    featuredImage: null,
  });
  const [videoPreviews, setVideoPreviews] = useState([]);

  // Fetch news from API
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://adrien-business-group-ltd.onrender.com/adrien/news");
      setNewsList(res.data);
    } catch (err) {
      console.error("Failed to fetch news", err);
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      date: item.date ? new Date(item.date).toISOString().slice(0, 10) : "",
      shortDescription: item.shortDescription || "",
      content: Array.isArray(item.content) && item.content.length > 0 ? item.content : [""],
      featuredImage: null,
      galleryImages: [],
      videos: [],
      author: item.author || "",
    });
    setImagePreviews({ galleryImages: [], featuredImage: item.featuredImage || null });
    setVideoPreviews([]);
    setMessage(null);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Input change for simple text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Content paragraphs
  const handleContentChange = (index, value) => {
    const updated = [...form.content];
    updated[index] = value;
    setForm((prev) => ({ ...prev, content: updated }));
  };
  const addContentParagraph = () => setForm((prev) => ({ ...prev, content: [...prev.content, ""] }));
  const removeContentParagraph = (index) => {
    const updated = [...form.content];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, content: updated }));
  };

  // Featured image
  const handleFeaturedImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > LIMITS.maxImageBytes) {
      setMessage({
        type: "error",
        text: `Featured image is too large. Max ${(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB.`,
      });
      e.target.value = "";
      return;
    }

    setForm((prev) => ({ ...prev, featuredImage: file }));
    setImagePreviews((prev) => ({ ...prev, featuredImage: URL.createObjectURL(file) }));
    e.target.value = "";
  };

  // Gallery images
  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);

    const remaining = Math.max(0, LIMITS.maxGalleryImagesCount - form.galleryImages.length);
    if (remaining === 0) {
      setMessage({
        type: "error",
        text: `You already selected the maximum of ${LIMITS.maxGalleryImagesCount} gallery images.`,
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
        text: `Only ${remaining} gallery images can be added (max ${LIMITS.maxGalleryImagesCount}).`,
      });
    }

    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, ...selected] }));
    setImagePreviews((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...selected.map((file) => URL.createObjectURL(file))],
    }));
    e.target.value = "";
  };
  const removeGalleryImage = (index) => {
    const updatedFiles = [...form.galleryImages];
    updatedFiles.splice(index, 1);
    const updatedPreviews = [...imagePreviews.galleryImages];
    updatedPreviews.splice(index, 1);
    setForm((prev) => ({ ...prev, galleryImages: updatedFiles }));
    setImagePreviews((prev) => ({ ...prev, galleryImages: updatedPreviews }));
  };

  // Videos
  const handleVideos = (e) => {
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
    const updatedPreviews = [...videoPreviews];
    updatedPreviews.splice(index, 1);
    setForm((prev) => ({ ...prev, videos: updatedFiles }));
    setVideoPreviews(updatedPreviews);
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("date", form.date);
      formData.append("shortDescription", form.shortDescription);
      if (editingId) {
        formData.append("content", JSON.stringify(form.content));
      } else {
        form.content.forEach((para) => formData.append("content", para));
      }
      formData.append("author", form.author);

      if (form.featuredImage) formData.append("featuredImage", form.featuredImage);
      form.galleryImages.forEach((file) => formData.append("galleryImages", file));
      form.videos.forEach((file) => formData.append("videos", file));

      if (editingId) {
        await axios.put(
          `https://adrien-business-group-ltd.onrender.com/adrien/news/${editingId}`,
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
        await axios.post("https://adrien-business-group-ltd.onrender.com/adrien/news", formData, {
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

      setMessage({ type: "success", text: editingId ? "News updated successfully!" : "News created successfully!" });
      setModalOpen(false);
      setEditingId(null);
      setForm({
        title: "",
        date: "",
        shortDescription: "",
        content: [""],
        featuredImage: null,
        galleryImages: [],
        videos: [],
        author: "",
      });
      setImagePreviews({ galleryImages: [], featuredImage: null });
      setVideoPreviews([]);
      fetchNews();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;
    try {
      await axios.delete(`https://adrien-business-group-ltd.onrender.com/adrien/news/${id}`);
      setNewsList((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete news", err);
      alert("Failed to delete news item");
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
    <>
      <AdminNavbar />

      <div className="min-h-screen bg-gray-100 px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">News</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-md hover:bg-gray-800 transition"
            >
              <FiPlus /> Add News
            </button>
          </div>

          {/* NEWS LIST */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading news...</p>
            ) : newsList.length === 0 ? (
              <p className="text-gray-700 text-center col-span-full">No news found.</p>
            ) : (
              newsList.map((n) => (
                <div key={n._id} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image src={n.featuredImage} alt={n.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{n.title}</h2>
                    <p className="text-sm text-gray-700">{new Date(n.date).toLocaleDateString()}</p>
                    <p className="mt-2 text-gray-700">{n.shortDescription}</p>
                    <p className="mt-2 font-medium">{n.author}</p>
                    <div className="flex justify-end gap-4 mt-4">
                      <button onClick={() => handleEdit(n)} className="text-gray-700 hover:text-gray-900">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(n._id)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full my-10 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-gray-700 hover:text-gray-900 z-10">
              <FiX size={24} />
            </button>

            <div className="px-8 pt-8 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-black">{editingId ? "Edit News" : "Create News"}</h2>
              <p className="text-sm text-gray-700 mt-1">
                Add the article details and upload media. Limits are shown under each upload.
              </p>
            </div>

            <div className="px-8 pb-8 pt-6">
              {message && (
                <div className={`mb-6 p-3 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {message.text}
                </div>
              )}

              <form className="space-y-8" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. New Project Launch"
                      value={form.title}
                      onChange={handleInputChange}
                      className="border border-gray-300 px-4 py-2.5 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      className="border border-gray-300 px-4 py-2.5 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-900">Author</label>
                    <input
                      type="text"
                      name="author"
                      placeholder="e.g. Adrien"
                      value={form.author}
                      onChange={handleInputChange}
                      className="border border-gray-300 px-4 py-2.5 rounded-lg text-black w-full focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Short Description</label>
                  <textarea
                    name="shortDescription"
                    placeholder="A short summary shown on the news list"
                    value={form.shortDescription}
                    onChange={handleInputChange}
                    className="border border-gray-300 px-4 py-2.5 rounded-lg text-black w-full min-h-24 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  />
                </div>

                {/* Content paragraphs */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Content</h3>
                      <p className="text-xs text-gray-700">Add one or more paragraphs.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addContentParagraph}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      Add Paragraph
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {form.content.map((para, idx) => (
                      <div key={idx} className="flex gap-2">
                        <textarea
                          value={para}
                          onChange={(e) => handleContentChange(idx, e.target.value)}
                          className="border border-gray-300 px-4 py-2.5 rounded-lg text-black flex-1 min-h-24 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                          rows={3}
                        />
                        <button
                          type="button"
                          onClick={() => removeContentParagraph(idx)}
                          className="text-red-600 hover:text-red-700 px-2"
                          title="Remove paragraph"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Image */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Featured Image</h3>
                    <p className="text-xs text-gray-700 mt-1">
                      Max {LIMITS.maxFeaturedImageCount} image, up to {(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB.
                    </p>
                  </div>

                  <label
                    htmlFor="news-featured-image"
                    className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center cursor-pointer hover:bg-gray-100 transition"
                  >
                    <p className="text-sm font-medium text-gray-900">Click to choose an image</p>
                    <p className="text-xs text-gray-700 mt-1">PNG, JPG, WEBP</p>
                  </label>
                  <input
                    id="news-featured-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImage}
                    className="hidden"
                  />

                  {imagePreviews.featuredImage && (
                    <div className="mt-4 relative w-full aspect-square max-w-[220px]">
                      <Image src={imagePreviews.featuredImage} alt="Featured" fill className="object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, featuredImage: null }));
                          setImagePreviews((prev) => ({ ...prev, featuredImage: null }));
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-sm font-semibold text-gray-900">Gallery Images</h3>
                    <p className="text-xs text-gray-700">
                      Max {LIMITS.maxGalleryImagesCount}, {(LIMITS.maxImageBytes / (1024 * 1024)).toFixed(0)}MB each
                    </p>
                  </div>

                  <label
                    htmlFor="news-gallery-images"
                    className="mt-4 flex items-center justify-between rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <p className="text-sm text-gray-900">Choose images</p>
                    <p className="text-xs text-gray-700">Multiple</p>
                  </label>
                  <input
                    id="news-gallery-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryImages}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviews.galleryImages.map((src, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={src} alt="Gallery" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 text-red-600 bg-white/90 rounded-full p-1"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Videos */}
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-sm font-semibold text-gray-900">Videos</h3>
                    <p className="text-xs text-gray-700">
                      Max {LIMITS.maxVideosCount}, {(LIMITS.maxVideoBytes / (1024 * 1024)).toFixed(0)}MB each
                    </p>
                  </div>

                  <label
                    htmlFor="news-videos"
                    className="mt-4 flex items-center justify-between rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <p className="text-sm text-gray-900">Choose videos</p>
                    <p className="text-xs text-gray-700">Multiple</p>
                  </label>
                  <input
                    id="news-videos"
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideos}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2 mt-3">
                    {videoPreviews.map((src, idx) => (
                      <div key={idx} className="relative w-32 h-24 border border-gray-200 rounded-lg overflow-hidden">
                        <video src={src} controls className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeVideo(idx)}
                          className="absolute top-1 right-1 text-red-600 bg-white/90 rounded-full p-1"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <div className="text-xs text-gray-700">
                    {editingId ? "Updating will keep existing media if you don’t select new files." : "You can edit this article later from the list."}
                  </div>
                  <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                    {loading ? "Saving..." : editingId ? "Update News" : "Create News"}
                  </button>
                </div>

              {loading && uploadProgress !== null && (
                <div className="mt-4">
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
          </div>
        </div>
      )}
    </>
  );
}
