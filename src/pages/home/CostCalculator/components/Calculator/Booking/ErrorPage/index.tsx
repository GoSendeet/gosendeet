import Layout from "@/layouts/HomePageLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

const CHECKOUT_BOOKING_STORAGE_KEY = "checkoutBookingData";

const ErrorPage = () => {
  const userId = sessionStorage.getItem("userId") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      toast.error("Please sign in to continue");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    }
  }, [navigate, userId]);

  const retryOrder = () => {
    const savedBookingData = sessionStorage.getItem(CHECKOUT_BOOKING_STORAGE_KEY);

    if (!savedBookingData) {
      toast.error("Booking details are missing. Please start again.");
      navigate("/");
      return;
    }

    try {
      navigate("/checkout", {
        state: { bookingData: JSON.parse(savedBookingData) },
      });
    } catch {
      toast.error("Booking details are unavailable. Please start again.");
      navigate("/");
    }
  };

  return (
    <Layout>
      <div className="py-10 xl:w-[70%] md:w-[80%] w-full mx-auto px-6 ">
        <div className="flex lg:flex-row flex-col gap-6 justify-center">
          <div className="lg:w-[65%] flex flex-col gap-6">
            <div className="px-4 py-20 bg-purple300 rounded-xl">
              <div className="flex flex-col gap-2 justify-center items-center text-center">
                <div className="bg-red-100 rounded-full p-4 mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="font-clash font-semibold text-2xl mt-1">
                  Something Went Wrong
                </h2>

                <div className="text-neutral600 md:w-[90%] mb-6">
                  <p>We couldn’t process your order at the moment.</p>
                  <p>
                    Please try again or contact our support team for assistance.
                  </p>
                </div>
                <Button onClick={retryOrder}>Retry Order</Button>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center justify-center mt-20">
                <p className="font-medium">Need help with delivery</p>
                <Button variant="secondary">Contact Support</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
