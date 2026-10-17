"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Compass,
  Sparkles,
  PlaneTakeoff,
  Sun,
  Shield,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Info,
  X,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { fadeUp, staggerContainer, shakeError, hoverLift, tapPress } from "@/lib/motion";

// Form validation schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address with an @ domain."),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/home";
  const { login } = useAuthStore();
  const prefersReduced = useReducedMotion();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "alexandra.morris@voyage.co",
      password: "password123",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Testing behavior: wrong@test.com acts as invalid credentials
    if (data.email.toLowerCase() === "wrong@test.com") {
      setAuthError(
        "That email or password doesn't look right. Try again or reset your password."
      );
      return;
    }

    // TODO: Connect real auth provider here (e.g. Supabase Auth / Firebase / NextAuth)
    login({
      email: data.email,
      name: data.email.split("@")[0].replace(".", " "),
    });
    setIsSuccess(true);

    setTimeout(() => {
      router.push(redirectUrl);
    }, 1100);
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);

    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    // TODO: Connect real OAuth provider here (e.g. Supabase OAuth / Google Provider)
    login({
      name: "Alexandra Morris",
      email: "alexandra.morris@voyage.co",
    });
    setIsSuccess(true);

    setTimeout(() => {
      router.push(redirectUrl);
    }, 1100);
  };

  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4 lg:px-6 transition-all duration-300">
      <div className="w-full max-w-[1360px] bg-surface rounded-3xl shadow-xl overflow-hidden min-h-[760px] flex flex-col border border-outline-variant/30">
        {/* Split-screen Host Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full flex-grow">
          {/* ======================= LEFT HERO / VISUAL COLUMN ======================= */}
          <div
            className="lg:col-span-6 relative w-full h-[320px] lg:h-auto min-h-[320px] lg:min-h-[760px] p-6 lg:p-12 flex flex-col justify-between overflow-hidden"
            id="visual-column"
          >
            {/* Background Photo with slow zoom fade-in */}
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1.0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6upQALmrL_sJpwRelme7xJlMCwwHEzP0XihRi2ozTsuX78xCqR9cZ_P7nNDkaOx0orm91R_4RB-c8fihUkRsMIOOY_YeLOIqSEYkQGV74Mzy6xq3Pvr6iYGr42OSF3TvODUY9OcOy-_YNJixQo_YGhoX8OqHN1sBy1iktxPyLohWtyO-mR03SdbO-TDHGr_rQx6qDKtJ2sxRpObZ13qEQEzeRQ-T8vo3oI3yAxIOxTN-rPq0M9C1y')",
              }}
            />

            {/* Deep Warm Earthen Scrim Overlays */}
            <div className="absolute inset-0 z-1 bg-gradient-to-t from-primary/95 via-primary/40 to-primary/30 mix-blend-multiply" />
            <div className="absolute inset-0 z-1 bg-gradient-to-r from-primary/60 to-transparent" />

            {/* Top Section: Brand Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-lowest/20 backdrop-blur-md shadow-sm hover:bg-surface-container-lowest/30 transition-colors"
              >
                <Compass className="text-surface-container-lowest text-2xl w-6 h-6 fill-surface-container-lowest/20" />
                <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-surface-container-lowest">
                  TripAi
                </span>
              </Link>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-sm text-surface-container-lowest text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-secondary-container" />
                <span>Autonomous Itinerary Engine</span>
              </div>
            </div>

            {/* Center-Bottom Floating Sticky Note (Tactile Paper Aesthetic) */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative z-10 my-auto sm:my-8 max-w-[270px] self-start lg:self-center -rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-105"
            >
              {/* Washi Tape Effect at top */}
              <div className="w-20 h-4 bg-secondary-fixed/80 backdrop-blur-sm mx-auto -mb-2 rounded-sm shadow-xs opacity-90" />
              <div className="bg-surface-container-low p-4 rounded-xl shadow-lg relative overflow-hidden border border-outline-variant/30">
                <div className="flex items-start justify-between">
                  <PlaneTakeoff className="text-tertiary w-5 h-5" />
                  <span className="text-[11px] font-semibold text-outline tracking-wider uppercase">
                    DISPATCH #204
                  </span>
                </div>
                <p className="font-serif text-2xl leading-snug text-primary mt-2 italic font-medium">
                  Next stop: anywhere ✈️
                </p>
                <div className="mt-2 pt-2 flex items-center justify-between text-xs text-outline border-t border-outline-variant/20">
                  <span>Fontainhas, Goa</span>
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-600" /> 28°C
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Bottom Editorial Quote */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative z-10 pt-4"
            >
              <div className="max-w-md">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-surface-container-lowest tracking-tight leading-tight drop-shadow-sm font-normal">
                  Your whole trip, planned in seconds.
                </h2>
                <p className="mt-2 text-sm sm:text-base text-surface-container-highest/90 max-w-sm drop-shadow-xs font-light">
                  Curated journeys with the tactile soul of a personal travel journal.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-6 text-surface-container-highest/80 text-xs sm:text-sm font-medium">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-secondary-container" /> Multi-agent Privacy
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-secondary-container" /> Real-time Sync
                </span>
              </div>
            </motion.div>
          </div>

          {/* ======================= RIGHT AUTH FORM COLUMN ======================= */}
          <div
            className="lg:col-span-6 bg-surface-container-low flex flex-col justify-between p-6 sm:p-10 lg:p-14 transition-all duration-300 relative"
            id="form-column"
          >
            {/* Top Navigation Header */}
            <div className="w-full flex items-center justify-between pb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-tertiary hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to home</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" />
                <span className="text-xs uppercase tracking-wider text-outline font-semibold">
                  Secure Portal
                </span>
              </div>
            </div>

            {/* Form Canvas Container with staggered children */}
            <motion.div
              variants={staggerContainer(0.08, 0.1)}
              initial={prefersReduced ? false : "hidden"}
              animate="visible"
              className="w-full max-w-[420px] mx-auto my-auto py-4"
            >
              {/* Headline block */}
              <motion.div variants={fadeUp} className="mb-8">
                <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm sm:text-base text-secondary">
                  Log in to see your saved trips and plan your next one.
                </p>
              </motion.div>

              {/* Global Error Banner with Shake & Fade */}
              <AnimatePresence>
                {authError && (
                  <motion.div
                    key="auth-error"
                    variants={shakeError}
                    initial={prefersReduced ? { opacity: 0 } : "hidden"}
                    animate="visible"
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-6 p-4 rounded-xl bg-secondary-fixed/50 border border-secondary-fixed text-primary transition-all duration-300 flex items-start gap-3"
                    role="alert"
                  >
                    <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-primary">
                        Authentication note
                      </p>
                      <p className="text-sm text-on-surface-variant mt-0.5">
                        {authError}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAuthError(null)}
                      className="text-secondary hover:text-primary transition-colors p-1 cursor-pointer"
                      aria-label="Dismiss alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calm Success Banner with Animated Checkmark */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    key="success-banner"
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mb-6 p-5 rounded-2xl bg-surface-container-high transition-all duration-300 border border-outline-variant/30 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {/* Animated checkmark circle */}
                      <motion.div
                        initial={prefersReduced ? false : { scale: 0, rotate: -25 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 22,
                        }}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs"
                      >
                        <svg
                          className="w-4 h-4 text-on-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <motion.path
                            d="M20 6L9 17L4 12"
                            initial={prefersReduced ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                          />
                        </svg>
                      </motion.div>
                      <div>
                        <h4 className="font-serif text-base font-medium text-primary">
                          Welcome back to TripAi!
                        </h4>
                        <p className="text-xs text-secondary">
                          Redirecting to your travel journals...
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1 rounded-full mt-4 overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.0, ease: "easeInOut" }}
                        className="bg-primary h-full rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Sign-in Button */}
              <motion.div variants={fadeUp} className="w-full mb-6">
                <GoogleAuthButton
                  isLoading={isGoogleLoading}
                  onClick={handleGoogleLogin}
                  text="Continue with Google"
                />
              </motion.div>

              {/* Soft Divider */}
              <motion.div
                variants={fadeUp}
                className="relative flex py-2 items-center mb-6"
              >
                <div className="flex-grow bg-surface-container-highest h-[1px]" />
                <span className="flex-shrink mx-4 text-xs font-semibold text-outline uppercase tracking-widest">
                  or with email
                </span>
                <div className="flex-grow bg-surface-container-highest h-[1px]" />
              </motion.div>

              {/* Standard Login Form with staggered inputs */}
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Email Input Field */}
                <motion.div variants={fadeUp}>
                  <label
                    className="block text-sm text-primary font-medium mb-1.5"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <div className="relative rounded-xl overflow-hidden shadow-xs focus-within:shadow-md transition-shadow">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      className={`w-full h-12 pl-10 pr-4 bg-surface-container-lowest/80 text-primary text-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 transition-all rounded-xl border ${
                        errors.email
                          ? "border-amber-600 focus:ring-amber-500/40"
                          : "border-outline-variant/30 focus:ring-secondary/40"
                      }`}
                      {...register("email")}
                    />
                  </div>

                  {/* Email Inline Error with Shake Animation */}
                  <AnimatePresence>
                    {errors.email && (
                      <motion.div
                        key="email-error"
                        variants={shakeError}
                        initial={prefersReduced ? { opacity: 0 } : "hidden"}
                        animate="visible"
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-2 p-2 px-3 rounded-lg bg-secondary-fixed/40 flex items-center gap-2 text-primary"
                      >
                        <Info className="w-4 h-4 flex-shrink-0 text-primary" />
                        <p className="text-xs font-medium">
                          {errors.email.message}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password Input Field */}
                <motion.div variants={fadeUp}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className="block text-sm text-primary font-medium"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-secondary hover:text-primary transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative rounded-xl overflow-hidden shadow-xs focus-within:shadow-md transition-shadow">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`w-full h-12 pl-10 pr-11 bg-surface-container-lowest/80 text-primary text-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 transition-all rounded-xl border ${
                        errors.password
                          ? "border-amber-600 focus:ring-amber-500/40"
                          : "border-outline-variant/30 focus:ring-secondary/40"
                      }`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password view"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Inline Error with Shake Animation */}
                  <AnimatePresence>
                    {errors.password && (
                      <motion.div
                        key="password-error"
                        variants={shakeError}
                        initial={prefersReduced ? { opacity: 0 } : "hidden"}
                        animate="visible"
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-2 p-2 px-3 rounded-lg bg-secondary-fixed/40 flex items-center gap-2 text-primary"
                      >
                        <Info className="w-4 h-4 flex-shrink-0 text-primary" />
                        <p className="text-xs font-medium">
                          {errors.password.message}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Utility Row: Remember Me & SSL Badge */}
                <motion.div
                  variants={fadeUp}
                  className="flex items-center justify-between pt-1"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register("rememberMe")}
                    />
                    <div className="w-5 h-5 rounded-md bg-surface-container-lowest peer-checked:bg-primary border border-outline-variant/40 flex items-center justify-center transition-all shadow-xs">
                      <svg
                        className="w-3.5 h-3.5 text-on-primary scale-0 peer-checked:scale-100 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-xs text-on-surface-variant font-normal">
                      Remember this journal
                    </span>
                  </label>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-outline font-medium">
                      <Shield className="w-3 h-3" /> 256-bit SSL
                    </span>
                  </div>
                </motion.div>

                {/* Primary Submit CTA with hover lift & tap press */}
                <motion.div variants={fadeUp} className="pt-3">
                  <motion.button
                    id="submit-btn"
                    type="submit"
                    {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                    disabled={isSubmitting || isSuccess}
                    className="w-full h-12 px-6 rounded-xl bg-primary text-on-primary text-sm font-medium tracking-wide shadow-md hover:bg-secondary active:scale-[0.98] transition-colors duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-on-primary" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <span>Log in</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Bottom Footnote & Registration link */}
              <motion.div variants={fadeUp} className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant">
                  New to TripAi?
                  <Link
                    href="/signup"
                    className="font-medium text-secondary hover:text-primary hover:underline ml-1.5 transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
              </motion.div>
            </motion.div>

            {/* Bottom Micro-footer */}
            <div className="w-full pt-6 flex flex-wrap items-center justify-between text-outline text-xs gap-2 border-t border-outline-variant/20">
              <span>© 2025 TripAi Travel Technologies Ltd.</span>
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Dispatch
                </Link>
                <span>•</span>
                <Link href="#" className="hover:text-primary transition-colors">
                  Journal Terms
                </Link>
                <span>•</span>
                <Link href="#" className="hover:text-primary transition-colors">
                  Concierge Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="w-full min-h-screen bg-surface flex flex-col justify-center items-center py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
