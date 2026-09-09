"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";

export default function StickyVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // Desktop transforms
  const videoWidth = useTransform(smoothProgress, [0, 0.3], ["100%", "52%"]);
  const borderRadius = useTransform(smoothProgress, [0.03, 0.3], [0, 20]);
  const textOpacity = useTransform(smoothProgress, [0.2, 0.35], [0, 1]);
  const textX = useTransform(smoothProgress, [0.2, 0.35], [50, 0]);

  // Mobile transforms
  const mobileVideoWidth = useTransform(smoothProgress, [0, 0.3], ["100%", "88%"]);
  const mobileBorderRadius = useTransform(smoothProgress, [0.05, 0.3], [0, 16]);
  const mobileTextOpacity = useTransform(smoothProgress, [0.2, 0.38], [0, 1]);
  const mobileTextY = useTransform(smoothProgress, [0.2, 0.38], [30, 0]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 5) {
      videoRef.current.currentTime = 0;
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Suppress browser power-saving or interrupted playback errors
          });
        }
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] bg-white dark:bg-zinc-950"
    >

      {/* -- DESKTOP LAYOUT -- */}
      <div className="hidden md:flex sticky top-[80px] h-[calc(100vh-80px)] w-full bg-white dark:bg-zinc-950 items-center overflow-hidden pl-8">

        {/* VIDEO — shrinks from full-width, stays left-aligned */}
        <motion.div
          style={{ width: videoWidth, borderRadius }}
          className="relative h-[75vh] overflow-hidden flex-shrink-0 shadow-xl"
        >
          <video
            ref={videoRef}
            src="/2nd-vid.mp4"
            preload="auto"
            autoPlay
            muted
            playsInline
            loop
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover bg-zinc-950"
          />
        </motion.div>

        {/* TEXT — appears on the right as video shrinks */}
        <motion.div
          style={{ opacity: textOpacity, x: textX }}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-5 pr-[7vw] pl-6 w-[46%] max-w-[500px]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1bc2cd]">
            What We Do
          </p>
          <h2 className="text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
            We Turn Ideas Into<br />Business Solutions.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            From startups to enterprises — we engineer scalable software that drives real growth, not just lines of code.
          </p>
          <div className="mt-1">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#1bc2cd] hover:bg-[#15aab4] text-white font-bold text-sm transition-colors shadow-lg shadow-[#1bc2cd]/30"
            >
              Our Services
            </Link>
          </div>
        </motion.div>
      </div>

      {/* -- MOBILE LAYOUT — stacked: video on top, text below -- */}
      <div className="md:hidden sticky top-[80px] h-[calc(100vh-80px)] w-full bg-white dark:bg-zinc-950 flex flex-col items-center justify-center gap-6 overflow-hidden px-4">

        {/* VIDEO */}
        <motion.div
          style={{ width: mobileVideoWidth, borderRadius: mobileBorderRadius }}
          className="w-full overflow-hidden flex-shrink-0 shadow-xl"
        >
          <div className="relative" style={{ height: "45vh" }}>
            <video
              src="/2nd-vid.mp4"
              preload="auto"
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full object-cover bg-zinc-950"
            />
          </div>
        </motion.div>

        {/* TEXT — below video */}
        <motion.div
          style={{ opacity: mobileTextOpacity, y: mobileTextY }}
          className="flex flex-col items-center text-center gap-3 px-2"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1bc2cd]">
            What We Do
          </p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
            We Turn Ideas Into Business Solutions.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
            Scalable software that drives real growth — from startups to enterprises.
          </p>
          <Link
            href="/services"
            className="mt-1 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#1bc2cd] hover:bg-[#15aab4] text-white font-bold text-xs transition-colors shadow-lg shadow-[#1bc2cd]/30"
          >
            Our Services
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
