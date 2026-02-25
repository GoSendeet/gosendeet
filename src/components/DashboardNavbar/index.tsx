import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MENU } from "../../constants";
import logo from "@/assets/images/sendeet-black-logo.png";
import { HiBars3 } from "react-icons/hi2";
import { GoX } from "react-icons/go";
import { useGetUserDetails } from "@/queries/user/useGetUserDetails";
import { PiSignOutBold } from "react-icons/pi";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth";
import { toast } from "sonner";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleNavToggle = () => {
    setNavOpen(!navOpen);
  };

  const location = useLocation(); // Get current location

  const userId = sessionStorage.getItem("userId") || "";
  const { data: userData, refetchUserData } = useGetUserDetails(userId);

  const username = userData?.data?.username;
  const letter = username?.charAt(0).toUpperCase();

  useEffect(() => {
    if (userId) {
      refetchUserData();
    }
  }, [userId]);

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      sessionStorage.clear();
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error?.error);
    },
  });

  return (
    <nav className="w-full z-20">
      <div className="flex justify-between items-center lg:py-5 py-6 xl:px-30 md:px-20 px-6 bg-white border-b border-b-neutral300">
        {/* Logo or Brand Name */}
        <div>
          <Link to="/">
            <img src={logo} alt="logo" className="" />
          </Link>
        </div>

        {/* Hamburger Icon (mobile view) */}
        <div className="lg:hidden flex items-center gap-4">
          <div className="flex flex-row gap-4 items-center">
            <div className="w-[40px] h-[40px] flex justify-center items-center font-bold text-md rounded-full text-white bg-brand">
              {letter}
            </div>
          </div>
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
                  className={`block py-2 text-neutral600 hover:border-b-2 hover:border-darkGreen  ${
                    isActive ? "border-b-2 border-darkGreen" : ""
                  }`}
                >
                  {link.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:flex lg:flex-row items-center flex-col">
          <div className="w-[40px] h-[40px] flex justify-center items-center font-bold text-md rounded-full text-white bg-brand">
            {letter}
          </div>
          <Button
            variant={"ghost"}
            className="h-[40px]"
            loading={isPending}
            onClick={() => mutate()}
          >
            Log out <PiSignOutBold />{" "}
          </Button>
        </div>

        {/* Links (mobile view) */}
        <div
          className={`lg:hidden absolute top-0 left-0 w-full h-[70vh] z-20 bg-white py-6 md:px-20 px-10 transition-transform duration-300 ${
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
                    className={` w-full  hover:bg-white hover:text-green cursor-pointer ${
                      isActive ? " text-green " : ""
                    }`}
                  >
                    {link.title}
                  </li>
                </Link>
              );
            })}
          </ul>
          <Button
            className="border-2 w-full font-semibold px-4 py-4 bg-black text-white rounded"
            loading={isPending}
            onClick={() => mutate()}
          >
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
