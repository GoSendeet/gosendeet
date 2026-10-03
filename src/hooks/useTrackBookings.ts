import { trackBookings } from "@/services/bookings";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";

/**
 * Reusable booking tracker
 */
export async function trackBookingsHandler(
  trackingNumber: string,
  navigate: NavigateFunction,
  setLoading: (loading: boolean) => void
) {
  try {
    setLoading(true);

    const reference = trackingNumber.trim();
    const res = await trackBookings(reference);

    toast.success("Booking found");

    navigate(`/track-booking?trackingNumber=${encodeURIComponent(reference)}`, {
      state: {
        result: res,
      },
    });
  } catch (error: any) {
    toast.error(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}
