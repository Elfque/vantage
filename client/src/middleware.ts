import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Auth-only pages that logged-in users shouldn't see
    const authPages = ["/auth", "/auth/signup"];
    const isAuthPage = authPages.some((page) => pathname.startsWith(page));
    
    // Fully public pages that anyone can view
    const isLandingPage = pathname === "/";
    const isPortfolioView = pathname.startsWith("/portfolio/view");
    const isPublicPage = isAuthPage || isLandingPage || isPortfolioView;

    if (req.nextauth.token) {
      // Logged-in users going to auth pages or landing page are redirected to dashboard
      if (isAuthPage || isLandingPage) {
        const url = new URL("/dashboard", req.url);
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    } else {
      // Guest users going to protected pages are redirected to auth
      if (!isPublicPage) {
        const url = new URL("/auth", req.url);
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
  },

  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
