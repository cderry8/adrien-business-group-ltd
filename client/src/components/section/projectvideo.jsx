"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function WalkthroughsVideoGrid() {
  const [walkthroughs, setWalkthroughs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest 6 walkthroughs
  const fetchWalkthroughs = async () => {
    try {
      const res = await axios.get("https://adrien-business-group-ltd.onrender.com/adrien/walkthrough");
      const latestSix = res.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setWalkthroughs(latestSix);
    } catch (err) {
      console.error("Failed to fetch walkthroughs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalkthroughs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-24">
        {/* Break walkthroughs into 2 rows of 3 videos each */}
        {[0, 1].map((rowIndex) => {
          const rowVideos = walkthroughs.slice(rowIndex * 3, rowIndex * 3 + 3);
          if (rowVideos.length === 0) return null;

          return (
            <div key={rowIndex} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Large left video */}
              {rowVideos[0] && (
                <div className="lg:col-span-2 aspect-video overflow-hidden rounded-lg shadow-lg">
                  <video
                    src={rowVideos[0].videoUrl}
                    className="h-full w-full object-cover"
                    controls
                    muted
                    autoPlay
                    loop
                  />
                </div>
              )}

              {/* Right stacked videos */}
              <div className="flex flex-col gap-6">
                {rowVideos[1] && (
                  <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
                    <video
                      src={rowVideos[1].videoUrl}
                      className="h-full w-full object-cover"
                      controls
                      muted
                      autoPlay
                      loop
                    />
                  </div>
                )}
                {rowVideos[2] && (
                  <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
                    <video
                      src={rowVideos[2].videoUrl}
                      className="h-full w-full object-cover"
                      controls
                      muted
                      autoPlay
                      loop
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
