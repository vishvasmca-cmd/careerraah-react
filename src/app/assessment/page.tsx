import Link from 'next/link';
import { GraduationCap, MapPin, Building2, Landmark } from 'lucide-react';

export default function AssessmentSelection() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">

      {/* Headlines */}
      <div className="text-center mb-12 max-w-2xl">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Start Here
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3">
          Let's Build Your Roadmap 🗺️
        </h1>
        <p className="text-gray-500">
          To give you the best advice, tell us which path you are interested in.
        </p>
      </div>

      {/* The Two Doors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">

        {/* DOOR 1: English / Global / Private */}
        <Link href="/assessment/english" className="group relative bg-white border-2 border-gray-100 hover:border-blue-600 rounded-2xl p-8 transition-all hover:shadow-xl flex flex-col items-center text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-6 group-hover:scale-110 transition">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Private Jobs / Corporate</h3>
          <p className="text-sm text-gray-500 mb-6">
            Focus on Engineering (B.Tech), MBA, Startups, Study Abroad & Corporate Careers.
          </p>
          <span className="text-blue-600 font-semibold text-sm group-hover:underline">
            Start Global Assessment &rarr;
          </span>
        </Link>

        {/* DOOR 2: Hindi / State Board / Government */}
        <Link href="/assessment/hindi" className="group relative bg-orange-50 border-2 border-orange-100 hover:border-orange-600 rounded-2xl p-8 transition-all hover:shadow-xl flex flex-col items-center text-center">
          {/* Badge */}
          <div className="absolute top-4 right-4 bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-1 rounded">
            RECOMMENDED
          </div>

          <div className="bg-orange-100 p-4 rounded-full mb-6 group-hover:scale-110 transition">
            <Landmark className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sarkari Naukri / Govt Jobs</h3>
          <p className="text-sm text-gray-600 mb-6 font-medium">
            Railway, Police, SSC, Army, Banking & State Exams ke liye roadmap.
          </p>
          <span className="inline-block bg-orange-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-orange-700 transition">
            शुरू करें (Start) &rarr;
          </span>
        </Link>

      </div>

      <p className="mt-10 text-sm text-gray-400">
        Not sure? <a href="/chat" className="underline hover:text-blue-600">Ask AI Didi</a>
      </p>

    </div>
  );
}
