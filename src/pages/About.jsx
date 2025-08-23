import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="glass p-8 rounded-3xl max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          About Erteban
        </h1>
        
        <div className="space-y-6">
          <div className="card-futuristic">
            <div className="card-content">
              <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                Erteban was founded with a singular vision: to create a transparent bridge between compassionate donors 
                and communities in need. Using blockchain technology and AI-powered verification systems, we ensure that 
                every donation creates maximum impact with zero waste.
              </p>
            </div>
          </div>
          
          <div className="card-futuristic">
            <div className="card-content">
              <h2 className="text-2xl font-bold mb-4 text-secondary">How We Work</h2>
              <p className="text-gray-300 leading-relaxed">
                Our platform combines cutting-edge technology with humanitarian principles to deliver aid efficiently:
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <div className="bg-primary w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">1</span>
                  </div>
                  <span>AI verifies campaign authenticity</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">2</span>
                  </div>
                  <span>Blockchain tracks every dollar</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">3</span>
                  </div>
                  <span>Smart contracts automate distribution</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-xs">4</span>
                  </div>
                  <span>Real-time impact reporting</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="card-futuristic">
            <div className="card-content">
              <h2 className="text-2xl font-bold mb-4 text-accent">Our Team</h2>
              <p className="text-gray-300 leading-relaxed">
                We're a diverse team of technologists, humanitarian workers, and financial experts united by our 
                commitment to creating a more equitable world. With decades of combined experience in crisis response 
                and technology innovation, we've built a platform that redefines charitable giving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}