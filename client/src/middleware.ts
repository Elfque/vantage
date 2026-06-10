import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const unauthenticatedPages = ["/auth", "/auth/signup"];
    const viewPage = pathname.startsWith("/portfolio/view");

    const isPublicPage = unauthenticatedPages.some((page) =>
      pathname.startsWith(page),
    );

    if (req.nextauth.token) {
      if (isPublicPage) {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
      } else if (viewPage) {
        return NextResponse.next();
      }
    } else {
      if (!isPublicPage) {
        const url = new URL("/auth", req.url);
        return NextResponse.redirect(url);
      }
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
