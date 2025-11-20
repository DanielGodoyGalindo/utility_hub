// https://next-auth.js.org/tutorials/securing-pages-and-api-routes#nextjs-middleware
export { default } from "next-auth/middleware";

// https://next-auth.js.org/configuration/nextjs#advanced-usage
export const config = {
  matcher: [
    "/todo/:path*",      
    "/weather/:path*", 
    "/weatherApi/:path*",
    "/news/:path*",
    "/editor/:path*",
    "/kanban/:path*",
  ],
};