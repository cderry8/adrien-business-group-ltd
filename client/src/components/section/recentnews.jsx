"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function RecentNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch latest 3 news
    const fetchNews = async () => {
        try {
            const res = await axios.get("http://localhost:8000/adrien/news");
            const sortedNews = res.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setNews(sortedNews.slice(0, 3)); // only latest 3
        } catch (err) {
            console.error("Failed to fetch news:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto text-center">
                    <p className="text-gray-600">Loading recent news...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white px-10">
            <div className="container mx-auto text-center">
                <h2 className="text-xl tracking-[0.4em] uppercase text-black/60 mb-10">
                    RECENT NEWS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {news.map((item, index) => (
                        <div
                            key={item._id}
                            className="p-8 rounded-lg  hover:shadow-lg transition"
                        >
                            <div className="text-5xl font-bold text-gray-700">
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </div>

                            <p className="text-xl font-semibold text-gray-800 mt-4">
                                {item.title}
                            </p>

                            <p className="text-gray-600 mt-4">
                                {new Date(item.date).getFullYear()}
                            </p>

                            <a
                                href={`/news/${item._id}`}
                                className="text-blue-500 mt-6 inline-block"
                            >
                                Read more
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
