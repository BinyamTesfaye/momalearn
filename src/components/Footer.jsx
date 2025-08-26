import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

// Import your logo image
import logo from '../assets/momalogo.png';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Erteban Logo" 
                className="h-12 w-auto mr-3" 
              />
              <span className="text-2xl font-bold text-white">Moma</span>
            </div>
            <p className="text-gray-400 max-w-xs">
              We are here to help you to connect your heart to the poor
            </p>
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
          </div>
          
          {/* Column 2: About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">About</h3>
            <p className="text-gray-400 max-w-xs">
                          Moma empowers learners with practical courses, expert guidance, and flexible learning to unlock opportunities and succeed.

            </p>
          </div>
          
          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Campaigns', path: '/campaigns' },
                { name: 'Contact', path: '/contact' },
                { name: 'Donate', path: '/donate' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>Addis Ababa,Ethiopia</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span> +251 900000000</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>info@Moma.com</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mt-1 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>24/7 Support</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()}  Moma Education. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {['Terms of Service', 'Privacy Policy', 'FAQ', 'Sitemap'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-500 hover:text-blue-500 transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}