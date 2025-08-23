import React from "react";

export default function Hero() {
  return (
    <section className="relative bg-cover bg-center h-[80vh]" style={{ backgroundImage: "url('/hero.jpg')" }}>
      <div className="bg-black/50 absolute inset-0"></div>
      <div className="relative container mx-auto text-center text-white flex flex-col justify-center items-center h-full px-4">
        <h1 className="text-4xl md:text-6xl font-bold">Transparent Fundraising for Ethiopia</h1>
        <p className="mt-4 text-lg md:text-xl">Join us in making a difference — one donation at a time.</p>
        <div className="mt-6 flex space-x-4">
          <a href="/donate" className="bg-yellow-500 px-6 py-3 rounded-lg hover:bg-yellow-600">Donate Now</a>
          <a href="/campaigns" className="bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-gray-200">View Campaigns</a>
        </div>
      </div>
    </section>
  );
}
