"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Compass,
  ArrowLeft,
  Mail,
  Lock,
  Pin,
  Info,
  RefreshCw,
  MailCheck,
  Loader2,
  X,
} from "lucide-react";
import { fadeUp, staggerContainer, shakeError, hoverLift, tapPress } from "@/lib/motion";
import { sendPasswordResetEmail } from "@/lib/data/auth";

// Form validation schema with Zod
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const prefersReduced = useReducedMotion();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resendFeedback, setResendFeedback] = useState(false);
  const [errorBanner, setErrorBanner] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const syncAutofillValues = () => {
    if (typeof document === "undefined") return;
    const emailInput = document.getElementById("email-input") as HTMLInputElement | null;
    if (emailInput?.value) {
      setValue("email", emailInput.value.trim(), { shouldValidate: true });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    syncAutofillValues();
    handleSubmit(onSubmit)(e);
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorBanner(false);
    setIsLoading(true);

    try {
      syncAutofillValues();
      const emailInput =
        typeof document !== "undefined"
          ? (document.getElementById("email-input") as HTMLInputElement | null)
          : null;
      const email = emailInput?.value?.trim() || data.email?.trim() || "";

      if (!email) {
        setErrorBanner(true);
        return;
      }

      const { error } = await sendPasswordResetEmail(email);

      if (error) {
        setErrorBanner(true);
        return;
      }

      setSubmittedEmail(email);
      setIsConfirmed(true);
    } catch {
      setErrorBanner(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendFeedback(true);
    if (submittedEmail) {
      await sendPasswordResetEmail(submittedEmail);
    }
    setTimeout(() => {
      setResendFeedback(false);
    }, 2200);
  };

  return (
    <main className="w-full min-h-screen bg-surface flex flex-col justify-center items-center py-6">
      <div className="w-full flex-1 flex items-center justify-center p-3 md:p-8 transition-all duration-300">
        <div
          className="w-full max-w-[1240px] min-h-[720px] bg-surface-container-low rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row transition-all duration-300 relative border border-outline-variant/30"
          id="main-frame"
        >
          {/* ================= LEFT HALF: Positano Coast Visuals ================= */}
          <div
            className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-[720px] p-6 sm:p-10 flex flex-col justify-between overflow-hidden rounded-[1.5rem] m-2 sm:m-3"
            id="hero-half"
          >
            {/* Visual Backdrop with slow zoom fade-in */}
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1.0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAT6xiXPH4j9959Qv6jRdxnMd8ztWjycdRZbOt-feZnvLw1sKs8Vy8Hmd9I1MVCV8q2wYeeORDZqajRbzKC-FGK6ps0SbHNb-AfI3A4mqPZEq-ZHf8S4NFcxJDNLUcBN2p6l7FdPdYyc2mxFW00uIP0a80ATQo1Q0MWDGG4hOeqcgbDQNqmPcgMv1mm1PJf4uYgdiC0NHJdP-Neq-0vUeCiOMsHaspaDJESZd2-bOgGT_q1JG1X-b2c')",
              }}
            />

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/35 to-primary/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent pointer-events-none" />

            {/* Top Brand & Journal badge */}
            <div className="relative z-10 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-sm hover:bg-surface-container-lowest transition-colors"
              >
                <Compass className="text-primary w-5 h-5 fill-primary/10" />
                <span className="font-serif text-xl font-semibold tracking-tight text-primary leading-none">
                  TripAi
                </span>
              </Link>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/70 backdrop-blur-md text-primary text-xs font-medium tracking-wider uppercase">
                <span>Journal No. 04</span>
              </div>
            </div>

            {/* Center Washi Tape Handwritten Note */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative z-10 self-end my-auto transform -rotate-3 hover:rotate-0 transition-transform duration-300 drop-shadow-md"
            >
              <div className="w-16 h-4 mx-auto -mb-2 bg-secondary-fixed/90 backdrop-blur-sm rounded-sm opacity-90 shadow-sm z-20 relative" />
              <div className="bg-surface-container-lowest/95 backdrop-blur-sm p-4 pt-5 rounded-md shadow-lg max-w-[210px] border border-outline-variant/30">
                <p className="font-handwriting text-primary text-xl leading-snug">
                  Lost paths lead to the best discoveries 🧭
                </p>
                <div className="mt-2 flex items-center justify-between text-secondary">
                  <span className="text-[9px] font-semibold uppercase tracking-widest">
                    Positano, Italy
                  </span>
                  <Pin className="w-3.5 h-3.5 text-secondary" />
                </div>
              </div>
            </motion.div>

            {/* Bottom Vignette */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative z-10 pt-8"
            >
              <div className="max-w-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary-fixed mb-2">
                  Itinerary Care & Recovery
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-surface-container-lowest font-medium tracking-tight mb-2 leading-[1.15]">
                  Never lose track of your memories.
                </h2>
                <p className="text-xs sm:text-sm text-surface-container-highest/90 font-normal">
                  Secure account recovery in seconds. Seamlessly resume crafting bespoke passages and timeless journeys.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT HALF: Form Column ================= */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-surface-container-low relative">
            <div className="w-full max-w-[420px] flex flex-col">
              {/* Back Link */}
              <div className="mb-8">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200 group text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  <span>Back to log in</span>
                </Link>
              </div>

              {/* State 1: Password Reset Request Form */}
              <AnimatePresence mode="wait">
                {!isConfirmed ? (
                  <motion.div
                    key="view-form"
                    variants={staggerContainer(0.08, 0.05)}
                    initial={prefersReduced ? false : "hidden"}
                    animate="visible"
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col"
                  >
                    <motion.div variants={fadeUp} className="mb-7">
                      <span className="text-xs uppercase tracking-[0.16em] text-secondary font-semibold">
                        Account Recovery
                      </span>
                      <h1 className="font-serif text-3xl sm:text-4xl text-primary leading-tight mt-1 mb-3">
                        Reset your password
                      </h1>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        Enter the email associated with your account and we&apos;ll send you a link to reset your password.
                      </p>
                    </motion.div>

                    {/* Error Alert Banner with Shake Animation */}
                    <AnimatePresence>
                      {errorBanner && (
                        <motion.div
                          key="error-banner"
                          variants={shakeError}
                          initial={prefersReduced ? { opacity: 0 } : "hidden"}
                          animate="visible"
                          exit={{ opacity: 0, y: -6 }}
                          className="mb-5 p-3.5 rounded-2xl bg-surface-container border border-outline-variant/40 text-primary flex items-start gap-3 transition-all duration-300 shadow-sm"
                          role="alert"
                        >
                          <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-primary">
                              Please enter a valid email address
                            </p>
                            <p className="text-xs text-secondary mt-0.5">
                              We could not match this format with an active TripAi account.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setErrorBanner(false)}
                            className="text-secondary hover:text-primary p-1 cursor-pointer"
                            aria-label="Dismiss alert"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Form */}
                    <form
                      className="flex flex-col gap-5"
                      onSubmit={handleFormSubmit}
                      noValidate
                    >
                      <motion.div variants={fadeUp} className="flex flex-col gap-1.5">
                        <label
                          className="text-xs uppercase tracking-wider font-medium text-primary"
                          htmlFor="email-input"
                        >
                          Email address
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="w-4 h-4 text-secondary absolute left-4 pointer-events-none" />
                          <input
                            id="email-input"
                            type="email"
                            autoComplete="email"
                            placeholder="name@example.com"
                            className={`w-full h-12 pl-11 pr-4 rounded-2xl bg-surface-container text-primary placeholder-secondary/70 text-sm outline-none transition-all duration-200 focus:bg-surface-container-lowest focus:shadow-md border ${
                              errors.email
                                ? "border-amber-600 focus:ring-1 focus:ring-amber-600"
                                : "border-outline-variant/30 focus:border-secondary"
                            }`}
                            {...register("email")}
                          />
                        </div>

                        {/* Inline Error with Shake */}
                        <AnimatePresence>
                          {errors.email ? (
                            <motion.p
                              key="email-err"
                              variants={shakeError}
                              initial={prefersReduced ? { opacity: 0 } : "hidden"}
                              animate="visible"
                              exit={{ opacity: 0, y: -4 }}
                              className="text-xs text-amber-800 pl-1"
                            >
                              {errors.email.message}
                            </motion.p>
                          ) : (
                            <p className="text-[12px] text-secondary pl-1 font-light">
                              A recovery dispatch link will be active for 2 hours.
                            </p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div variants={fadeUp}>
                        <motion.button
                          id="submit-btn"
                          type="submit"
                          onClick={syncAutofillValues}
                          {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                          disabled={isLoading || isSubmitting}
                          className="w-full h-12 mt-2 rounded-full bg-primary text-on-primary text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                        >
                          {isLoading || isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-on-primary" />
                              <span>Sending reset link...</span>
                            </>
                          ) : (
                            <span>Send reset link</span>
                          )}
                        </motion.button>
                      </motion.div>
                    </form>

                    {/* Footnote */}
                    <motion.div
                      variants={fadeUp}
                      className="mt-8 pt-6 flex flex-col items-center gap-2 text-center border-t border-outline-variant/20"
                    >
                      <p className="text-sm text-on-surface-variant">
                        Remember your password?
                        <Link
                          href="/login"
                          className="font-semibold text-secondary hover:text-primary transition-colors ml-1.5 underline decoration-secondary/40 underline-offset-4"
                        >
                          Log in
                        </Link>
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-secondary text-[12px]">
                        <Lock className="w-3.5 h-3.5" />
                        <span>End-to-end encrypted itinerary vault</span>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* State 2: Confirmation View with Pop-in Animation */
                  <motion.div
                    key="view-confirmation"
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex flex-col"
                  >
                    {/* Animated Checkmark Circle */}
                    <motion.div
                      initial={prefersReduced ? false : { scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                      }}
                      className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6 shadow-sm border border-outline-variant/30 text-primary"
                    >
                      <MailCheck className="w-8 h-8 text-primary" />
                    </motion.div>

                    <span className="text-xs uppercase tracking-[0.16em] text-secondary font-semibold">
                      Dispatch Sent
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-primary leading-tight mt-1 mb-3">
                      Check your inbox
                    </h2>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                      We&apos;ve sent a password reset link to{" "}
                      <span className="font-semibold text-primary">
                        {submittedEmail || "your email address"}
                      </span>
                      . Click the link in the email to choose a new password.
                    </p>
                    <div className="p-4 rounded-2xl bg-surface-container mb-6 text-on-surface-variant text-[13px] leading-relaxed border border-outline-variant/20">
                      <span className="font-medium text-primary block mb-1">
                        Didn&apos;t receive the email?
                      </span>
                      Check your spam or junk folder, or verify the address was spelled accurately.
                    </div>
                    <div className="flex flex-col gap-3">
                      <motion.button
                        type="button"
                        {...(prefersReduced ? {} : { ...hoverLift, ...tapPress })}
                        onClick={handleResend}
                        className={`w-full h-12 rounded-full font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          resendFeedback
                            ? "bg-secondary-fixed text-primary shadow-sm"
                            : "bg-surface-container hover:bg-secondary-fixed text-primary border border-outline-variant/30"
                        }`}
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            resendFeedback ? "animate-spin" : ""
                          }`}
                        />
                        <span>
                          {resendFeedback
                            ? "Dispatch sent again!"
                            : "Resend email"}
                        </span>
                      </motion.button>
                      <Link
                        href="/login"
                        className="w-full h-12 rounded-full bg-primary text-on-primary text-sm font-medium flex items-center justify-center hover:bg-secondary transition-all duration-200 shadow-sm"
                      >
                        Back to log in
                      </Link>
                    </div>
                    <div className="mt-8 text-center">
                      <span className="text-xs text-secondary">
                        Need direct traveler support?{" "}
                        <Link
                          href="#"
                          className="text-secondary font-semibold hover:underline"
                        >
                          Contact Concierge
                        </Link>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
