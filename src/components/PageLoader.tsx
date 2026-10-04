"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────
   NProgress-style top bar — the ONLY route-change indicator.
   Zero overlay. Zero blur. Just a 2px line at the very top.
   Exactly how Vercel, Linear, and GitHub do it.
───────────────────────────────────────────────────────────────── */
function TopBar({ active }: { active: boolean }) {
  const [pct, setPct] = useState(0);
  const raf = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      setPct(0);
      raf.current = setInterval(() => {
        setPct((p) => {
          if (p >= 90) return p;
          const increment = p < 40 ? 12 : p < 70 ? 5 : 1.5;
          return Math.min(p + increment, 90);
        });
      }, 80);
    } else {
      clearInterval(raf.current!);
      setPct(100);
    }
    return () => clearInterval(raf.current!);
  }, [active]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [show, setShow] = useState(false);
  useEffect(() => {
    if (active) { setShow(true); return; }
    const t = setTimeout(() => { setShow(false); setPct(0); }, 400);
    return () => clearTimeout(t);
  }, [active]);

  if (!mounted || !show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none">
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%)",
          transition: pct === 100
            ? "width 180ms linear, opacity 250ms ease 180ms"
            : "width 100ms ease-out",
          opacity: pct === 100 ? 0 : 1,
          boxShadow: "0 0 8px 0 rgba(99,102,241,0.7)",
          borderRadius: "0 1px 1px 0",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Initial splash — shown ONCE on first page load.
   Exits as soon as page is interactive via requestIdleCallback.
───────────────────────────────────────────────────────────────── */
function Splash({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);
  const done = useRef(false);

  const exit = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setExiting(true);
    setTimeout(onDone, 380);
  }, [onDone]);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      // Slower progress to make it visible for at least 1 second
      const natural = Math.min(80, (elapsed / 800) * 100);
      setPct(natural);
      if (natural < 80) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onIdle = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, 800 - elapsed); // Enforce at least 800ms wait
      
      setTimeout(() => {
        setPct(100);
        setTimeout(exit, 150);
      }, remaining);
    };

    let idleCb: number | undefined;
    const fallback = setTimeout(onIdle, 1200);

    if (typeof requestIdleCallback !== "undefined") {
      idleCb = requestIdleCallback(onIdle, { timeout: 1200 });
    }

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      if (idleCb !== undefined) cancelIdleCallback(idleCb);
    };
  }, [exit]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--splash-bg, #fff)",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.015)" : "scale(1)",
        transition: exiting
          ? "opacity 360ms cubic-bezier(0.4,0,1,1), transform 360ms cubic-bezier(0.4,0,1,1)"
          : "none",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      <style>{`
        :root { --splash-bg: #ffffff; }
        .dark { --splash-bg: #09090b; }
        @keyframes splashEnter {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.75; }
          50%       { opacity: 1; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          animation: "splashEnter 280ms cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: "relative",
            width: 52,
            height: 52,
            animation: "pulseOpacity 2.4s ease-in-out infinite",
          }}
        >
          <Image
            src="/logo.png"
            alt="SAMStack"
            fill
            priority
            sizes="52px"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 224,
            height: 1.5,
            background: "rgba(100,116,139,0.12)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #6366f1, #0ea5e9)",
              borderRadius: 999,
              transition: pct < 80
                ? "width 80ms linear"
                : "width 180ms cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Master component — mount once in root layout inside <Suspense>
───────────────────────────────────────────────────────────────── */
export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [splashKey, setSplashKey] = useState(0);
  const [splash, setSplash] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (prevPath.current === null) { prevPath.current = current; return; }
    if (prevPath.current === current) return;

    prevPath.current = current;
    setRouteLoading(true);
    
    // Trigger splash screen on every route change
    setSplashKey(k => k + 1);
    setSplash(true);

    const t = setTimeout(() => setRouteLoading(false), 600);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  return (
    <>
      <TopBar active={routeLoading} />
      {splash && <Splash key={splashKey} onDone={() => setSplash(false)} />}
    </>
  );
}
