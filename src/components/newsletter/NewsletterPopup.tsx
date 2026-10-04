import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import NewsletterSignup from './NewsletterSignup';
import { hasSeenPopup, isSubscribed, rememberPopupShown } from './preferences';
import { useNewsletterSubscription } from './useNewsletterSubscription';

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(() => !isSubscribed() && !hasSeenPopup());
  const subscribed = useNewsletterSubscription();
  const open = visible && !subscribed;
  useEffect(() => {
    if (open) rememberPopupShown();
  }, [open]);
  return <Dialog open={open} onOpenChange={setVisible}>
    <DialogContent className="newsletter-popup" onOpenAutoFocus={undefined}>
      <DialogTitle className="sr-only">Delivery tips newsletter</DialogTitle>
      <DialogDescription className="sr-only">Subscribe for packing advice, delivery updates and occasional offers.</DialogDescription>
      <NewsletterSignup variant="modal" />
    </DialogContent>
  </Dialog>;
}
