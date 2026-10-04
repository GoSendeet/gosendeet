import { useId, useState, type FormEvent } from 'react';
import { rememberSubscription } from './preferences';
import { useNewsletterSubscription } from './useNewsletterSubscription';
import './newsletter.css';
import { toast } from 'sonner';

type NewsletterVariant = 'inline' | 'embedded' | 'modal';

export default function NewsletterSignup({ variant = 'inline' }: { variant?: NewsletterVariant }) {
  const embedded = variant === 'embedded';
  const inModal = variant === 'modal';
  const id = useId();
  const Heading = embedded ? 'h3' : 'h2';
  const subscribed = useNewsletterSubscription();
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website: data.get('website') }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        setError(typeof result?.error === 'string' ? result.error : 'We couldn’t subscribe you right now. Please try again.');
        return;
      }
      rememberSubscription();
      if (inModal) toast.success('You’re subscribed. Thanks for joining us!');
      setEmail('');
    } catch {
      setError('We couldn’t connect. Please try again.');
    } finally { setPending(false); }
  }
  return <section className={`newsletter-signup${embedded ? ' newsletter-signup-embedded' : ''}`} aria-labelledby={`${id}-heading`}>
    <div className="newsletter-copy">
      <Heading id={`${id}-heading`}>{inModal ? 'Make your next delivery easier' : 'Get useful delivery tips'}</Heading>
      <p>Packing advice, delivery updates and occasional offers in your inbox.</p>
    </div>
    {subscribed ? <p className="newsletter-success" role="status">You’re subscribed. Thanks for joining us!</p> : <form onSubmit={submit} className="newsletter-form" aria-label="Email subscription">
      <label className="newsletter-email-label" htmlFor={`${id}-email`}>Email address</label>
      <div className="newsletter-fields">
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="Your email address" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} disabled={pending} aria-describedby={`${id}-note${error ? ` ${id}-error` : ''}`} aria-invalid={error ? true : undefined} />
        <button type="submit" disabled={pending}>{pending ? 'Subscribing…' : 'Subscribe'}</button>
      </div>
      <div className="newsletter-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Leave this empty</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
      <p id={`${id}-note`} className="newsletter-note">Unsubscribe anytime. <a href="/privacy">Privacy policy</a></p>
      {error && <p id={`${id}-error`} className="newsletter-error" role="alert">{error}</p>}
    </form>}
  </section>;
}
