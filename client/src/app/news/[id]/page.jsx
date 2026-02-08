"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/section/footer";
import Image from "next/image";
import axios from "axios";

export default function NewsDetailPage() {
  const { id } = useParams(); // Get the news ID from URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNewsById = async () => {
    try {
      const res = await axios.get(`https://adrien-business-group-ltd.onrender.com/adrien/news/${id}`);
      setNews(res.data);
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchNewsById();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700">Loading news...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-700">News article not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[60vh] w-full">
        <Image
          src={news.featuredImage}
          alt={news.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-white max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">{news.title}</h1>
          <p className="tracking-[0.3em] text-sm uppercase">
            {new Date(news.date).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })} | By {news.author}
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-24">

        {/* CONTENT */}
        <section className="space-y-6 text-gray-700 leading-7">
          {news.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        {/* GALLERY */}
        {news.galleryImages && news.galleryImages.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-10">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {news.galleryImages.map((img, index) => (
                <div key={index} className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
                  <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIDEOS */}
        {news.videos && news.videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-10">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.videos.map((videoUrl, index) => (
                <div key={index} className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <video src={videoUrl} controls className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
