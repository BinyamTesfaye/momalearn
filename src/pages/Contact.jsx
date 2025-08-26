import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";


export default function Contact() {
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
          <h2 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-primary to-accent bg-clip-text">
            Contact Moma
          </h2>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6 }}
              className="card-futuristic p-6 rounded-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-primary">Get In Touch</h3>
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <textarea
                    rows="5"
                    className="w-full bg-dark/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <button className="btn-futuristic w-full">Send Message</button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.6 }}
              className="card-futuristic p-6 rounded-2xl space-y-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-secondary">Reach Us</h3>

              <div className="space-y-6 text-gray-300">
                <div className="flex items-center gap-4">
                  <MapPin className="w-7 h-7 text-secondary shrink-0" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-7 h-7 text-secondary shrink-0" />
                  <span>+251 912 345 678</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-7 h-7 text-secondary shrink-0" />
                  <span>info@moma.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-7 h-7 text-secondary shrink-0" />
                  <span>Support: 24/7</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4 text-accent">Follow Us</h4>
               <div className="flex space-x-4">
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-800 hover:bg-primary w-12 h-12 rounded-full flex items-center justify-center transition-colors"
  >
    <Facebook className="w-6 h-6 text-white" />
  </a>
  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-800 hover:bg-primary w-12 h-12 rounded-full flex items-center justify-center transition-colors"
  >
    <Twitter className="w-6 h-6 text-white" />
  </a>
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-800 hover:bg-primary w-12 h-12 rounded-full flex items-center justify-center transition-colors"
  >
    <Instagram className="w-6 h-6 text-white" />
  </a>
  <a
    href="https://linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-800 hover:bg-primary w-12 h-12 rounded-full flex items-center justify-center transition-colors"
  >
    <Linkedin className="w-6 h-6 text-white" />
  </a>
</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
