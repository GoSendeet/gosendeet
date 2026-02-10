import {
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <div className="bg-white md:px-20 px-6 md:py-20 py-10">
        <div className="max-w-5xl mx-auto btn-gradient rounded-[32px] md:px-16 px-8 md:py-16 py-12 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <h2 className="font-extrabold text-white tracking-tight lg:text-5xl md:text-4xl text-3xl">
              Ready to move it?
            </h2>
            <p className="text-green-100 text-base max-w-2xl">
              Join thousands of businesses and individuals who have switched to
              the most trusted network in Nigeria.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Button className="bg-white text-black md:w-fit w-full font-bold">
                Get Started Now
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                className="text-white hover:text-white font-bold bg-transparent hover:bg-transparent md:w-fit w-full"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CTA