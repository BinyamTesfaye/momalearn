import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, BookOpen, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 via-black to-gray-800 text-white min-h-screen">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-8 bg-[url('/grid.svg')] bg-center mix-blend-overlay" />

      <div className="container mx-auto px-4 pt-24 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass p-10 rounded-3xl max-w-5xl mx-auto shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
            MOMA Continuing Education Training Center
          </h2>

          <p className="text-center text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed text-lg">
            Advancing healthcare through lifelong learning. We empower health professionals
            with the knowledge, skills and confidence needed to thrive in a rapidly
            evolving healthcare landscape.
          </p>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Overview / Why MOMA */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="card-futuristic p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/2"
            >
              <div className="flex items-start gap-4">
                <Heart className="w-10 h-10 text-yellow-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-400">Our Purpose</h3>
                  <p className="text-gray-300 leading-relaxed">
                    At MOMA we focus on empowering clinicians, nurses, public health workers,
                    and allied health professionals. Our programs help professionals stay
                    current, enhance credentials, and lead with measurable impact in their
                    communities.
                  </p>

                  <ul className="mt-4 space-y-2 text-gray-300">
                    <li>• Accredited CPD courses tailored to medical and public health practice</li>
                    <li>• In-service training aligned with national & international standards</li>
                    <li>• Specialized workshops in primary care, digital health, leadership, & community care</li>
                    <li>• Blended learning: flexible online study combined with hands-on practice</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* How we help / Who */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5 }}
              className="card-futuristic p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/2"
            >
              <div className="flex items-start gap-4">
                <Users className="w-10 h-10 text-pink-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-pink-400">Who We Serve</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Whether you are renewing a license, shifting specialties, or strengthening your
                    role in community health, MOMA is built to support continuing professional growth.
                  </p>

                  <div className="mt-4 text-gray-300">
                    <strong className="block mb-2">We offer:</strong>
                    <ul className="space-y-2">
                      <li>• Accredited CPD and license renewal courses</li>
                      <li>• Practical in-service trainings and workshops</li>
                      <li>• Blended learning with flexible schedules</li>
                      <li>• Community-focused programs and leadership development</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* How we work */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="card-futuristic p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/2"
            >
              <div className="flex items-start gap-4">
                <Globe className="w-10 h-10 text-cyan-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400">How We Work</h3>
                  <p className="text-gray-300 leading-relaxed">
                    We blend modern technology with effective pedagogy to deliver practical, high-quality
                    continuing education that fits the realities of healthcare work.
                  </p>

                  <ul className="mt-4 space-y-3">
                    {[
                      "Interactive video lessons and case-based scenarios",
                      "Personalized learning paths and progress tracking",
                      "Flexible online modules with hands-on practical sessions",
                      "Standards-aligned content developed by clinical experts",
                    ].map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-yellow-500/90 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <span className="text-gray-300">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Team & Join */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5 }}
              className="card-futuristic p-6 rounded-2xl bg-gradient-to-b from-white/3 to-white/2"
            >
              <div className="flex items-start gap-4">
                <BookOpen className="w-10 h-10 text-rose-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-rose-400">Our Team & Invitation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Our team of educators, clinicians and technologists design courses grounded in practice.
                    Join a network of passionate professionals committed to excellence, innovation and service.
                  </p>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <a
                      href="/courses"
                      className="inline-flex items-center justify-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium"
                    >
                      View Courses
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-5 py-2 border border-white/10 rounded-md text-sm text-gray-200 hover:bg-white/5"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-sm text-gray-400 max-w-3xl mx-auto">
            MOMA — Your future in health begins here. Join a professional community devoted to continual
            improvement and better patient outcomes.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
