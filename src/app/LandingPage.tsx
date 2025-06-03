/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { LuWand2, LuDownload, LuImagePlus, LuZap } from "react-icons/lu";
import Link from "next/link";
import Image from "next/image";
import TypeEffect from "./components/Typeeffect";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-gray-900 bg-white">
      {/* Navigation */}
      <nav className="glass-effect py-5 px-8 flex justify-between items-center fixed w-full z-10">
        <div className="font-bold text-2xl">
          <span className="text-gradient-animated">Prodia</span><span className="font-light">Studio</span>
        </div>
        <div className="flex gap-8">
          <Link href="/" className="text-gray-800 font-medium hover:text-indigo-600 transition-all">
            Home
          </Link>
          <Link href="/generate" className="text-gray-800 font-medium hover:text-indigo-600 transition-all">
            Create
          </Link>
          <Link href="/generated" className="text-gray-800 font-medium hover:text-indigo-600 transition-all">
            Gallery
          </Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-indigo-50 rounded-full">
              <span className="text-indigo-600 font-medium text-sm">AI-Powered Image Studio</span>
            </div>
            <h1 className="text-6xl font-bold leading-tight tracking-tight text-gray-900">
              <TypeEffect
                textArray={[
                  "Transform Ideas into Art",
                  "Design with Intelligence",
                  "Create Visual Excellence",
                ]}
                typingSpeed={100}
                delay={3000}
              />
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Create stunning visuals with state-of-the-art AI. From concept to creation in seconds, no design experience required.
            </p>
            <div className="flex flex-wrap gap-5 pt-2">
              <Link
                href="/generate"
                className="inline-flex items-center gradient-bg text-white font-medium py-3.5 px-8 rounded-lg transition-transform hover:scale-105 shadow-md"
              >
                <LuWand2 className="mr-2.5" /> Start Creating
              </Link>
              <Link
                href="/generated"
                className="inline-flex items-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium py-3 px-6 rounded-md transition-colors"
              >
                <LuImagePlus className="mr-2" /> View Gallery
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative">
              <Image
                src="/a2bf8e95-83b9-4846-9774-d2cbe60b6185.png"
                alt="AI Generated Example"
                width={500}
                height={500}
                className="rounded-2xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Professional Image Generation</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Leverage advanced AI algorithms to create stunning visuals for your projects.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <LuWand2 className="text-2xl text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Precision Generation</h3>
              <p className="text-slate-600">
                Create highly detailed images with precise text prompts for your specific creative needs.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                <LuZap className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Results</h3>
              <p className="text-slate-600">
                View generated images within seconds, streamlining your creative workflow.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-5">
                <LuImagePlus className="text-2xl text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Style Versatility</h3>
              <p className="text-slate-600">
                Generate images across multiple styles and aesthetics to match your project needs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-5">
                <LuDownload className="text-2xl text-violet-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Export Options</h3>
              <p className="text-slate-600">
                Download high-resolution images ready for immediate use in your projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Gallery Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Gallery Showcase</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Explore a selection of professionally generated AI images</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative overflow-hidden rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <Image
                src="/1b5db476-c688-48c3-9b47-53ad6273f77b.png"
                alt="AI Generated Image 1"
                width={400}
                height={400}
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white font-medium">Artistic Interpretation</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <Image
                src="/204313f9-cbb7-4b27-a1bf-b3bb4fc0e245.png"
                alt="AI Generated Image 2"
                width={400}
                height={400}
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white font-medium">Digital Landscape</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <Image
                src="/73764974-a8fc-44e1-ba46-84e2324ef8b7.png"
                alt="AI Generated Image 3"
                width={400}
                height={400}
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white font-medium">Abstract Concept</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <Image
                src="/a2bf8e95-83b9-4846-9774-d2cbe60b6185.png"
                alt="AI Generated Image 4"
                width={400}
                height={400}
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white font-medium">Creative Visualization</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/generate"
              className="inline-flex items-center bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Add styles for the blob animation
const styles = `
@keyframes blob {
  0% { transform: scale(1); }
  33% { transform: scale(1.1); }
  66% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`;

// You can add the styles to a style tag in your document
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

export default LandingPage;
