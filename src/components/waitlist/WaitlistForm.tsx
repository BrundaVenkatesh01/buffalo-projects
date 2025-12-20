"use client";

import { useState, type FormEvent } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      // Store in localStorage for now (can be upgraded to a backend/database later)
      const raw = localStorage.getItem("bp_waitlist");
      let waitlist: string[] = [];
      if (raw) {
        try {
          const parsed: unknown = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            waitlist = parsed.filter((v): v is string => typeof v === "string");
          }
        } catch {
          // ignore corrupt storage
        }
      }

      // Check if email already exists
      if (waitlist.includes(email)) {
        setStatus("error");
        setMessage("This email is already on the waitlist!");
        return;
      }

      // Add to waitlist
      waitlist.push(email);
      localStorage.setItem("bp_waitlist", JSON.stringify(waitlist));

      setStatus("success");
      setMessage("You're on the list! We'll notify you when we launch.");
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error("Waitlist error:", error);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-white mb-2">
        Get Early Access
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Join the waitlist to be notified when we launch
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          required
          aria-label="Email address"
        />

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading"
            ? "Joining..."
            : status === "success"
              ? "Joined!"
              : "Join Waitlist"}
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            status === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-300"
              : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      {status === "success" && (
        <p className="mt-4 text-xs text-slate-500 text-center">
          Check your email for confirmation (coming soon)
        </p>
      )}
    </div>
  );
}
