import logo from "@/assets/images/sendeet-black-logo.png";
import { Link } from "react-router-dom";

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-purple300 xl:px-30 md:px-20 px-6 py-6 flex lg:flex-row lg:justify-between flex-col gap-8 items-center">
      <img src={logo} alt="logo" className="h-[36px]" />

      <p className="font-medium text-center text-neutral600">
        © {currentYear} GoSendeet. All rights reserved
      </p>

      <div className="flex gap-4 font-medium text-purple500">
        <Link to="/terms">Terms of Use</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </div>
    </div>
  );
};

export default DashboardFooter;
