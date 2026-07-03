"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaArrowRight,
  FaFileInvoice,
  FaGlobe,
  FaLaptopCode,
  FaFilePdf,
  FaRocket,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export default function LandingPage() {
  const router = useRouter();

  const [playgroundData, setPlaygroundData] = useState({
    name: "Alex Morgan",
    title: "Senior Product Designer",
    email: "alex.morgan@vantage.io",
    summary:
      "Passionate product designer with 6+ years of experience crafting high-fidelity design systems and responsive user interfaces for SaaS applications.",
    skills: [
      "Figma",
      "Design Systems",
      "Tailwind CSS",
      "React",
      "UX Research",
      "Prototyping",
    ],
    themeColor: "#6366f1",
  });

  const handlePlaygroundChange = (field: string, value: any) => {
    setPlaygroundData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateNew = () => {
    router.push("/auth/signup");
  };

  const features = [
    {
      icon: <FaFileInvoice className="text-2xl text-indigo-400" />,
      title: "ATS-Ready Templates",
      description:
        "Tested against major parser algorithms to ensure your application gets through automated resume screens seamlessly.",
    },
    {
      icon: <FaGlobe className="text-2xl text-emerald-400" />,
      title: "One-Click Hosted Portfolio",
      description:
        "Instantly deploy your professional experiences into a standalone personal website with a unique, shareable link.",
    },
    {
      icon: <FaFilePdf className="text-2xl text-rose-400" />,
      title: "Interactive PDF Exports",
      description:
        "Generate high-fidelity, print-ready PDF files with active hyperlinks for your contact details, social links, and projects.",
    },
    {
      icon: <FaLaptopCode className="text-2xl text-amber-400" />,
      title: "Side-by-Side Visual Editor",
      description:
        "Edit text details, rearrange sections, and customize layouts with instant live preview reflections side-by-side.",
    },
  ];

  const templates = [
    {
      id: 1,
      name: "Modern Executive",
      desc: "Clean, split layout with emphasis on chronological work history.",
      color: "from-indigo-600 to-blue-500",
      accent: "#4f46e5",
    },
    {
      id: 2,
      name: "Minimalist Clean",
      desc: "An elegant, typographic template perfect for designers and developers.",
      color: "from-slate-700 to-slate-900",
      accent: "#1e293b",
    },
    {
      id: 3,
      name: "Creative Developer",
      desc: "Vibrant layout with interactive skill badges and project focuses.",
      color: "from-violet-600 to-fuchsia-600",
      accent: "#7c3aed",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/4 right-1/4 w-125 h-125 bg-violet-600/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[60%] left-10 w-80 h-80 bg-fuchsia-600/5 rounded-full blur-3xl -z-10" />

      <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="font-extrabold text-white text-lg">V</span>
              </div>
              <span className="text-xl font-bold tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Vantage
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
                Features
              </a>
              <a href="#demo" className="hover:text-white transition-colors">
                Interactive Demo
              </a>
              <a
                href="#templates"
                className="hover:text-white transition-colors"
              >
                Templates
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/auth"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-wide">
                <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                Vantage Resume Engine v1.0
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Craft the Career Narrative{" "}
                <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  You Deserve.
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Build recruiter-approved, ATS-optimized professional resumes and
                deploy stunning personal portfolios in seconds. Empower your
                career transition with Vantage.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleCreateNew}
                  className="w-full sm:w-auto bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                >
                  Build Your Resume
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="#demo"
                  className="w-full sm:w-auto text-center border border-slate-800 bg-slate-950/40 backdrop-blur-xl hover:bg-slate-900 hover:border-slate-700 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  Live Preview
                </a>
              </div>
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Free online hosting
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  No credit card required
                </div>
              </div>
            </div>

            {/* Hero Mockup / Dashboard Preview */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-2xl backdrop-blur-md">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-500/20 blur-md rounded-full" />

                {/* Mockup Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono tracking-wider">
                    vantage-editor-preview.app
                  </div>
                  <div className="w-4" />
                </div>

                {/* Dashboard Screenshot Mockup */}
                <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-900 p-2 sm:p-4">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Left Builder Column */}
                    <div className="col-span-5 space-y-3">
                      <div className="h-6 w-3/4 bg-slate-800 rounded animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-8 bg-slate-800/60 rounded border border-slate-850" />
                        <div className="h-8 bg-slate-800/60 rounded border border-slate-850" />
                        <div className="h-16 bg-slate-800/60 rounded border border-slate-850" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 w-12 bg-indigo-600/30 rounded border border-indigo-500/20" />
                        <div className="h-6 w-16 bg-slate-800 rounded" />
                      </div>
                    </div>
                    {/* Right Document Column */}
                    <div className="col-span-7 bg-white text-slate-900 rounded p-4 shadow-lg min-h-55 flex flex-col justify-between">
                      <div>
                        <div className="h-4 w-1/2 bg-slate-900 rounded mb-1" />
                        <div className="h-2 w-1/3 bg-slate-400 rounded mb-4" />
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-slate-200 rounded" />
                          <div className="h-1.5 w-full bg-slate-200 rounded" />
                          <div className="h-1.5 w-5/6 bg-slate-200 rounded" />
                        </div>
                      </div>
                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                        <div className="flex gap-1">
                          <div className="h-3 w-8 bg-slate-200 rounded-full" />
                          <div className="h-3 w-8 bg-slate-200 rounded-full" />
                        </div>
                        <div className="h-3.5 w-12 bg-indigo-600 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-xl flex items-center gap-3 backdrop-blur-xl animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <FaRocket className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">
                      Export Ready
                    </div>
                    <div className="text-sm font-bold text-white">
                      ATS Score: 98%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section
        id="features"
        className="py-20 border-t border-slate-900 bg-slate-950/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
              Robust Feature Set
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Professional Excellence.
            </p>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Vantage gives you the utilities to build a flawless resume, export
              instantly, and share a premium hosted portfolio URL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-xl hover:border-slate-800/80 hover:bg-slate-900/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Builder Playground Section */}
      <section
        id="demo"
        className="py-20 border-t border-slate-900 bg-slate-950/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-xs font-bold tracking-widest text-violet-400 uppercase">
              Interactive Editor Playground
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Test Drive Vantage in Real Time
            </p>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Try editing the input values in the dashboard mock below to see
              the interactive resume preview adjust instantly.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Playbook Inputs */}
              <div className="lg:col-span-5 space-y-5 flex flex-col justify-center">
                <div className="border-b border-slate-900 pb-3">
                  <h3 className="text-lg font-bold text-white">
                    Playground Editor
                  </h3>
                  <p className="text-xs text-slate-500">
                    Edit fields to see live rendering updates on the right.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={playgroundData.name}
                      onChange={(e) =>
                        handlePlaygroundChange("name", e.target.value)
                      }
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/80 transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={playgroundData.title}
                      onChange={(e) =>
                        handlePlaygroundChange("title", e.target.value)
                      }
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/80 transition-colors"
                      placeholder="Full Stack Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Profile Summary
                    </label>
                    <textarea
                      value={playgroundData.summary}
                      onChange={(e) =>
                        handlePlaygroundChange("summary", e.target.value)
                      }
                      rows={3}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/80 transition-colors resize-none text-xs leading-relaxed"
                      placeholder="Brief description about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Theme Color
                    </label>
                    <div className="flex gap-3 pt-1">
                      {[
                        "#6366f1",
                        "#10b981",
                        "#ef4444",
                        "#ec4899",
                        "#f59e0b",
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            handlePlaygroundChange("themeColor", color)
                          }
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            playgroundData.themeColor === color
                              ? "border-white scale-110"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCreateNew}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-2"
                  >
                    Save & Create Account
                    <FaArrowRight className="text-[10px]" />
                  </button>
                </div>
              </div>

              {/* Right Live Resume Preview Sheet */}
              <div className="lg:col-span-7 bg-slate-900/40 border border-slate-850 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-inner">
                {/* Virtual Sheet */}
                <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-xl min-h-95 flex flex-col justify-between transition-all duration-300">
                  <div className="space-y-4">
                    <div
                      className="border-b-2 pb-4"
                      style={{ borderColor: playgroundData.themeColor + "1a" }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-2xl font-bold tracking-tight text-slate-900 transition-all">
                            {playgroundData.name || "Untitled Name"}
                          </h4>
                          <p
                            className="text-sm font-semibold mt-0.5 transition-all"
                            style={{ color: playgroundData.themeColor }}
                          >
                            {playgroundData.title || "No Title Set"}
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono text-right">
                          <p>{playgroundData.email}</p>
                          <p>San Francisco, CA</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Professional Summary
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed transition-all">
                        {playgroundData.summary ||
                          "No professional summary added yet. Write one in the editor panel."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Recent Experience
                      </h5>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-900">
                          <span>Senior Interface Architect</span>
                          <span className="text-slate-500">2023 – Present</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          Vantage Career Systems
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Led architectural rebuild of client-side builder
                          dashboard increasing load performance by 40%.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Technical Skills
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {playgroundData.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: playgroundData.themeColor + "15",
                              color: playgroundData.themeColor,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Generated via Vantage Resume Builder</span>
                    <span
                      className="font-bold uppercase tracking-wider"
                      style={{ color: playgroundData.themeColor }}
                    >
                      A4 Format
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section
        id="templates"
        className="py-20 border-t border-slate-900 bg-slate-950/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Modern Templates
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Curated for Maximum Professional Impact
            </p>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Explore our selection of designs created in collaboration with HR
              professionals. Swappable with a single click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group bg-slate-900/30 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Color Block representing template design layout */}
                <div
                  className={`h-48 bg-linear-to-br ${tpl.color} p-6 flex flex-col justify-between relative`}
                >
                  <div className="absolute inset-0 bg-slate-950/10 mix-blend-overlay" />
                  <div className="flex justify-between items-start">
                    <span className="bg-slate-900/60 backdrop-blur-md text-[10px] text-slate-200 px-2 py-0.5 rounded-full font-mono">
                      Template 0{tpl.id}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  </div>

                  {/* Visual Structure Indicator */}
                  <div className="space-y-1 bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                    <div className="h-1.5 w-1/2 bg-white/70 rounded" />
                    <div className="h-1 w-3/4 bg-white/40 rounded" />
                    <div className="h-1 w-full bg-white/40 rounded" />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {tpl.desc}
                    </p>
                  </div>
                  <button
                    onClick={handleCreateNew}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs font-semibold py-2.5 rounded-xl transition-colors hover:text-white"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 border-t border-slate-900 relative overflow-hidden bg-slate-950/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-indigo-600/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to secure your next <br className="hidden sm:inline" />
            career breakthrough?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Create your account today and build a premium, print-perfect resume
            alongside an online portfolio absolutely free.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleCreateNew}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
            >
              Get Started for Free
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="font-extrabold text-white text-sm">V</span>
              </div>
              <span className="text-lg font-bold text-white">Vantage</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8 text-xs text-slate-500">
              <a
                href="#features"
                className="hover:text-slate-300 transition-colors"
              >
                Features
              </a>
              <a
                href="#demo"
                className="hover:text-slate-300 transition-colors"
              >
                Interactive Demo
              </a>
              <a
                href="#templates"
                className="hover:text-slate-300 transition-colors"
              >
                Templates
              </a>
              <span className="text-slate-700">|</span>
              <span>
                © {new Date().getFullYear()} Vantage. All rights reserved.
              </span>
            </div>

            {/* Socials */}
            <div className="flex gap-4 text-slate-500">
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
