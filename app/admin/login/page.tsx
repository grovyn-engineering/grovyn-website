"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ACCENT = "#00e676";
const ACCENT_DIM = "rgba(0, 230, 118, 0.55)";

type Flow = "signin" | "otp" | "forgot_send" | "forgot_complete";

/**
 * Href must match SSR + first client paint. `NEXT_PUBLIC_*` can differ between
 * server and client in dev, which triggers hydration errors if used inline.
 */
function RecoverKeyLink({ className }: { className?: string }) {
  const [href, setHref] = useState("/en");

  useEffect(() => {
    const e = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
    if (e) setHref(`mailto:${e}?subject=Grovyn%20admin%20recovery`);
  }, []);

  return (
    <a href={href} className={className}>
      Recover key?
    </a>
  );
}

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [keepSession, setKeepSession] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [flow, setFlow] = useState<Flow>("signin");
  const [resendSeconds, setResendSeconds] = useState(0);
  const router = useRouter();

  const apiBase = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

  useEffect(() => {
    const base = apiBase();
    if (!base) {
      setApiOnline(false);
      return;
    }
    fetch(`${base}/`, { method: "GET" })
      .then((r) => setApiOnline(r.ok))
      .catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = setInterval(() => setResendSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendSeconds]);

  const resetToSignin = () => {
    setFlow("signin");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setInfo("");
    setResendSeconds(0);
  };

  const handlePasswordStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const base = apiBase();
      const res = await fetch(`${base}/admin/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.step === "otp_required") {
        setFlow("otp");
        setInfo(data.message || "Check your email for a sign-in code.");
        return;
      }

      setError(data.message || "Failed to sign in");
    } catch {
      setError("Could not reach the API. Check NEXT_PUBLIC_API_URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const base = apiBase();
      const res = await fetch(`${base}/admin/auth/verify-login-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim(), keepSession }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        return;
      }

      setError(data.message || "Invalid code");
    } catch {
      setError("Could not reach the API.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const base = apiBase();
      const res = await fetch(`${base}/admin/auth/resend-login-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setInfo(data.message || "A new code was sent.");
        if (typeof data.seconds_remaining === "number") {
          setResendSeconds(data.seconds_remaining);
        } else {
          setResendSeconds(60);
        }
        return;
      }

      if (res.status === 429 && typeof data.seconds_remaining === "number") {
        setResendSeconds(data.seconds_remaining);
        setError(data.message || "Please wait before resending.");
        return;
      }

      setError(data.message || "Could not resend");
    } catch {
      setError("Could not reach the API.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const base = apiBase();
      const res = await fetch(`${base}/admin/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 429 && typeof data.seconds_remaining === "number") {
        setResendSeconds(data.seconds_remaining);
        setError(data.message || "Please wait before trying again.");
        return;
      }

      if (data.success) {
        setFlow("forgot_complete");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setInfo(data.message || "If an account exists, a code was sent.");
        return;
      }

      setError(data.message || "Request failed");
    } catch {
      setError("Could not reach the API.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const base = apiBase();
      const verifyRes = await fetch(`${base}/admin/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        setError(verifyData.message || "Invalid code");
        return;
      }

      const resetRes = await fetch(`${base}/admin/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const resetData = await resetRes.json();

      if (resetData.success) {
        setFlow("signin");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setPassword("");
        setError("");
        setResendSeconds(0);
        setInfo(resetData.message || "Password updated. Sign in below.");
        return;
      }

      setError(resetData.message || "Could not reset password");
    } catch {
      setError("Could not reach the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-black text-zinc-100 lg:flex-row">
      <section className="relative flex min-h-[42vh] shrink-0 flex-col justify-center overflow-hidden px-8 py-12 lg:min-h-dvh lg:w-[46%] lg:max-w-2xl lg:px-12 lg:py-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 85% 65% at 50% 120%, rgba(0, 230, 118, 0.06), transparent 50%),
              radial-gradient(circle at 15% 25%, rgba(0, 230, 118, 0.08) 0%, transparent 42%),
              radial-gradient(circle at 85% 15%, rgba(0, 230, 118, 0.05) 0%, transparent 38%),
              #030605
            `,
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(88vw,520px)] w-[min(88vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed opacity-[0.12]"
          style={{ borderColor: ACCENT_DIM }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(62vw,360px)] w-[min(62vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-[0.1]"
          style={{ borderColor: ACCENT_DIM }}
          aria-hidden
        />
        <div className="relative z-[1] max-w-lg">
          <h1 className="text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Accelerating global{" "}
            <span className="font-semibold" style={{ color: ACCENT }}>
              growth
            </span>{" "}
            through intelligence.
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-zinc-500 sm:text-base">
            Access the next generation of automated operations and infrastructure management.
          </p>
        </div>
      </section>

      <main className="relative flex flex-1 flex-col bg-[#0a0a0a] lg:border-l lg:border-zinc-800/80">
        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <header className="mb-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0d1f16] ring-1 ring-[#00e676]/35">
                  <Image
                    src="/grovyn_logo.png"
                    alt="Grovyn"
                    width={44}
                    height={44}
                    className="h-8 w-auto object-contain"
                    priority
                  />
                </div>
                <span className="text-lg font-bold tracking-[0.12em] text-white">GROVYN</span>
              </div>
              <p className="text-sm text-zinc-500">
                {flow === "otp"
                  ? "Enter the code sent to your email to finish signing in."
                  : flow === "forgot_send" || flow === "forgot_complete"
                    ? "Reset your admin password using email verification."
                    : "Enter your credentials; you will confirm with an email code."}
              </p>
            </header>

            {error && (
              <div
                className="mb-6 border border-red-500/40 bg-red-950/40 px-3 py-2.5 font-mono text-xs text-red-300"
                role="alert"
              >
                {error}
              </div>
            )}

            {info && !error && (
              <div
                className="mb-6 border border-[#00e676]/30 bg-[#0d1f16]/60 px-3 py-2.5 font-mono text-xs text-[#7dffc0]"
                role="status"
              >
                {info}
              </div>
            )}

            {flow === "signin" && (
              <form onSubmit={handlePasswordStep} className="space-y-6">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                  >
                    Operator identity
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-zinc-700 bg-[#111111] px-3.5 py-3 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#00e676]/60 focus:ring-1 focus:ring-[#00e676]/40"
                    placeholder="name@grovyn.io"
                    required
                    autoComplete="username"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-end justify-between gap-2">
                    <label
                      htmlFor="admin-password"
                      className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                    >
                      Encrypted key
                    </label>
                    <RecoverKeyLink className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#00e676]/90 hover:text-[#00e676]" />
                  </div>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-zinc-700 bg-[#111111] px-3.5 py-3 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#00e676]/60 focus:ring-1 focus:ring-[#00e676]/40"
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 font-mono text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={keepSession}
                    onChange={(e) => setKeepSession(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-zinc-600 bg-[#111] accent-[#00e676] focus:ring-1 focus:ring-[#00e676]/50"
                  />
                  Keep session active
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 outline-none transition disabled:opacity-50"
                  style={{ backgroundColor: ACCENT }}
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </>
                  )}
                </button>

                <p className="text-center font-mono text-[10px] text-zinc-500">
                  <button
                    type="button"
                    onClick={() => {
                      setFlow("forgot_send");
                      setError("");
                      setInfo("");
                    }}
                    className="text-[#00e676]/90 hover:text-[#00e676]"
                  >
                    Forgot password?
                  </button>
                </p>
              </form>
            )}

            {flow === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </label>
                  <p className="font-mono text-sm text-zinc-300">{email}</p>
                </div>
                <div>
                  <label
                    htmlFor="admin-otp"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                  >
                    Sign-in code
                  </label>
                  <input
                    id="admin-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={8}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-zinc-700 bg-[#111111] px-3.5 py-3 font-mono text-sm tracking-[0.3em] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#00e676]/60 focus:ring-1 focus:ring-[#00e676]/40"
                    placeholder="000000"
                    required
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 font-mono text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={keepSession}
                    onChange={(e) => setKeepSession(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-zinc-600 bg-[#111] accent-[#00e676] focus:ring-1 focus:ring-[#00e676]/50"
                  />
                  Keep session active
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 outline-none transition disabled:opacity-50"
                  style={{ backgroundColor: ACCENT }}
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                  ) : (
                    <>
                      Verify &amp; enter
                      <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={resetToSignin}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={loading || resendSeconds > 0}
                    onClick={handleResendOtp}
                    className="text-[#00e676]/90 hover:text-[#00e676] disabled:opacity-40"
                  >
                    {resendSeconds > 0 ? `Resend (${resendSeconds}s)` : "Resend code"}
                  </button>
                </div>
              </form>
            )}

            {flow === "forgot_send" && (
              <form onSubmit={handleForgotRequest} className="space-y-6">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                  >
                    Account email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-zinc-700 bg-[#111111] px-3.5 py-3 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#00e676]/60 focus:ring-1 focus:ring-[#00e676]/40"
                    placeholder="name@grovyn.io"
                    required
                    autoComplete="username"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 outline-none transition disabled:opacity-50"
                  style={{ backgroundColor: ACCENT }}
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                  ) : (
                    "Send reset code"
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetToSignin}
                  className="flex w-full items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  Back to sign in
                </button>
              </form>
            )}

            {flow === "forgot_complete" && (
              <form onSubmit={handleForgotComplete} className="space-y-6">
                <div>
                  <label className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </label>
                  <p className="font-mono text-sm text-zinc-300">{email}</p>
                </div>
                <div>
                  <label
                    htmlFor="reset-otp"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                  >
                    Reset code
                  </label>
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-zinc-700 bg-[#111111] px-3.5 py-3 font-mono text-sm tracking-[0.3em] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#00e676]/60 focus:ring-1 focus:ring-[#00e676]/40"
                    placeholder="000000"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-pass"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                  >
                    New password
                  </label>
                  <input
                    id="new-pass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-zinc-700 bg-[#111111] px-3.5 py-3 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#00e676]/60 focus:ring-1 focus:ring-[#00e676]/40"
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-pass"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm-pass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-zinc-700 bg-[#111111] px-3.5 py-3 font-mono text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#00e676]/60 focus:ring-1 focus:ring-[#00e676]/40"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-950 outline-none transition disabled:opacity-50"
                  style={{ backgroundColor: ACCENT }}
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                  ) : (
                    "Update password"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFlow("forgot_send");
                    setError("");
                  }}
                  className="flex w-full items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  Request a new code
                </button>
              </form>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-6 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <Link href="/en" className="text-zinc-400 transition hover:text-white">
                ← Public site
              </Link>
              <div className="flex flex-wrap items-center gap-4 text-[#00e676]/90">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e676]" aria-hidden />
                  Node.secure
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${apiOnline === true ? "bg-[#00e676]" : apiOnline === false ? "bg-red-500" : "bg-zinc-600"}`}
                    aria-hidden
                  />
                  {apiOnline === null ? "Api…" : apiOnline ? "Api.online" : "Api.offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="pointer-events-none px-6 pb-4 text-right font-mono text-[10px] uppercase tracking-widest text-zinc-700 lg:px-14">
          © 2026 Grovyn systems // Level 4 authorization required
        </p>
      </main>
    </div>
  );
}
