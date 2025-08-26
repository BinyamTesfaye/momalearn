import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, Cpu } from "lucide-react";

export default function About() {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen">
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center"></div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass p-10 rounded-3xl max-w-5xl mx-auto shadow-2xl"
        >
          <h2 className="text-5xl font-extrabold mb-12 text-center text-white-100  bg-clip-text">
            About MOMA
          </h2>

          <div className="grid gap-10 md:gap-14">
            {/* Mission */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6 }}
              className="card-futuristic p-6 rounded-2xl"
            >
              <div className="flex items-start gap-5">
                <Heart className="w-10 h-10 text-yellow-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                    Our Mission
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    MOMA E-Learning was founded to make education accessible,
                    engaging, and empowering for learners everywhere. Our goal
                    is to break barriers by delivering high-quality courses that
                    inspire lifelong learning and open new opportunities for
                    students worldwide.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* How we work */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.6 }}
              className="card-futuristic p-6 rounded-2xl"
            >
              <div className="flex items-start gap-5">
                <Cpu className="w-10 h-10 text-orange-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-orange-400">
                    How We Work
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    We combine modern technology with innovative teaching
                    methods to create a smooth and effective online learning
                    experience:
                  </p>
                  <ul className="mt-6 space-y-4">
                    {[
                      "Interactive video lessons with real-world examples",
                      "Personalized learning paths for every student",
                      "Accessible anytime, anywhere on any device",
                      "Progress tracking and instant feedback",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start">
                        <div className="bg-yellow-500/90 w-7 h-7 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
                          {i + 1}
                        </div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Team */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.6 }}
              className="card-futuristic p-6 rounded-2xl"
            >
              <div className="flex items-start gap-5">
                <Users className="w-10 h-10 text-pink-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-pink-400">
                    Our Team
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    The MOMA team is made up of educators, technologists, and
                    creative minds who believe that knowledge should be
                    unlimited. With expertise in online pedagogy, curriculum
                    design, and digital innovation, we are dedicated to helping
                    learners grow and succeed.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
