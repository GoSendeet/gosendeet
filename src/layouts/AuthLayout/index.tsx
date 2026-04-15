import { useLayoutEffect } from "react";
import Navbar from "@/components/Navbar";
import { LayoutProps } from "@/lib/types";
import { useLocation } from "react-router-dom";


const AuthLayout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const root = document.scrollingElement as HTMLElement | null;
    const html = document.documentElement;
    const body = document.body;
    const previousScrollBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = "auto";

    const scrollToTop = () => {
      window.scrollTo(0, 0);
      if (root) root.scrollTop = 0;
      html.scrollTop = 0;
      body.scrollTop = 0;
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);

    const timeoutId = window.setTimeout(() => {
      scrollToTop();
      html.style.scrollBehavior = previousScrollBehavior;
    }, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </header>
      <main className="pt-18 lg:pt-20 flex-grow">{children}</main>
    </div>
  );
};

export default AuthLayout;
