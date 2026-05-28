import { useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardFooter from "@/components/DashboardFooter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LayoutProps } from "@/lib/types";

const BookingFlowLayout = ({ children }: LayoutProps) => {
  const isLoggedIn = !!sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [activeTab] = useState(
    () => sessionStorage.getItem("dashboardTab") || "overview",
  );

  const handleTabChange = (tab: string) => {
    sessionStorage.setItem("dashboardTab", tab);
    navigate("/dashboard");
  };

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    const rafId = requestAnimationFrame(() => window.scrollTo(0, 0));
    const timeoutId = window.setTimeout(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previousScrollBehavior;
    }, 50);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [pathname]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </header>
        <main className="pt-18 lg:pt-20 flex-grow">{children}</main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <DashboardNavbar activeTab={activeTab} onTabChange={handleTabChange} />
      </header>
      <main className="flex-grow pt-18 lg:pt-20">{children}</main>
      <footer>
        <DashboardFooter />
      </footer>
    </div>
  );
};

export default BookingFlowLayout;
