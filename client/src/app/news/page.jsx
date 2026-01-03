"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/section/footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // number of news per page
  const router = useRouter();

  const fetchNews = async () => {
    try {
      const res = await axios.get("https://adrien-business-group-ltd.onrender.com/adrien/news");
      setNews(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Pagination
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const paginatedNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (num) => setCurrentPage(num);

  const goToNews = (id) => router.push(`/news/${id}`); // redirect to news detail

  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-32 flex-1">
        <h1 className="mb-32 text-xs tracking-[0.4em] uppercase text-black/60">
          News
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading news articles...</p>
          </div>
        ) : news.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No news articles found.</p>
        ) : (
          <>
            {/* FEATURED NEWS (only on first page) */}
            {currentPage === 1 && (
              <div
                className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-20 cursor-pointer"
                onClick={() => goToNews(paginatedNews[0]._id)}
              >
                <div className="relative aspect-[4/3] rounded overflow-hidden">
                  <Image
                    src={paginatedNews[0].featuredImage}
                    alt={paginatedNews[0].title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <span className="mb-6 text-sm uppercase tracking-widest text-black/50">
                    {new Date(paginatedNews[0].date).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>

                  <h2 className="mb-10 text-3xl md:text-4xl font-light tracking-wide">
                    {paginatedNews[0].title}
                  </h2>

                  <p className="mb-12 max-w-md text-black/60 leading-relaxed">
                    {paginatedNews[0].shortDescription}
                  </p>

                  <span className="text-sm text-black/40 cursor-pointer">
                    Read article
                  </span>
                </div>
              </div>
            )}

            {/* NEWS LIST */}
            <div className="space-y-24">
              {paginatedNews.slice(currentPage === 1 ? 1 : 0).map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center cursor-pointer"
                  onClick={() => goToNews(item._id)}
                >
                  <div className="relative aspect-[4/3] rounded overflow-hidden">
                    <Image
                      src={item.featuredImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <span className="mb-4 block text-sm uppercase tracking-widest text-black/50">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>

                    <h3 className="mb-6 text-2xl font-light tracking-wide">
                      {item.title}
                    </h3>

                    <p className="max-w-md text-black/60 leading-relaxed">
                      {item.shortDescription}
                    </p>

                    <span className="text-sm text-blue-500 mt-2 inline-block">
                      Read article
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 mt-16">
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
      </div>

      <Footer />
    </main>
  );
}
