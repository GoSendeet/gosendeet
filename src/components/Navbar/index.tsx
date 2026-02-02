import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU } from "../../constants";
import logo from "@/assets/images/gosendeet-black-logo.png";
import { HiBars3 } from "react-icons/hi2";
import { GoX } from "react-icons/go";
// import { useGetUserDetails } from "@/queries/user/useGetUserDetails";
import { ArrowUpRight, Home } from "lucide-react";
import { Button } from "../ui/button";

const Navbar = () => {
  const navigate = useNavigate();

  const [navOpen, setNavOpen] = useState(false);

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const location = useLocation(); // Get current location

  const authToken = sessionStorage.getItem("authToken");
  const role = sessionStorage.getItem("role") || "";

  // const userId = sessionStorage.getItem("userId") || "";
  // const { data: userData, refetchUserData } = useGetUserDetails(userId);
  // const username = userData?.data?.username;
  // const letter = username?.charAt(0).toUpperCase();

  // useEffect(() => {
  //   if (userId) {
  //     refetchUserData();
  //   }
  // }, [userId]);
  return (
    <nav className="w-full z-20 bg-[#FFFFFF1A] ">
      <div className="flex justify-between items-center py-3 lg:py-5 xl:px-30 md:px-20 px-6 border-b border-b-neutral300">
        {/* Logo or Brand Name */}
        <div>
          <Link to="/">
            <img src={logo} alt="logo" className="h-8 md:h-9 w-auto" />
          </Link>
        </div>

        {/* Hamburger Icon (mobile view) */}
        <div className="lg:hidden flex items-center gap-4">
          {authToken === null ? (
            <Link to="/signin">
              <Button size={'sm'} className="bg-green100">
                Sign In
                <ArrowUpRight />
              </Button>
            </Link>
          ) : (
            <>
              {/* <div
                className="w-[40px] h-[40px] flex justify-center items-center font-bold text-md rounded-full text-white bg-purple500 cursor-pointer"
                onClick={() => {
                  role === "user" && navigate("/dashboard");
                  role === "super_admin" && navigate("/admin-dashboard");
                }}
              >
                {letter}
              </div> */}
              <Home
                className="text-orange500"
                size={24}
                onClick={() => {
                  role === "user" && navigate("/dashboard");
                  role === "super_admin" && navigate("/admin-dashboard");
                }}
              />
            </>
          )}
          <button onClick={handleNavToggle}>
            <HiBars3 size={24} />
          </button>
        </div>

        {/* Links (desktop view) */}
        <ul className="hidden lg:flex xl:space-x-16 lg:space-x-6">
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
        </ul>

        {authToken === null ? (
          <div className="hidden lg:flex lg:flex-row gap-8 flex-col">
            <Link to="/signup">
              <Button size={'lg'} variant="outline">
                Become a Franchise
              </Button>
            </Link>

            <Link to="/signin">
              <Button size={'sm'} className="bg-green100">
                Sign In
                <ArrowUpRight />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div
              className="hidden lg:flex items-center gap-2 text-orange500 cursor-pointer"
              onClick={() => {
                role === "user" && navigate("/dashboard");
                role === "super_admin" && navigate("/admin-dashboard");
              }}
            >
              <Home className="text-orange500" size={24} />
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
                      isActive ? " text-orange500 " : ""
                    }`}
                  >
                    {link.title}
                  </li>
                </Link>
              );
            })}
          </ul>

          {authToken === null && (
            <>
              <a href="/signin">
                <button className="border-2 w-full font-semibold px-4 py-4 text-white bg-black rounded mb-4">
                  Sign In
                </button>
              </a>

              <a href="/signup">
                <button className="border-2 w-full font-semibold px-4 py-4 text-black bg-white rounded">
                  Become a Franchise
                </button>
              </a>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
