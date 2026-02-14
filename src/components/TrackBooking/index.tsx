import { useState } from "react";
import { PiGpsFixFill } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { trackBookingsHandler } from "@/hooks/useTrackBookings";
import { motion } from "framer-motion";

const TrackBooking = () => {
  const schema = z.object({
    trackingNumber: z
      .string({ required_error: "trackingNumber is required" })
      .min(1, { message: "Please add a trackingNumber" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = (data: z.infer<typeof schema>) => {
    trackBookingsHandler(data?.trackingNumber, navigate, setLoading);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3 items-center py-3 px-4 border-b">
          <PiGpsFixFill className="text-green500 text-xl" />
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="trackingNumber"
              className="font-inter font-semibold"
            >
              Tracking Number
            </label>
            <input
              type="text"
              placeholder="What is your tracking number?"
              className="w-full outline-0"
              {...register("trackingNumber")}
            />
          </div>
        </div>
        {errors.trackingNumber && (
          <p className="error text-xs text-[#FF0000] pl-[45px] my-1">
            {errors.trackingNumber.message}
          </p>
        )}

        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          ><Button
          className="md:px-6 px-4 py-3 mt-4 rounded-full bg-green100 hover:bg-green800 text-white font-bold text-lg shadow-2xl transition-all duration-300 hover:-translate-y-1 "
          size={"large"}
          loading={loading}
        >
          Track Delivery
        </Button>
            
          </motion.div>
      </form>
    </div>
  );
};

export default TrackBooking;
