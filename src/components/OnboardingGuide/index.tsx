import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Package, Search, Bell, User, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const STORAGE_KEY = "gosendeet_onboarding_v1";

export const hasSeenOnboarding = () =>
  localStorage.getItem(STORAGE_KEY) === "done";

export const markOnboardingSeen = () =>
  localStorage.setItem(STORAGE_KEY, "done");

const STEPS = [
  {
    icon: <Package className="w-10 h-10 text-white" />,
    bg: "bg-brand",
    title: "Welcome to Gosendeet! 🎉",
    description:
      "You're all set! This quick guide walks you through the key parts of your dashboard so you can start sending packages with confidence.",
  },
  {
    icon: <Search className="w-10 h-10 text-brand" />,
    bg: "bg-green-50",
    title: "Get a Quote & Book",
    description:
      "Use the booking form on the Overview tab to enter pickup and delivery details. Switch between GoSendeet Direct, Compare Quotes, or Track a package using the mode switcher at the top.",
  },
  {
    icon: <Package className="w-10 h-10 text-brand" />,
    bg: "bg-green-50",
    title: "My Bookings",
    description:
      'All your past and active orders appear under the "Bookings" tab. You can view delivery progress, tracking numbers, and full order details from there.',
  },
  {
    icon: <Bell className="w-10 h-10 text-brand" />,
    bg: "bg-green-50",
    title: "Notifications",
    description:
      'Stay updated on your deliveries. The "Notifications" tab keeps you informed on status changes, alerts, and platform updates as they happen.',
  },
  {
    icon: <User className="w-10 h-10 text-brand" />,
    bg: "bg-green-50",
    title: "Profile & Security",
    description:
      'Update your personal details anytime under "Settings", and manage your password or account preferences under "Security". Keep your account safe and up to date.',
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-white" />,
    bg: "bg-brand",
    title: "You're ready to go!",
    description:
      "That covers the essentials. If you ever need help, use the support panel on the Overview page. Happy sending!",
  },
];

interface OnboardingGuideProps {
  open: boolean;
  onClose: () => void;
}

export default function OnboardingGuide({ open, onClose }: OnboardingGuideProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const goNext = () => {
    if (isLast) {
      markOnboardingSeen();
      onClose();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSkip = () => {
    markOnboardingSeen();
    onClose();
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) handleSkip();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 border-0 shadow-2xl">
        {/* Header icon band */}
        <div className={`${current.bg} flex items-center justify-center py-10 relative`}>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            {current.icon}
          </div>
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close onboarding"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-4 min-h-[170px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-lg font-bold text-brand mb-2">{current.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }}
              className={`rounded-full transition-all duration-300 ${
                i === step ? "w-5 h-2 bg-brand" : "w-2 h-2 bg-gray-200"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          {step > 0 ? (
            <button
              onClick={goBack}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip
            </button>
          )}

          <button
            onClick={goNext}
            className="flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-700 transition-colors"
          >
            {isLast ? (
              <>
                <CheckCircle size={15} />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
