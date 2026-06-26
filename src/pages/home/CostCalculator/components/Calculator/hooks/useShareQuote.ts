import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { shareQuotes } from "@/services/user";
import { APP_BASE_URL, buildQuotePayload } from "../quoteUtils";

export const useShareQuote = (bookingRequest: any) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const { mutate: share, isPending: shareLoading } = useMutation({
    mutationFn: shareQuotes,
    onSuccess: (data: any) => {
      const shareId = data?.data?.shareId;
      setShareUrl(`${APP_BASE_URL}/cost-calculator?shareId=${shareId}`);
      toast.success("Share link created");
    },
    onError: (error: any) => {
      toast.error(error?.error);
    },
  });

  const copyUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    if (!shareUrl) return;

    const timer = setTimeout(() => {
      setShareUrl(null);
    }, 10000);

    return () => clearTimeout(timer);
  }, [shareUrl]);

  const handleShare = () => {
    share(buildQuotePayload(bookingRequest));
  };

  return {
    copyUrl,
    handleShare,
    shareLoading,
    shareUrl,
  };
};
