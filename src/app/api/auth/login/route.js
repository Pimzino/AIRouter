import { NextResponse } from "next/server";
import { getSettings } from "@/lib/localDb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { loginRateLimiter } from "@/lib/rateLimit";
import { getClientIp, getRateLimitKey } from "@/lib/getClientIp";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "9router-default-secret-change-me"
);

export async function POST(request) {
  // Get rate limit key based on client IP
  const rateLimitKey = getRateLimitKey(request, "login");
  const clientIp = getClientIp(request);

  // Check rate limit BEFORE processing
  const rateCheck = loginRateLimiter.check(rateLimitKey);

  if (!rateCheck.allowed) {
    console.log(`[RATE_LIMIT] Blocked login attempt from IP: ${clientIp}`);

    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later.",
        retryAfter: rateCheck.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateCheck.retryAfter),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(rateCheck.resetTime / 1000)),
        },
      }
    );
  }

  try {
    const { password } = await request.json();

    // Input validation
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: "Password too long" },
        { status: 400 }
      );
    }

    const settings = await getSettings();

    // Default password is '123456' if not set
    const storedHash = settings.password;

    let isValid = false;
    if (!storedHash) {
      isValid = password === "123456";
    } else {
      isValid = await bcrypt.compare(password, storedHash);
    }

    if (isValid) {
      // Clear rate limit on successful login
      loginRateLimiter.reset(rateLimitKey);

      const token = await new SignJWT({ authenticated: true })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(SECRET);

      const cookieStore = await cookies();
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
      });

      return NextResponse.json({ success: true });
    }

    // Record failed attempt
    loginRateLimiter.recordAttempt(rateLimitKey);
    const updatedCheck = loginRateLimiter.check(rateLimitKey);

    console.log(
      `[LOGIN_FAILED] IP: ${clientIp}, Remaining attempts: ${updatedCheck.remaining}`
    );

    return NextResponse.json(
      {
        error: "Invalid password",
        remainingAttempts: updatedCheck.remaining,
      },
      {
        status: 401,
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(updatedCheck.remaining),
          "X-RateLimit-Reset": String(
            Math.floor(updatedCheck.resetTime / 1000)
          ),
        },
      }
    );
  } catch (error) {
    // Don't count parse errors against rate limit
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
