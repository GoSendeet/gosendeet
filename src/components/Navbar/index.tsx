import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU } from "../../constants";
import logo from "@/assets/images/logo-green.png";
import { HiBars3 } from "react-icons/hi2";
import { GoX } from "react-icons/go";
import { ArrowUpRight, BookOpen, ChevronDown, Home, RadioTower } from "lucide-react";
import { Button } from "../ui/button";
import { hasAuthSession } from "@/lib/authSession";
import { getDefaultRouteForRole } from "@/lib/roles";

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

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const location = useLocation(); // Get current location

  const isAuthenticated = hasAuthSession();
  const role = sessionStorage.getItem("role") || "";


  return (
    <nav className="bg-white backdrop-blur-md">
      <div className="flex justify-between items-center py-5 lg:py-5 xl:px-30 md:px-20 px-3 border-b border-b-neutral300">
        {/* Logo or Brand Name */}
        <div>
          <Link to="/">
            <img src={logo} alt="logo" className="h-8 md:h-9 w-auto" />
          </Link>
        </div>

        {/* Hamburger Icon (mobile view) */}
        <div className="lg:hidden flex items-center gap-4">
          {!isAuthenticated ? (
            location.pathname === "/signin" ? (
              <Link to="/signup">
                <Button size={"sm"} className="bg-green100">
                  Sign Up
                  <ArrowUpRight />
                </Button>
              </Link>
            ) : (
              <Link to="/signin">
                <Button size={"sm"} className="bg-green100">
                  Sign In
                  <ArrowUpRight />
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
        <ul className="hidden lg:flex xl:space-x-16 lg:space-x-6 items-center">
          {MENU.map((link, index) => {
            const isActive = link.route === location.pathname;
            return (
              <li
                key={index}
                className=" text-center rounded-3xl cursor-pointer"
              >
                <Link
                  to={link.route}
                  className={`block py-2 text-neutral600 hover:border-b-2   ${
                    isActive ? "border-b-2 " : ""
                  }`}
                >
                  {link.title}
                </Link>
              </li>
            );
          })}
          <li className="relative group text-center rounded-3xl cursor-pointer">
            <button
              type="button"
              className={`flex items-center gap-1 py-2 text-neutral600 hover:border-b-2 ${
                location.pathname.startsWith("/developer") ||
                location.pathname === "/status"
                  ? "border-b-2"
                  : ""
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
                <ArrowUpRight />
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

        {/* Links (mobile view) */}
        <div
          className={`lg:hidden absolute top-0 left-0 w-full md:min-h-[70vh] h-[90vh] z-20 bg-white py-6 md:px-20 px-10 transition-transform duration-300 ${
            navOpen ? "transform translate-x-0" : "transform -translate-x-full"
          }`}
        >
          <div className="flex justify-between">
            <p>MENU</p>

            <button onClick={handleNavToggle}>
              <GoX size={26} />
            </button>
          </div>

          <ul className="flex flex-col my-[3rem]">
            {MENU.map((link, index) => {
              const isActive = link.route === location.pathname;
              return (
                <Link
                  to={link.route}
                  className="hover:text-gray-300 my-3 w-[80%]"
                  key={index}
                >
                  <li
                    className={` w-full  hover:bg-white cursor-pointer ${
                      isActive ? " text-green500 " : ""
                    }`}
                  >
                    {link.title}
                  </li>
                </Link>
              );
            })}
            <li className="mt-6 mb-2 text-xs font-bold uppercase text-neutral500">
              Developer
            </li>
            {developerLinks.map((link) => {
              const isActive = link.route === location.pathname;
              return (
                <Link
                  to={link.route}
                  className={`my-2 w-[80%] ${
                    isActive ? "text-green500" : "text-neutral700"
                  }`}
                  key={link.route}
                  onClick={() => setNavOpen(false)}
                >
                  {link.title}
                </Link>
              );
            })}
          </ul>

          {!isAuthenticated && (
            <>
              <Link to="/signin">
                <button className="border-2 w-full font-semibold px-4 py-4 text-white bg-black rounded mb-4">
                  Sign In
                </button>
              </Link>

              <Link to="/signup">
                <button className="border-2 w-full font-semibold px-4 py-4 text-black bg-white rounded">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
