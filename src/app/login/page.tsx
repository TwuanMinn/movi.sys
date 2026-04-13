"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DEMO_ACCOUNTS,
  ROLE_META,
  setDemoSession,
  type DemoUser,
  type DemoRole,
} from "@/lib/demo-auth";

const LaserFlow = dynamic(() => import("@/components/LaserFlow"), { ssr: false });
const SoftAurora = dynamic(() => import("@/components/SoftAurora"), { ssr: false });
const MagicRings = dynamic(() => import("@/components/MagicRings"), { ssr: false });
const LiquidEther = dynamic(() => import("@/components/LiquidEther"), { ssr: false });
const PixelBlast = dynamic(() => import("@/components/PixelBlast"), { ssr: false });
const EvilEye = dynamic(() => import("@/components/EvilEye"), { ssr: false });
const GradientBlinds = dynamic(() => import("@/components/GradientBlinds"), { ssr: false });
const GridScan = dynamic(() => import("@/components/GridScan").then(m => ({ default: m.GridScan })), { ssr: false });
const Hyperspeed = dynamic(() => import("@/components/Hyperspeed"), { ssr: false });
const GridDistortion = dynamic(() => import("@/components/GridDistortion"), { ssr: false });
const Ballpit = dynamic(() => import("@/components/Ballpit"), { ssr: false });
const LetterGlitch = dynamic(() => import("@/components/LetterGlitch"), { ssr: false });
const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false });
const Lightning = dynamic(() => import("@/components/Lightning"), { ssr: false });
const AuroraBg = dynamic(() => import("@/components/Aurora"), { ssr: false });
const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });
const DotGrid = dynamic(() => import("@/components/DotGrid"), { ssr: false });
const LightPillar = dynamic(() => import("@/components/LightPillar"), { ssr: false });
const HackerBackground = dynamic(() => import("@/components/ui/hacker-background").then(m => ({ default: m.HackerBackground })), { ssr: false });

type BgMode = "aurora" | "laser" | "rings" | "ether" | "pixel" | "eye" | "blinds" | "grid" | "hyper" | "distort" | "balls" | "glitch" | "galaxy" | "lightning" | "aurorabg" | "dither" | "dots" | "pillar" | "hacker";

