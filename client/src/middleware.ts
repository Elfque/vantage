import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const unauthenticatedPages = ["/auth", "/auth/signup"];

    const isUnauthenticatedPage = unauthenticatedPages.some((page) =>
      new RegExp(`^${page.replace("*", ".*")}$`).test(pathname)
    );

    if (req.nextauth.token) {
      if (isUnauthenticatedPage) {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
      }
    } else {
      if (!isUnauthenticatedPage) {
        const url = new URL("/auth", req.url);
        return NextResponse.redirect(url);
      }
    }
  },

  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
