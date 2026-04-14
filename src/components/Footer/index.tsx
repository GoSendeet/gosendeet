import logo from "@/assets/images/gosendeet-black-logo.png";
import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import ContactSalesDialog from "@/components/ContactSalesDialog";
import { openChatwootWidget } from "@/lib/chatwoot";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleHelpCenterClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const opened = openChatwootWidget();
    if (!opened) {
      toast.info("Support chat is still loading. Please try again in a moment.");
    }
  };

  const footerLinks = {
    platform: [
      { label: "Direct", href: "/cost-calculator" },
      { label: "Compare", href: "/cost-calculator", mode:"compare" },
      { label: "Tracking", href: "/track" },
    ],
    company: [
      { label: "About", href: "/about" },
      // { label: "Careers", href: "/careers" },
      { label: "Become a Franchise", href: "/signup?type=franchise" },
      { label: "Partners", href: "/signup?type=franchise" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Trust & Safety", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="xl:px-30 md:px-20 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-12 mb-12">
            {/* Logo and Tagline */}
            <div className="lg:col-span-2 md:col-span-3">
              <img src={logo} alt="GoSendeet Logo" className="mb-4 h-[36px]" />
              <p className="text-grey300 text-sm leading-relaxed max-w-xs">
                Redefining logistics in Africa through technology, trust, and
                verified partnerships.
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="font-bold text-blue100 mb-4 text-base">
                Platform
              </h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      state={link.mode ? { mode: link.mode } : {}}
                      className="text-grey300 hover:text-blue100 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-bold text-blue100 mb-4 text-base">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-grey300 hover:text-blue100 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-blue100 mb-4 text-base">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    {link.label === "Help Center" ? (
                      <button
                        type="button"
                        onClick={handleHelpCenterClick}
                        className="text-grey300 hover:text-blue100 transition-colors text-sm bg-transparent border-0 p-0 cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : link.label === "Contact" ? (
                      <ContactSalesDialog
                        triggerLabel="Contact"
                        triggerClassName="text-grey300 hover:text-blue100 transition-colors text-sm"
                      />
                    ) : (
                      <a
                        href={link.href}
                        className="text-grey300 hover:text-blue100 transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-bold text-blue100 mb-4 text-base">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-grey300 hover:text-blue100 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-grey300 text-sm">
              © {currentYear} Gosendeet Logistics
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
