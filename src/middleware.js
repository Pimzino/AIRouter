import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "9router-default-secret-change-me"
);

// Routes that require authentication but should return 401 JSON instead of redirect
const API_PROTECTED_ROUTES = [
  "/api/settings",
  "/api/providers",
  "/api/keys",
  "/api/combos",
  "/api/shutdown",
  "/api/sync",
  "/api/pricing",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all dashboard routes (redirect to login)
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect sensitive API routes (return 401 JSON)
  const isProtectedApi = API_PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtectedApi) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  // Redirect / to /dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/api/settings/:path*",
    "/api/providers/:path*",
    "/api/keys/:path*",
    "/api/combos/:path*",
    "/api/shutdown",
    "/api/sync/:path*",
    "/api/pricing/:path*",
  ],
};