const BG_OPTIONS: { key: BgMode; label: string; icon: string; color: string }[] = [
  { key: "aurora", label: "Aurora", icon: "cloud", color: "#BD93F9" },
  { key: "laser", label: "Laser", icon: "electric_bolt", color: "#FF79C6" },
  { key: "rings", label: "Rings", icon: "radio_button_unchecked", color: "#50FA7B" },
  { key: "ether", label: "Ether", icon: "water", color: "#8BE9FD" },
  { key: "pixel", label: "Pixel", icon: "grid_view", color: "#FFB86C" },
  { key: "eye", label: "Eye", icon: "visibility", color: "#FF6F37" },
  { key: "blinds", label: "Blinds", icon: "blinds", color: "#FF9FFC" },
  { key: "grid", label: "Grid", icon: "apps", color: "#F1FA8C" },
  { key: "hyper", label: "Hyper", icon: "rocket_launch", color: "#FF5555" },
  { key: "distort", label: "Distort", icon: "blur_on", color: "#44475A" },
  { key: "balls", label: "Balls", icon: "sports_baseball", color: "#F8F8F2" },
  { key: "glitch", label: "Glitch", icon: "terminal", color: "#50FA7B" },
  { key: "galaxy", label: "Galaxy", icon: "auto_awesome", color: "#CAA9FA" },
  { key: "lightning", label: "Bolt", icon: "flash_on", color: "#F1FA8C" },
  { key: "aurorabg", label: "Aurora", icon: "flare", color: "#BD93F9" },
  { key: "dither", label: "Dither", icon: "grain", color: "#FFB86C" },
  { key: "dots", label: "Dots", icon: "blur_circular", color: "#FF79C6" },
  { key: "pillar", label: "Pillar", icon: "light_mode", color: "#8BE9FD" },
  { key: "hacker", label: "Hacker", icon: "code_blocks", color: "#50FA7B" },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState<string | null>(null);
  const [bgMode, setBgMode] = useState<BgMode>("aurora");
  const [bgOpen, setBgOpen] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const [swapped, setSwapped] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bgRef.current && !bgRef.current.contains(e.target as Node)) setBgOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Password form state */
  const [pwEmail, setPwEmail] = useState("");
  const [pwOld, setPwOld] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleDemoSignIn = (user: DemoUser) => {
    setSigningIn(user.id);
    setDemoSession(user);
    setTimeout(() => router.push(callbackUrl), 300);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwNew !== pwConfirm) { setPwStatus("error"); return; }
    setPwStatus("loading");
    setTimeout(() => {
      setPwStatus("success");
      setTimeout(() => { setPwStatus("idle"); setPwOld(""); setPwNew(""); setPwConfirm(""); }, 2000);
    }, 1200);
  };

  /* ═══════════════════════════════════════════
     LOGIN PANEL — role cards + SSO
     ═══════════════════════════════════════════ */
  const loginPanel = (
    <div className="flex flex-col justify-center h-full">
      <div className="text-center mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold text-white mb-1.5">
          Studio Access Portal
        </h1>
        <p className="text-white/35 text-[11px] md:text-xs">Select a role to enter the production environment.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
        {DEMO_ACCOUNTS.map((account, i) => {
          const meta = ROLE_META[account.role as DemoRole];
          const isLoading = signingIn === account.id;
          const isHovered = hoveredRole === account.id;
          return (
            <motion.button
              key={account.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
              onMouseEnter={() => setHoveredRole(account.id)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleDemoSignIn(account)}
              disabled={!!signingIn}
              className="group relative flex flex-col items-center gap-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 text-center disabled:opacity-50 overflow-hidden"
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 20px ${meta.color}10`, border: `1px solid ${meta.color}20` }} />
                )}
              </AnimatePresence>
              <div className="relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${meta.color}14` }}>
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: meta.color }}>progress_activity</span>
                  </motion.div>
                ) : (
                  <span className="material-symbols-outlined text-[16px]" style={{ color: meta.color }}>{meta.icon}</span>
                )}
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-semibold text-white capitalize leading-tight">{account.role.replace(/_/g, " ")}</p>
                <p className="text-[8px] text-white/25 mt-0.5">{account.name}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
        <div className="relative flex justify-center text-[9px]">
          <span className="bg-[#0c0816] px-4 text-white/20 tracking-wider uppercase font-medium">production SSO</span>
        </div>
      </div>

      {/* Google SSO */}
      <button onClick={() => signIn.social({ provider: "google", callbackURL: callbackUrl })}
        className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-white transition-all hover:border-[#FF79C6]/30 hover:bg-white/[0.06]">
        <svg className="h-3.5 w-3.5 relative z-10" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        <span className="relative z-10 text-[11px] tracking-wide">Continue with Google</span>
      </button>
    </div>
  );

  /* ═══════════════════════════════════════════
     PASSWORD PANEL — change password form
     ═══════════════════════════════════════════ */
  const passwordPanel = (
    <div className="flex flex-col justify-center h-full">
      <div className="text-center mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF79C6]/15 to-[#BD93F9]/10 border border-white/[0.06] flex items-center justify-center mx-auto mb-2">
          <span className="material-symbols-outlined text-[20px] text-[#FF79C6]">shield_lock</span>
        </div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-white mb-1">
          Change Password
        </h2>
        <p className="text-white/35 text-[10px]">Update your studio account credentials.</p>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-2.5">
        {/* Email */}
        <div>
          <label className="block text-[9px] uppercase tracking-wider text-white/25 font-semibold mb-1">Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[14px] text-white/15">mail</span>
            <input type="email" value={pwEmail} onChange={(e) => setPwEmail(e.target.value)} placeholder="you@cineforge.com" required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/15 outline-none focus:border-[#FF79C6]/30 transition-all" />
          </div>
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-[9px] uppercase tracking-wider text-white/25 font-semibold mb-1">Current Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[14px] text-white/15">lock</span>
            <input type={showOld ? "text" : "password"} value={pwOld} onChange={(e) => setPwOld(e.target.value)} placeholder="••••••••" required
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2 pl-9 pr-9 text-xs text-white placeholder:text-white/15 outline-none focus:border-[#FF79C6]/30 transition-all" />
            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors">
              <span className="material-symbols-outlined text-[14px]">{showOld ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-[9px] uppercase tracking-wider text-white/25 font-semibold mb-1">New Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[14px] text-white/15">key</span>
            <input type={showNew ? "text" : "password"} value={pwNew} onChange={(e) => setPwNew(e.target.value)} placeholder="••••••••" required minLength={8}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2 pl-9 pr-9 text-xs text-white placeholder:text-white/15 outline-none focus:border-[#FF79C6]/30 transition-all" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 transition-colors">
              <span className="material-symbols-outlined text-[14px]">{showNew ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label className="block text-[9px] uppercase tracking-wider text-white/25 font-semibold mb-1">Confirm Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[14px] text-white/15">key</span>
            <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} placeholder="••••••••" required minLength={8}
              className={`w-full bg-white/[0.03] border rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/15 outline-none transition-all ${
                pwConfirm && pwNew !== pwConfirm ? "border-red-500/40" : "border-white/[0.08] focus:border-[#FF79C6]/30"
              }`} />
          </div>
          {pwConfirm && pwNew !== pwConfirm && (
            <p className="text-[9px] text-red-400/70 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px]">error</span>Passwords don&apos;t match
            </p>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={pwStatus === "loading" || pwStatus === "success"}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all mt-1 ${
            pwStatus === "success"
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-gradient-to-r from-[#FF79C6]/15 to-[#BD93F9]/15 text-white border border-[#FF79C6]/20 hover:from-[#FF79C6]/25 hover:to-[#BD93F9]/25 disabled:opacity-50"
          }`}
        >
          {pwStatus === "loading" && (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
              <span className="material-symbols-outlined text-[14px]">progress_activity</span>
            </motion.span>
          )}
          {pwStatus === "success" && <span className="material-symbols-outlined text-[14px]">check_circle</span>}
          {pwStatus === "loading" ? "Updating..." : pwStatus === "success" ? "Password Updated!" : "Update Password"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#06000f] font-[family-name:var(--font-body)]">

      {/* ═══════════════════ BACKGROUNDS ═══════════════════ */}
      <AnimatePresence mode="wait">
        <motion.div key={bgMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 z-0">
          {bgMode === "hacker" && (
            <HackerBackground color="#50FA7B" speed={1.2} fontSize={16} />
          )}
          {bgMode === "aurora" && (
            <SoftAurora speed={1.8} scale={3} brightness={1.3} color1="#f7f7f7" color2="#e100ff" noiseFrequency={1.5} noiseAmplitude={8.5} bandHeight={0.4} bandSpread={0.6} octaveDecay={0.12} layerOffset={0.1} colorSpeed={0.4} enableMouseInteraction mouseInfluence={1} />
          )}
          {bgMode === "laser" && (
            <LaserFlow color="#FF79C6" dpr={1} wispDensity={0.6} flowSpeed={0.3} verticalSizing={2.1} horizontalSizing={1.09} fogIntensity={0.2} fogScale={0.25} wispSpeed={12} wispIntensity={4} flowStrength={0.2} decay={1.14} horizontalBeamOffset={0} verticalBeamOffset={-0.15} />
          )}
          {bgMode === "rings" && (
            <MagicRings color="#FF79C6" colorTwo="#BD93F9" speed={0.8} ringCount={5} attenuation={8} lineThickness={2.5} baseRadius={0.3} radiusStep={0.12} scaleRate={0.12} opacity={0.9} noiseAmount={0.05} rotation={15} ringGap={1.4} fadeIn={0.8} fadeOut={0.6} followMouse parallax={0.04} clickBurst />
          )}
          {bgMode === "ether" && (
            <LiquidEther colors={["#FF79C6", "#BD93F9", "#8BE9FD"]} mouseForce={15} cursorSize={80} resolution={0.4} dt={0.014} BFECC autoDemo autoSpeed={0.4} autoIntensity={1.8} />
          )}
          {bgMode === "pixel" && (
            <PixelBlast color="#FF79C6" pixelSize={4} patternScale={2.5} patternDensity={0.9} speed={0.3} enableRipples rippleSpeed={0.25} rippleThickness={0.12} edgeFade={0.4} />
          )}
          {bgMode === "eye" && (
            <EvilEye eyeColor="#FF79C6" intensity={1.8} pupilSize={0.5} irisWidth={0.3} glowIntensity={0.4} scale={0.7} noiseScale={1.2} pupilFollow={1.0} flameSpeed={0.8} backgroundColor="#06000f" />
          )}
          {bgMode === "blinds" && (
            <GradientBlinds gradientColors={["#FF79C6", "#BD93F9", "#8BE9FD"]} angle={15} noise={0.2} blindCount={12} spotlightRadius={0.6} spotlightSoftness={1.2} distortAmount={0.3} />
          )}
          {bgMode === "grid" && (
            <GridScan linesColor="#1a1230" scanColor="#FF79C6" gridScale={0.08} lineThickness={1} scanOpacity={0.5} scanGlow={0.6} scanSoftness={2} scanDuration={2.5} scanDelay={1.5} noiseIntensity={0.02} scanOnClick enablePost bloomIntensity={0.3} chromaticAberration={0.001} />
          )}
          {bgMode === "hyper" && (
            <Hyperspeed effectOptions={{
              distortion: "turbulentDistortion",
              length: 400, roadWidth: 10, islandWidth: 2, lanesPerRoad: 4,
              fov: 90, fovSpeedUp: 150, speedUp: 2, carLightsFade: 0.4,
              totalSideLightSticks: 20, lightPairsPerRoadWay: 40,
              shoulderLinesWidthPercentage: 0.05, brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5], lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80], movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.03, 400 * 0.2],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5], carShiftX: [-0.8, 0.8],
              carFloorSeparation: [0, 5],
              colors: {
                roadColor: 0x080808, islandColor: 0x0a0a0a, background: 0x000000,
                shoulderLines: 0xffffff, brokenLines: 0xffffff,
                leftCars: [0xFF79C6, 0xBD93F9, 0xFF6F37],
                rightCars: [0x8BE9FD, 0x50FA7B, 0x324555],
                sticks: 0xBD93F9,
              },
            }} />
          )}
          {bgMode === "distort" && (
            <GridDistortion imageSrc="https://picsum.photos/1920/1080?grayscale" grid={10} mouse={0.1} strength={0.15} relaxation={0.9} />
          )}
          {bgMode === "balls" && (
            <Ballpit
              count={120}
              colors={[0xFF79C6, 0xBD93F9, 0x8BE9FD]}
              ambientColor={0x222222}
              ambientIntensity={0.8}
              lightIntensity={150}
              minSize={0.4}
              maxSize={0.9}
              gravity={0.3}
              friction={0.998}
              wallBounce={0.9}
              maxVelocity={0.12}
              followCursor
            />
          )}
          {bgMode === "glitch" && (
            <LetterGlitch glitchColors={["#FF79C6", "#BD93F9", "#8BE9FD"]} glitchSpeed={40} smooth outerVignette />
          )}
          {bgMode === "galaxy" && (
            <Galaxy density={1.2} speed={0.8} hueShift={280} glowIntensity={0.35} saturation={0.3} mouseRepulsion repulsionStrength={2.5} twinkleIntensity={0.4} rotationSpeed={0.08} transparent />
          )}
          {bgMode === "lightning" && (
            <Lightning hue={310} speed={1.2} intensity={1.3} size={1.1} />
          )}
          {bgMode === "aurorabg" && (
            <AuroraBg colorStops={["#FF79C6", "#BD93F9", "#8BE9FD"]} amplitude={1.2} blend={0.6} speed={1} />
          )}
          {bgMode === "dither" && (
            <Dither waveColor={[1.0, 0.47, 0.78]} waveSpeed={0.04} waveFrequency={2.5} waveAmplitude={0.4} colorNum={5} pixelSize={3} enableMouseInteraction mouseRadius={0.8} />
          )}
          {bgMode === "dots" && (
            <DotGrid dotSize={4} gap={24} baseColor="#1a0f2e" activeColor="#FF79C6" proximity={120} shockRadius={200} shockStrength={4} />
          )}
          {bgMode === "pillar" && (
            <LightPillar topColor="#8BE9FD" bottomColor="#FF79C6" intensity={1.0} rotationSpeed={0.4} glowAmount={0.004} pillarWidth={2.5} pillarHeight={0.35} noiseIntensity={0.4} quality="high" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Branding — top-left */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="absolute top-0 left-0 z-20 flex items-center gap-3 p-6 md:p-10">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF79C6] to-[#BD93F9] flex items-center justify-center shadow-[0_0_24px_rgba(255,121,198,0.25)]">
          <span className="material-symbols-outlined text-[20px] text-black">movie</span>
        </div>
        <div>
          <span className="font-[family-name:var(--font-display)] font-bold tracking-[0.2em] text-sm uppercase text-[#FF79C6]">Cineforge</span>
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/25 font-semibold">Production Suite</p>
        </div>
      </motion.div>

      {/* Background dropdown — top-right */}
      <div ref={bgRef} className="absolute top-6 right-6 md:top-10 md:right-10 z-20">
        {/* Trigger */}
        <button
          onClick={() => setBgOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/50 backdrop-blur-xl px-3 py-2 transition-all hover:border-white/[0.15] hover:bg-black/60"
          style={{ borderColor: bgOpen ? `${BG_OPTIONS.find(o => o.key === bgMode)?.color}33` : undefined }}
        >
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ color: BG_OPTIONS.find(o => o.key === bgMode)?.color }}
          >
            {BG_OPTIONS.find(o => o.key === bgMode)?.icon}
          </span>
          <span className="text-[11px] font-semibold tracking-wide uppercase text-white/70">
            {BG_OPTIONS.find(o => o.key === bgMode)?.label}
          </span>
          <span className={`material-symbols-outlined text-[14px] text-white/30 transition-transform duration-200 ${bgOpen ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {bgOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-[280px] rounded-xl border border-white/[0.08] bg-[#0c0816]/95 backdrop-blur-2xl p-2 shadow-2xl shadow-black/50"
            >
              <div className="grid grid-cols-2 gap-1">
                {BG_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setBgMode(opt.key); setBgOpen(false); }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                      bgMode === opt.key
                        ? "border"
                        : "border border-transparent hover:bg-white/[0.04]"
                    }`}
                    style={bgMode === opt.key ? { color: opt.color, borderColor: `${opt.color}33`, backgroundColor: `${opt.color}10` } : undefined}
                  >
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ color: bgMode === opt.key ? opt.color : "rgba(255,255,255,0.35)" }}
                    >
                      {opt.icon}
                    </span>
                    <span className={`text-[11px] font-semibold tracking-wide uppercase ${
                      bgMode === opt.key ? "" : "text-white/40"
                    }`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════ SPLIT CARD ═══════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[960px] mx-4"
      >
        {/* Top glow */}
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-[#FF79C6] to-transparent opacity-80 blur-[1px] z-20" />
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[120px] h-8 bg-[#FF79C6]/15 blur-xl rounded-full z-10" />

        <div
          className="rounded-2xl border border-white/[0.08] bg-[#0c0816]/80 backdrop-blur-2xl overflow-hidden relative"
          style={{ boxShadow: "0 -8px 40px rgba(255,121,198,0.04), inset 0 1px 0 rgba(255,121,198,0.08)" }}
        >
          {/* The grid holds both form slots; overlay slides to reveal the correct one */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 lg:min-h-[580px] overflow-hidden">

            {/* ─── LEFT FORM SLOT — Login (desktop only) ─── */}
            <div className="col-span-1 relative min-h-[580px] hidden lg:block">
              <AnimatePresence mode="wait">
                {!swapped && (
                  <motion.div
                    key="login-form"
                    className="absolute inset-0 p-8 flex flex-col justify-center"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {loginPanel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── RIGHT FORM SLOT — Password (visible when overlay slides left) ─── */}
            <div className="col-span-1 relative min-h-[580px] hidden lg:block">
              <AnimatePresence mode="wait">
                {swapped && (
                  <motion.div
                    key="password-form"
                    className="absolute inset-0 p-8 flex flex-col justify-center"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {passwordPanel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Mobile: show whichever form is active (no overlay on small screens) ── */}
            <div className="col-span-1 lg:hidden p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={swapped ? "pw-mobile" : "login-mobile"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {swapped ? passwordPanel : loginPanel}
                </motion.div>
              </AnimatePresence>
              {swapped && (
                <button onClick={() => setSwapped(false)} className="mt-4 text-xs text-[#8BE9FD]/60 hover:text-[#8BE9FD] transition-colors flex items-center gap-1 mx-auto">
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  Back to Sign In
                </button>
              )}
              {!swapped && (
                <button onClick={() => setSwapped(true)} className="mt-4 text-xs text-[#FF79C6]/60 hover:text-[#FF79C6] transition-colors flex items-center gap-1 mx-auto">
                  Change Password
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              )}
            </div>

            {/* ═══ SLIDING OVERLAY — "Change Password" CTA (default: covers right half) ═══ */}
            <motion.div
              className="hidden lg:flex absolute top-0 right-0 w-1/2 h-full flex-col items-center justify-center text-center px-10 z-20"
              animate={{ x: swapped ? "-100%" : "0%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "linear-gradient(145deg, #1c0838 0%, #2d1052 55%, #160530 100%)",
                borderLeft: "1px solid rgba(255,121,198,0.15)",
              }}
            >
              <div className="absolute top-6 right-6 w-40 h-40 rounded-full bg-[#FF79C6]/8 blur-3xl pointer-events-none" />
              <div className="absolute bottom-6 left-6 w-32 h-32 rounded-full bg-[#BD93F9]/8 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 relative">
                  {/* Glassmorphic Icon Box - 1.2x Scaled */}
                  <div className="w-[148px] h-[148px] rounded-[40px] backdrop-blur-[24px] bg-white/5 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF79C6]/30 to-transparent opacity-60" />
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FF79C6]/20 blur-2xl rounded-full" />
                    <span 
                      className="material-symbols-outlined !text-[68px] text-white relative z-10 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center leading-none"
                      style={{ fontSize: "68px", filter: "drop-shadow(0px 0px 16px rgba(255,121,198,0.8))" }}
                    >
                      lock_reset
                    </span>
                  </div>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white mb-2.5 leading-snug">
                  Need to update<br />your credentials?
                </h3>
                <p className="text-white/35 text-[12px] mb-7 max-w-[200px] leading-relaxed">
                  Change your studio password securely with end-to-end encryption.
                </p>
                <button
                  onClick={() => setSwapped(true)}
                  className="group flex items-center gap-2 px-7 py-2.5 rounded-full border border-[#FF79C6]/35 text-[#FF79C6] text-[11px] font-bold tracking-[0.12em] uppercase transition-all hover:bg-[#FF79C6]/10 hover:border-[#FF79C6]/55 hover:shadow-[0_0_28px_rgba(255,121,198,0.18)]"
                >
                  Change Password
                  <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
              </div>
            </motion.div>

            {/* ═══ SLIDING OVERLAY — "Back to Sign In" CTA (swapped: covers left half) ═══ */}
            <motion.div
              className="hidden lg:flex absolute top-0 left-0 w-1/2 h-full flex-col items-center justify-center text-center px-10 z-20"
              animate={{ x: swapped ? "0%" : "-100%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "linear-gradient(145deg, #071828 0%, #0e2544 55%, #071828 100%)",
                borderRight: "1px solid rgba(139,233,253,0.13)",
              }}
            >
              <div className="absolute top-6 left-6 w-36 h-36 rounded-full bg-[#8BE9FD]/7 blur-3xl pointer-events-none" />
              <div className="absolute bottom-6 right-6 w-28 h-28 rounded-full bg-[#BD93F9]/7 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 relative">
                  {/* Glassmorphic Icon Box - 1.2x Scaled */}
                  <div className="w-[148px] h-[148px] rounded-[40px] backdrop-blur-[24px] bg-white/5 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.38),inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8BE9FD]/30 to-transparent opacity-60" />
                    <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#8BE9FD]/20 blur-2xl rounded-full" />
                    <span 
                      className="material-symbols-outlined !text-[68px] text-white relative z-10 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center leading-none"
                      style={{ fontSize: "68px", filter: "drop-shadow(0px 0px 16px rgba(139,233,253,0.8))" }}
                    >
                      movie_filter
                    </span>
                  </div>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white mb-2.5 leading-snug">
                  Welcome<br />Back!
                </h3>
                <p className="text-white/35 text-[12px] mb-7 max-w-[200px] leading-relaxed">
                  Access the CineForge studio environment with your credentials.
                </p>
                <button
                  onClick={() => setSwapped(false)}
                  className="group flex items-center gap-2 px-7 py-2.5 rounded-full border border-[#8BE9FD]/35 text-[#8BE9FD] text-[11px] font-bold tracking-[0.12em] uppercase transition-all hover:bg-[#8BE9FD]/10 hover:border-[#8BE9FD]/55 hover:shadow-[0_0_28px_rgba(139,233,253,0.14)]"
                >
                  <span className="material-symbols-outlined text-[14px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                  Back to Sign In
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
