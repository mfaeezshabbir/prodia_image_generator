"use client";

import { usePathname } from "next/navigation";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

// Routes that should not have the navigation and footer
const excludeNavFooterRoutes = ["/login", "/signup"];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const shouldRenderNavFooter = !excludeNavFooterRoutes.includes(pathname);
  
  return (
    <>
      {shouldRenderNavFooter && <Navigation />}
      {children}
      {shouldRenderNavFooter && <Footer />}
    </>
  );
}
