import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU } from "../../constants";
import logo from "@/assets/images/logo-green.png";
import { HiBars3 } from "react-icons/hi2";
import { GoX } from "react-icons/go";
import { BookOpen, ChevronDown, Home, RadioTower, Package, Truck, Building2, Briefcase, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { hasAuthSession } from "@/lib/authSession";
import { getDefaultRouteForRole } from "@/lib/roles";

const serviceLinks = [
  {
    title: "Delivery Service",
    route: "/delivery-service",
    description: "Book same-day and next-day delivery",
    icon: Package,
  },
  {
    title: "Courier Service",
    route: "/courier-service",
    description: "Compare courier companies in Nigeria",
    icon: Truck,
  },
  {
    title: "Logistics",
    route: "/logistics",
    description: "Logistics solutions for businesses",
    icon: Building2,
  },
  {
    title: "Business Delivery",
    route: "/business-delivery",
    description: "Delivery for companies and teams",
    icon: Briefcase,
  },
  {
    title: "E-commerce Delivery",
    route: "/ecommerce-delivery",
    description: "Ship orders from your online store",
    icon: ShoppingBag,
  },
];

const developerLinks = [
  {
    title: "Documentation",
    route: "/developer/documentation",
    description: "API guides and integration notes",
    icon: BookOpen,
  },
  {
    title: "Status page",
    route: "/status",
    description: "Realtime platform health",
    icon: RadioTower,
  },
];

const Navbar = () => {
  const navigate = useNavigate();

  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const location = useLocation();

  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role") || "";

  return (
    <nav
      className={`transition-all duration-300 bg-white ${
        scrolled
          ? "shadow-sm border-b border-neutral300"
          : "border-b border-b-neutral300"
      }`}
    >
      <div className="flex justify-between items-center py-5 lg:py-5 xl:px-30 md:px-20 px-3">
        {/* Logo or Brand Name */}
        <div>
          <Link to="/">
            <img src={logo} alt="GoSendeet" className="h-8 md:h-9 w-auto" />
          </Link>
        </div>

        {/* Hamburger Icon (mobile view) */}
        <div className="lg:hidden flex items-center gap-4">
          {!isAuthenticated ? (
            location.pathname === "/signin" ? (
              <Link to="/signup">
                <Button size={"sm"} className="bg-green100">
                  Sign Up
                </Button>
              </Link>
            ) : (
              <Link to="/signin">
                <Button size={"sm"} className="bg-green100">
                  Sign In
                </Button>
              </Link>
            )
          ) : (
            <>
              <Home
                className="text-green500"
                size={24}
                onClick={() => navigate(getDefaultRouteForRole(role))}
              />
            </>
          )}
          <button onClick={handleNavToggle}>
            <HiBars3 size={24} />
          </button>
        </div>

        {/* Links (desktop view) */}
        <ul className="hidden lg:flex xl:space-x-10 lg:space-x-6 items-center">
          {MENU.map((link, index) => {
            const isActive = link.route === location.pathname;
            return (
              <li key={index} className="text-center cursor-pointer">
                <Link
                  to={link.route}
                  className={`relative block py-2 text-sm text-neutral600 transition-colors duration-200 hover:text-blue100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-green500 after:transition-all after:duration-300 ${
                    isActive ? "text-blue100 after:w-full" : "after:w-0 hover:after:w-full"
                  }`}
                >
                  {link.title}
                </Link>
              </li>
            );
          })}
          <li className="relative group text-center cursor-pointer">
            <button
              type="button"
              className={`relative flex items-center gap-1 py-2 text-sm text-neutral600 transition-colors duration-200 hover:text-blue100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-green500 after:transition-all after:duration-300 ${
                location.pathname === "/delivery-service" ||
                location.pathname === "/courier-service" ||
                location.pathname === "/logistics" ||
                location.pathname === "/business-delivery" ||
                location.pathname === "/ecommerce-delivery"
                  ? "text-blue100 after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
            >
              Services
              <ChevronDown className="size-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-30 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-neutral300 bg-white p-2 text-left shadow-xl">
                {serviceLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.route}
                      to={item.route}
                      className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-green300"
                    >
                      <span className="mt-0.5 rounded-lg bg-green300 p-2 text-green700">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="block font-semibold text-blue100">
                          {item.title}
                        </span>
                        <span className="block text-xs text-neutral600">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </li>
          <li className="relative group text-center cursor-pointer">
            <button
              type="button"
              className={`relative flex items-center gap-1 py-2 text-sm text-neutral600 transition-colors duration-200 hover:text-blue100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-green500 after:transition-all after:duration-300 ${
                location.pathname.startsWith("/developer") ||
                location.pathname === "/status"
                  ? "text-blue100 after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
            >
              Developer
              <ChevronDown className="size-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-30 w-72 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-neutral300 bg-white p-2 text-left shadow-xl">
                {developerLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.route}
                      to={item.route}
                      className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-green300"
                    >
                      <span className="mt-0.5 rounded-lg bg-green300 p-2 text-green700">
                        <Icon className="size-4" />
                      </span>
                      <span>
                        <span className="block font-semibold text-blue100">
                          {item.title}
                        </span>
                        <span className="block text-xs text-neutral600">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </li>
        </ul>

        {!isAuthenticated ? (
          <div className="hidden lg:flex lg:flex-row gap-8 flex-col">
            <Link to="/signup">
              <Button size={"sm"} variant="outline">
                Sign Up
              </Button>
            </Link>

            <Link to="/signin">
              <Button size={"sm"} className="bg-green100">
                Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div
              className="hidden lg:flex items-center gap-2 text-green500 cursor-pointer"
              onClick={() => navigate(getDefaultRouteForRole(role))}
            >
              <Home className="text-green500" size={24} />
              <span>Dashboard</span>
            </div>
          </>
        )}

        {/* Mobile backdrop */}
        <div
          className={`lg:hidden fixed inset-0 z-10 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            navOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />

        {/* Links (mobile view) */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-[85%] max-w-sm h-full z-20 bg-white py-6 md:px-20 px-8 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <Link to="/" onClick={() => setNavOpen(false)}>
              <img src={logo} alt="logo" className="h-7 w-auto" />
            </Link>
            <button
              onClick={handleNavToggle}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <GoX size={22} />
            </button>
          </div>

          <ul className="flex flex-col mt-8 flex-1">
            {MENU.map((link, index) => {
              const isActive = link.route === location.pathname;
              return (
                <Link
                  to={link.route}
                  className={`my-1 w-full transition-all duration-200 ${
                    navOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: navOpen ? `${index * 50}ms` : "0ms" }}
                  key={index}
                  onClick={() => setNavOpen(false)}
                >
                  <li
                    className={`px-3 py-3 rounded-xl font-medium cursor-pointer transition-colors duration-150 ${
                      isActive
                        ? "text-green500 bg-green-50"
                        : "text-neutral700 hover:bg-gray-50 hover:text-blue100"
                    }`}
                  >
                    {link.title}
                  </li>
                </Link>
              );
            })}
            <li
              className={`mt-5 mb-2 px-3 text-xs font-bold uppercase text-neutral500 tracking-wider transition-all duration-200 ${
                navOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: navOpen ? `${MENU.length * 50}ms` : "0ms" }}
            >
              Services
            </li>
            {serviceLinks.map((link, i) => {
              const isActive = link.route === location.pathname;
              return (
                <Link
                  to={link.route}
                  className={`my-1 w-full transition-all duration-200 ${
                    navOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: navOpen ? `${(MENU.length + 1 + i) * 50}ms` : "0ms" }}
                  key={link.route}
                  onClick={() => setNavOpen(false)}
                >
                  <span
                    className={`block px-3 py-3 rounded-xl font-medium transition-colors duration-150 ${
                      isActive
                        ? "text-green500 bg-green-50"
                        : "text-neutral700 hover:bg-gray-50 hover:text-blue100"
                    }`}
                  >
                    {link.title}
                  </span>
                </Link>
              );
            })}
            <li
              className={`mt-5 mb-2 px-3 text-xs font-bold uppercase text-neutral500 tracking-wider transition-all duration-200 ${
                navOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: navOpen ? `${(MENU.length + serviceLinks.length + 1) * 50}ms` : "0ms" }}
            >
              Developer
            </li>
            {developerLinks.map((link, i) => {
              const isActive = link.route === location.pathname;
              return (
                <Link
                  to={link.route}
                  className={`my-1 w-full transition-all duration-200 ${
                    navOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: navOpen ? `${(MENU.length + 1 + i) * 50}ms` : "0ms" }}
                  key={link.route}
                  onClick={() => setNavOpen(false)}
                >
                  <span
                    className={`block px-3 py-3 rounded-xl font-medium transition-colors duration-150 ${
                      isActive
                        ? "text-green500 bg-green-50"
                        : "text-neutral700 hover:bg-gray-50 hover:text-blue100"
                    }`}
                  >
                    {link.title}
                  </span>
                </Link>
              );
            })}
          </ul>

          {!isAuthenticated && (
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <Link to="/signin" onClick={() => setNavOpen(false)}>
                <button className="w-full font-semibold px-4 py-3.5 text-white bg-green100 rounded-xl hover:bg-green-800 transition-colors duration-200">
                  Sign In
                </button>
              </Link>
              <Link to="/signup" onClick={() => setNavOpen(false)}>
                <button className="w-full font-semibold px-4 py-3.5 text-blue100 bg-white border-2 border-gray-200 rounded-xl hover:border-green100 transition-colors duration-200">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
