import { motion } from "framer-motion";
import { useState } from "react";
import FormHorizontalBar from "./components/FormHorizontalBar";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import { FiBox, FiPackage } from "react-icons/fi";
import { SiFedex, SiDhl, SiUps } from "react-icons/si";

const HeroOptionC = () => {
  const [formMode, setFormMode] = useState<FormMode>("compare");

  const trustSignals = [
    { icon: "✓", text: "Best Pricing", color: "from-emerald-400 to-emerald-500", clickable: false },
    { icon: "✓", text: "Predictable Pickup", color: "from-blue-400 to-blue-500", clickable: false },
    { icon: "✓", text: "Real-Time Notifications", color: "from-amber-400 to-amber-500", clickable: false },
    { icon: "✓", text: "Verified Partners", color: "from-purple-400 to-purple-500", clickable: false },
  ];

  // Logo array for carousel
  const partnerLogos = [
    { name: "FedEx", icon: SiFedex },
    { name: "FEZ" },
    { name: "DHL", icon: SiDhl },
    { name: "UPS", icon: SiUps },
    { name: "GIG" },
  ];

  // Floating icon configurations for cleaner rendering
  const floatingIcons = [
    { Icon: FiBox, position: "top-20 left-10 md:left-20", color: "text-amber-400/30", size: "w-16 h-16 md:w-20 md:h-20", duration: 4, delay: 0, yOffset: -20, rotation: 5 },
    { Icon: FiPackage, position: "top-32 right-10 md:right-24", color: "text-orange-400/25", size: "w-12 h-12 md:w-16 md:h-16", duration: 3.5, delay: 0.5, yOffset: -15, rotation: -5 },
    { Icon: FiBox, position: "top-60 left-16 md:left-32", color: "text-yellow-400/20", size: "w-10 h-10 md:w-12 md:h-12", duration: 3, delay: 1, yOffset: -10, rotation: 3 },
  ];

  return (
    <div className="v3-hero min-h-[90vh] flex flex-col justify-between md:px-20 px-6 pt-6 md:pt-10 lg:pt-12 pb-8 md:pb-10 lg:pb-12 relative overflow-hidden">
      {/* Floating Package Icons Container - Matches content area for correct positioning */}
      <div className="absolute inset-0 max-w-7xl mx-auto w-full pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.position} ${item.color}`}
            animate={{
              y: [0, item.yOffset, 0],
              rotate: [0, item.rotation, 0]
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay
            }}
          >
            <item.Icon className={item.size} />
          </motion.div>
        ))}
      </div>

      {/* Headline Section - Center Aligned */}
      <motion.div
        className="text-center relative z-10 max-w-7xl mx-auto w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="font-clash font-bold mb-4">
          <span className="block text-[#f59e0b] xl:text-[56px] lg:text-[44px] text-[32px] xl:leading-[95%] leading-[100%]">
            Every delivery is a promise.
          </span>
          <span className="block text-[#6b7280] xl:text-[28px] lg:text-[24px] text-[20px] xl:leading-[95%] leading-[100%]">
            We help you keep it.
          </span>
        </h1>

        <p className="text-[#1a1a1a] xl:text-lg lg:text-base text-sm leading-relaxed max-w-4xl mx-auto mb-6 md:mb-0">
          Ship easily from your doorstep with <span className="text-[#f59e0b]">GoSendeet</span>, or <span className="text-[#f59e0b]"> compare rates </span> from multiple carriers — <span className="text-[#f59e0b]"> all in one place. </span>
        </p>
      </motion.div>

      {/* Form Section - Centered in available space */}
      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full relative z-10 md:mt-6 lg:-mt-16">

        {/* Mode Tabs - Combined Card Above Form */}
        <motion.div
          className="max-w-6xl mx-auto relative z-10 mb-[-40px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-center">
            <ModeSwitcher mode={formMode} onModeChange={setFormMode} variant="pill" animate />
          </div>
        </motion.div>

        {/* Horizontal Form Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <FormHorizontalBar variant="minimal" activeMode={formMode} />
        </motion.div>

        {/* Combined Trust Bar - All trust signals + key stats in one row */}
        <motion.div
          className="hidden md:flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {trustSignals.map((signal, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-xl bg-gradient-to-br ${signal.color} flex items-center justify-center shadow-md`}>
                <span className="text-white font-bold text-xs">{signal.icon}</span>
              </div>
              <span className="text-[#1f2937] font-medium text-sm whitespace-nowrap">
                {signal.text}
              </span>
              {index < trustSignals.length - 1 && (
                <span className="hidden md:inline text-gray-300 text-2xl mx-2">•</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Logo Carousel - Enhanced with Animations */}
      <motion.div
        className="v3-carousel-container overflow-hidden w-full max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="v3-carousel-track flex gap-12 items-center relative z-10">
          {partnerLogos.concat(partnerLogos).map((partner, index) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={index}
                className="v3-logo-item group flex items-center justify-center h-[40px] md:h-[48px] min-w-[120px] text-gray-700 transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                {Icon ? (
                  <Icon className="w-20 h-8 md:h-10 group-hover:text-amber-600 transition-colors duration-300" />
                ) : (
                  <span className="text-base md:text-lg font-semibold uppercase tracking-wider group-hover:text-amber-600 transition-colors duration-300">
                    {partner.name}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default HeroOptionC;
