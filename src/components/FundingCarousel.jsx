import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const campaigns = [
  {
    id: "school-supplies",
    title: "School Supplies for Rural Kids",
    description: "Help provide essential school supplies to children in rural Ethiopia.",
    progress: 65,
  },
  {
    id: "clean-water",
    title: "Clean Water Initiative",
    description: "Bring clean and safe drinking water to remote communities.",
    progress: 40,
  },
  {
    id: "relief-fund",
    title: "Disaster Relief Fund",
    description: "Support families affected by recent flooding.",
    progress: 80,
  },
];

export default function FundingCarousel() {
  return (
    <section className="max-w-6xl mx-auto my-10">
      <h2 className="text-2xl font-bold mb-6">Featured Campaigns</h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {campaigns.map(({ id, title, description, progress }) => (
          <SwiperSlide key={id}>
            <a href={`/campaigns/${id}`} className="block bg-white rounded-xl shadow hover:shadow-md transition p-6 h-full">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-gray-600 mt-1 line-clamp-3">{description}</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm mt-1">{progress}% funded</p>
              </div>
              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Donate
              </button>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
