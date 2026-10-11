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

      {/* Unified Responsive Container — Single video element */}
      <div className="sticky top-[80px] h-[calc(100vh-80px)] w-full bg-white dark:bg-zinc-950 flex flex-col md:flex-row items-center justify-center md:justify-start overflow-hidden px-4 md:px-0 md:pl-8 gap-6 md:gap-0">
        
        {/* VIDEO — Shrinks on scroll, single video for desktop and mobile */}
        <motion.div
          style={{
            width: typeof window !== "undefined" && window.innerWidth < 768 ? mobileVideoWidth : videoWidth,
            borderRadius: typeof window !== "undefined" && window.innerWidth < 768 ? mobileBorderRadius : borderRadius,
          }}
          className="relative h-[42vh] md:h-[75vh] w-full md:w-auto overflow-hidden flex-shrink-0 shadow-xl"
        >
          <video
            ref={videoRef}
            src="/2nd-vid.mp4"
            preload="metadata"
            autoPlay
            muted
            playsInline
            loop
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover bg-zinc-950"
          />
        </motion.div>

        {/* TEXT CONTENT — Responsive position and typography */}
        <motion.div
          style={{
            opacity: typeof window !== "undefined" && window.innerWidth < 768 ? mobileTextOpacity : textOpacity,
            x: typeof window !== "undefined" && window.innerWidth >= 768 ? textX : 0,
            y: typeof window !== "undefined" && window.innerWidth < 768 ? mobileTextY : 0,
          }}
          className="flex flex-col items-center md:items-start text-center md:text-left gap-3 md:gap-5 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:pr-[7vw] md:pl-6 w-full md:w-[46%] md:max-w-[500px]"
        >
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#1bc2cd]">
            What We Do
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
            We Turn Ideas Into<br className="hidden md:inline" /> Business Solutions.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-sm md:max-w-none">
            From startups to established companies — we engineer scalable software that drives real business growth.
          </p>
          <div className="mt-1">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-[#1bc2cd] hover:bg-[#15aab4] text-white font-bold text-xs md:text-sm transition-colors shadow-lg shadow-[#1bc2cd]/30"
            >
              Our Services
            </Link>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
