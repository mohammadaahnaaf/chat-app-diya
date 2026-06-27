"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      setLoading(false);
      return;
    }

    router.push("/chat");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-4"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(180,130,40,0.08) 28px, rgba(180,130,40,0.08) 29px)" }}
    >
      <div className="w-full max-w-md bg-parchment-light border-2 border-golden rounded-sm shadow-[4px_4px_0_#b8860b] p-8">
        <div className="border-b-2 border-golden pb-4 mb-6">
          <h1 className="text-3xl font-bold text-brown-dark tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
            Welcome Back
          </h1>
          <p className="text-sm text-brown-mid mt-1">
            No account yet?{" "}
            <Link href="/register" className="text-crimson hover:text-crimson-dark underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1 uppercase tracking-wider">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-sm border-2 border-brown-light bg-cream px-4 py-2.5 text-sm text-brown-dark placeholder:text-brown-light focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brown-dark mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Your password"
              className="w-full rounded-sm border-2 border-brown-light bg-cream px-4 py-2.5 text-sm text-brown-dark placeholder:text-brown-light focus:outline-none focus:border-golden focus:ring-1 focus:ring-golden"
            />
          </div>

          {error && (
            <p className="text-sm text-crimson font-semibold border border-crimson bg-red-50 px-3 py-2 rounded-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-crimson hover:bg-crimson-dark disabled:opacity-60 text-parchment-light font-bold py-2.5 text-sm tracking-widest uppercase transition-colors border-2 border-brown-dark shadow-[2px_2px_0_#1e0d04]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
