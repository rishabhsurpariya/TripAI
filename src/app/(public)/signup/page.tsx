"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Compass,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Sun,
  Shield,
  Info,
  X,
  Loader2,
} from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { signUpWithEmail, signInWithGoogle } from "@/lib/data/auth";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { fadeUp, staggerContainer, shakeError, hoverLift, tapPress } from "@/lib/motion";

// Form validation schema with Zod
const signupSchema = z.object({
  fullname: z.string().min(1, "Please enter your full name."),
  email: z
    .string()
    .min(1, "Please provide an email address.")
    .email("Please provide a valid email format."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must satisfy minimum requirements (at least 8 characters)."),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms to proceed.",
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  const [showPassword, setShowPassword] = useState(false);
  const [alreadyRegisteredError, setAlreadyRegisteredError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const passwordValue = watch("password") || "";

  const syncAutofillValues = () => {
    if (typeof document === "undefined") return;
    const fullnameInput = document.getElementById("fullname") as HTMLInputElement | null;
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    if (fullnameInput?.value) {
      setValue("fullname", fullnameInput.value.trim(), { shouldValidate: true });
    }
    if (emailInput?.value) {
      setValue("email", emailInput.value.trim(), { shouldValidate: true });
    }
    if (passwordInput?.value) {
      setValue("password", passwordInput.value, { shouldValidate: true });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    syncAutofillValues();
    handleSubmit(onSubmit)(e);
  };

  const onSubmit = async (data: SignupFormData) => {
    setAlreadyRegisteredError(false);
    setIsLoading(true);

    try {
      syncAutofillValues();
      const fullnameInput =
        typeof document !== "undefined"
          ? (document.getElementById("fullname") as HTMLInputElement | null)
          : null;
      const emailInput =
        typeof document !== "undefined"
          ? (document.getElementById("email") as HTMLInputElement | null)
          : null;
      const passwordInput =
        typeof document !== "undefined"
          ? (document.getElementById("password") as HTMLInputElement | null)
          : null;

      const fullname = fullnameInput?.value?.trim() || data.fullname?.trim() || "";
      const email = emailInput?.value?.trim() || data.email?.trim() || "";
      const password = passwordInput?.value || data.password || "";

      const { error } = await signUpWithEmail(
        email,
        password,
        fullname
      );

      if (error) {
        setAlreadyRegisteredError(true);
        return;
      }

      setIsSuccess(true);

      setTimeout(() => {
        if (typeof window !== "undefined") {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/home";
        } else {
          router.push("/home");
          router.refresh();
        }
      }, 900);
    } catch {
      setAlreadyRegisteredError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setAlreadyRegisteredError(false);
    setIsGoogleLoading(true);

    try {
      const { error } = await signInWithGoogle("/home");

      if (error) {
        // Handled silently or displays fallback
      }
    } catch {
      // ignore
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-surface flex flex-col justify-center items-center py-6">
      <div className="w-full flex-1 flex justify-center items-center p-3 sm:p-6 lg:p-8 transition-all duration-300">
        {/* Main Shell Container */}
        <div className="w-full max-w-[1280px] bg-surface-container-low rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300 border border-outline-variant/30">
          {/* ================= LEFT HALF: Atmospheric Travel Visuals ================= */}
          <div
            className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-[760px] p-6 sm:p-10 flex flex-col justify-between overflow-hidden"
            id="left-column"
          >
            {/* Visual Backdrop with slow zoom fade-in */}
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1.0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9Nm-5VAC48MUZwLlnpfzbL5T1sxSCQ_2EbXKIWSwQYrQqBZbB5cHpWoxWzKEqS_a85YZd77Q7iqQKTM3Rx1DyTYKVlthYbGQVurYdJU98IH8Oh_uzF16z8pG0Olxj1spCamhiA6-MNA70EQ3B-m2b8Y2CeqslbxVT_4UR2ccXDCYtFTuCNfjobjvFUDLhxcgdJMQWjyj_NgF902mTUxDXpg33Eea-HK6N9nk7FC0ULy4P-81Y3Fk0')",
              }}
            />

            {/* Earthen Warm Brown Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-primary/40" />

            {/* Top Left Brand Badge & Washi Tape Note */}
            <div className="relative z-10 flex flex-col items-start gap-5">
              {/* TripAi Wordmark */}
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-md hover:bg-surface-container-lowest transition-colors"
              >
                <Compass className="text-primary w-5 h-5 fill-primary/10" />
                <span className="font-serif text-xl font-semibold text-primary tracking-tight">
                  TripAi
                </span>
              </Link>

              {/* Washi-Pinned Journal Sticky Note */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative group mt-2"
              >
                {/* Washi Tape strip */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-secondary-fixed/90 backdrop-blur-sm -rotate-2 rounded-sm shadow-sm z-20" />
                {/* Cream Note Box */}
                <div className="relative bg-surface-bright px-5 py-3.5 rounded-lg shadow-md -rotate-1 transform transition hover:rotate-0 duration-200 max-w-[270px] border border-outline-variant/30">
                  <div className="flex items-start gap-2">
                    <span className="text-base select-none">🌿</span>
                    <p className="font-serif text-base text-primary leading-snug italic font-medium">
                      “Collect moments, not itineraries.”
                    </p>
                  </div>
                  <div className="mt-1 text-right">
                    <span className="text-[10px] font-semibold text-secondary tracking-widest uppercase">
                      Kyoto Autumn Edition
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Center Travel Milestone Indicator */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative z-10 hidden sm:flex items-center gap-3 my-auto self-start bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm border border-outline-variant/20"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-surface-container-lowest text-xs">
                <Sun className="w-4 h-4 text-secondary-fixed" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-secondary font-semibold">
                  Recommended Sunset Timing
                </span>
                <span className="text-sm text-primary font-medium">
                  Higashiyama Ward • 17:15
                </span>
              </div>
            </motion.div>

            {/* Bottom Narrative Editorial Vignette */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="relative z-10 space-y-2.5 pt-6"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/85 text-on-secondary-container text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligent Wayfinding</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-surface-container-lowest font-medium tracking-tight drop-shadow-sm">
                Craft your bespoke adventure.
              </h2>
              <p className="text-xs sm:text-sm text-surface-container-highest max-w-md leading-relaxed font-light">
                Day-by-day pacing, authentic stays, and real-time budgets harmonized through quiet, attentive intelligence.
              </p>

              {/* Traveler Avatars */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-7 w-7 rounded-full bg-surface-container-highest ring-2 ring-surface-container-lowest flex items-center justify-center text-primary font-bold text-xs">
                    MK
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full bg-secondary ring-2 ring-surface-container-lowest flex items-center justify-center text-surface-container-lowest font-bold text-xs">
                    AL
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full bg-primary ring-2 ring-surface-container-lowest flex items-center justify-center text-surface-container-lowest font-bold text-xs">
                    JP
                  </div>
                </div>
                <span className="text-xs text-surface-container-lowest/90 font-medium">
                  Joined by 18,400+ mindful travelers
                </span>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT HALF: Form Column ================= */}
          <div
            className="w-full lg:w-1/2 bg-surface-container-low px-6 sm:px-12 py-8 lg:py-12 flex flex-col justify-center items-center relative"
            id="right-column"
          >
            <motion.div
              variants={staggerContainer(0.08, 0.1)}
              initial={prefersReduced ? false : "hidden"}
              animate="visible"
              className="w-full max-w-[420px] flex flex-col"
            >
              {/* Top Back Link */}
              <motion.div
                variants={fadeUp}
                className="mb-5 flex items-center justify-between"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-secondary hover:text-primary transition-colors text-sm font-medium group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to home</span>
                </Link>
                <span className="text-xs text-secondary uppercase tracking-widest hidden sm:inline font-semibold">
                  Step 1 of 2
                </span>
              </motion.div>

              {/* Alert Container with Shake Animation */}
              <AnimatePresence>
                {alreadyRegisteredError && (
                  <motion.div
                    key="already-registered-alert"
                    variants={shakeError}
                    initial={prefersReduced ? { opacity: 0 } : "hidden"}
                    animate="visible"
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-5 p-3.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed shadow-sm transition-all duration-300 border border-secondary-fixed-dim"
                    role="alert"
                  >
                    <div className="flex items-start gap-2.5">
                      <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-primary leading-tight">
                          An account with this email already exists.
                        </p>
                        <p className="text-xs text-secondary mt-1">
                          Would you like to{" "}
                          <Link
                            href="/login"
                            className="underline font-semibold text-primary hover:text-secondary"
                          >
                            log in instead
                          </Link>{" "}
                          or{" "}
                          <Link
                            href="/forgot-password"
                            className="underline font-semibold text-primary hover:text-secondary"
                          >
                            reset password
                          </Link>
                          ?
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAlreadyRegisteredError(false)}
                        className="text-secondary hover:text-primary p-1 cursor-pointer"
                        aria-label="Dismiss alert"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calm Success Banner with Animated Checkmark */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    key="signup-success-banner"
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
                          Welcome to TripAi!
                        </h4>
                        <p className="text-xs text-secondary">
                          Setting up your personal travel journal...
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

              {/* Header Group */}
              <motion.div variants={fadeUp} className="mb-6 space-y-1.5">
                <h1 className="font-serif text-3xl sm:text-4xl text-primary font-semibold tracking-tight">
                  Create your account
                </h1>
                <p className="text-sm text-secondary leading-relaxed">
                  Save your trips, edit them and share them with friends.
                </p>
              </motion.div>

              {/* Social Provider: Continue with Google */}
              <motion.div variants={fadeUp} className="w-full mb-5">
                <GoogleAuthButton
                  isLoading={isGoogleLoading}
                  onClick={handleGoogleSignup}
                  text="Continue with Google"
                />
              </motion.div>

              {/* Subtle Divider */}
              <motion.div
                variants={fadeUp}
                className="relative my-5 flex items-center justify-center"
              >
                <div className="w-full h-px bg-surface-container-highest" />
                <span className="absolute px-3 bg-surface-container-low text-xs font-semibold text-secondary uppercase tracking-widest">
                  or
                </span>
              </motion.div>

              {/* Form Start with staggered inputs */}
              <form
                className="space-y-4"
                onSubmit={handleFormSubmit}
                noValidate
              >
                {/* Full Name Field */}
                <motion.div variants={fadeUp} className="space-y-1">
                  <label
                    className="block text-xs font-medium text-primary uppercase tracking-wider"
                    htmlFor="fullname"
                  >
                    Full Name
                  </label>
                  <div className="relative rounded-2xl transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="fullname"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Maya Chen"
                      className={`w-full h-12 pl-10 pr-4 rounded-2xl bg-surface-container-highest/60 focus:bg-surface-container-lowest text-primary placeholder:text-secondary/70 text-sm outline-none transition duration-150 focus:shadow-md border ${
                        errors.fullname
                          ? "border-amber-600 focus:ring-1 focus:ring-amber-600"
                          : "border-outline-variant/30 focus:border-secondary"
                      }`}
                      {...register("fullname")}
                    />
                  </div>

                  {/* Validation Message with Shake */}
                  <AnimatePresence>
                    {errors.fullname && (
                      <motion.p
                        key="fullname-error"
                        variants={shakeError}
                        initial={prefersReduced ? { opacity: 0 } : "hidden"}
                        animate="visible"
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-secondary bg-secondary-fixed/50 px-2 py-1 rounded-md mt-1"
                      >
                        {errors.fullname.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email Field */}
                <motion.div variants={fadeUp} className="space-y-1">
                  <label
                    className="block text-xs font-medium text-primary uppercase tracking-wider"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative rounded-2xl transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      className={`w-full h-12 pl-10 pr-4 rounded-2xl bg-surface-container-highest/60 focus:bg-surface-container-lowest text-primary placeholder:text-secondary/70 text-sm outline-none transition duration-150 focus:shadow-md border ${
                        errors.email
                          ? "border-amber-600 focus:ring-1 focus:ring-amber-600"
                          : "border-outline-variant/30 focus:border-secondary"
                      }`}
                      {...register("email")}
                    />
                  </div>

                  {/* Validation Message with Shake */}
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        key="email-error"
                        variants={shakeError}
                        initial={prefersReduced ? { opacity: 0 } : "hidden"}
                        animate="visible"
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-secondary bg-secondary-fixed/50 px-2 py-1 rounded-md mt-1"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={fadeUp} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-xs font-medium text-primary uppercase tracking-wider"
                      htmlFor="password"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative rounded-2xl transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      className={`w-full h-12 pl-10 pr-11 rounded-2xl bg-surface-container-highest/60 focus:bg-surface-container-lowest text-primary placeholder:text-secondary/70 text-sm outline-none transition duration-150 focus:shadow-md border ${
                        errors.password
                          ? "border-amber-600 focus:ring-1 focus:ring-amber-600"
                          : "border-outline-variant/30 focus:border-secondary"
                      }`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer"
                      title="Toggle password view"
                      aria-label="Toggle password view"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password 4-segment Strength Bar with smooth fill */}
                  <PasswordStrengthIndicator password={passwordValue} />

                  {/* Validation Message with Shake */}
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        key="password-error"
                        variants={shakeError}
                        initial={prefersReduced ? { opacity: 0 } : "hidden"}
                        animate="visible"
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-secondary bg-secondary-fixed/50 px-2 py-1 rounded-md mt-1"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Terms Checkbox */}
                <motion.div variants={fadeUp} className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                      {...register("terms")}
                    />
                    <span className="text-xs text-primary leading-tight">
                      I agree to the{" "}
                      <Link
                        href="#"
                        className="underline text-secondary hover:text-primary font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="#"
                        className="underline text-secondary hover:text-primary font-medium"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  {/* Terms Validation Error with Shake */}
                  <AnimatePresence>
                    {errors.terms && (
                      <motion.p
                        key="terms-error"
                        variants={shakeError}
                        initial={prefersReduced ? { opacity: 0 } : "hidden"}
                        animate="visible"
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-secondary bg-secondary-fixed/50 px-2 py-1 rounded-md mt-1"
                      >
                        {errors.terms.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Primary Submit Button with hover lift & tap press */}
                <motion.div variants={fadeUp} className="pt-2">
                  <motion.button
                    id="submit-btn"
                    type="submit"
                    onClick={syncAutofillValues}
                    {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                    disabled={isLoading || isSubmitting}
                    className="w-full h-12 px-6 rounded-full bg-primary-container hover:bg-primary text-surface-container-lowest text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-colors duration-200 flex items-center justify-center gap-2 transform active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                  >
                    {isLoading || isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-surface-container-lowest" />
                        <span>Setting up journal...</span>
                      </>
                    ) : (
                      <span>Create account</span>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Bottom Log In Navigation */}
              <motion.div variants={fadeUp} className="mt-6 text-center">
                <p className="text-sm text-secondary">
                  Already have an account?
                  <Link
                    href="/login"
                    className="font-semibold text-secondary hover:text-primary underline ml-1.5 transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </motion.div>

              {/* Micro journal footer info */}
              <motion.div
                variants={fadeUp}
                className="mt-6 pt-4 flex items-center justify-between text-secondary/70 border-t border-outline-variant/20"
              >
                <span className="text-[11px] font-medium">
                  TripAi • Kyoto • Paris • Oaxaca
                </span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>256-bit encryption</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
