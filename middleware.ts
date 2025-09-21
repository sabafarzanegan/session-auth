import { NextRequest, NextResponse } from "next/server";

// specify routes
const privateRoutes = ["/"];
const adminRoute = ["/admin"];
const authRoutes = ["/auth/sign-in", "/auth/register"];

// create middleware function

export async function middleware(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();
  return response;
}

export async function middlewareAuth(request: NextRequest) {
  const sessionId = request.cookies.get("session-id")?.value;
  const path = request.nextUrl.pathname;

  if (!sessionId && privateRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  if (!sessionId && adminRoute.includes(path)) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
  if (sessionId && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
