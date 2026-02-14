import logo from "@/assets/images/gosendeet-black-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Direct", href: "/direct" },
      { label: "Compare", href: "/compare" },
      { label: "Tracking", href: "/tracking" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Become a Franchise", href: "/franchise" },
      { label: "Partners", href: "/partners" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Trust & Safety", href: "/safety" },
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
                    <a
                      href={link.href}
                      className="text-grey300 hover:text-blue100 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
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
                    <a
                      href={link.href}
                      className="text-grey300 hover:text-blue100 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
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
                    <a
                      href={link.href}
                      className="text-grey300 hover:text-blue100 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
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
                    <a
                      href={link.href}
                      className="text-grey300 hover:text-blue100 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
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
