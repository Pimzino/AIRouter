"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/shared/components";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRemainingAttempts(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();

        if (res.status === 429) {
          // Rate limited
          const retryAfter = data.retryAfter || 900;
          const minutes = Math.ceil(retryAfter / 60);
          setError(
            `Too many attempts. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`
          );
          setRemainingAttempts(0);
        } else {
          setError(data.error || "Invalid password");
          if (data.remainingAttempts !== undefined) {
            setRemainingAttempts(data.remainingAttempts);
          }
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">AIRouter</h1>
          <p className="text-text-muted">Enter your password to access the dashboard</p>
        </div>

        <Card>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <p className="text-xs text-yellow-600">
                  {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
              disabled={remainingAttempts === 0}
            >
              Login
            </Button>

          </form>
        </Card>
      </div>
    </div>
  );
}
