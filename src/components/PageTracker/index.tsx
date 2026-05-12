import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track, EVENT } from "@/lib/analytics";

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    track(EVENT.PAGE_VIEWED, {
      path: location.pathname,
      search: location.search || undefined,
      title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
};

export default PageTracker;
