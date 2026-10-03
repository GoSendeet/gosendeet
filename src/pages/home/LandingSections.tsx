import { Link } from "react-router-dom";
import { Headphones, UserRound } from "lucide-react";
import dhl from "@/assets/images/dhl.png";
import fedex from "@/assets/images/fedex.png";
import gig from "@/assets/images/gig.png";
import ups from "@/assets/images/ups.png";
import posts from "virtual:blog-posts";

const carriers = [{ src: dhl, name: "DHL" }, { src: fedex, name: "FedEx" }, { src: gig, name: "GIG Logistics" }, { src: "/images/landing/fez.svg", name: "FEZ Delivery" }, { src: ups, name: "UPS" }];
const routes = [
  { label: "Ikeja to Lekki", pickup: "Ikeja", destination: "Lekki" },
  { label: "Yaba to Victoria Island", pickup: "Yaba", destination: "Victoria Island" },
  { label: "Lagos to Ibadan", pickup: "Lagos", destination: "Ibadan" },
];
const steps = [
  { title: "Compare prices", text: "Enter your route and parcel details." },
  { title: "Book your delivery", text: "Choose a courier and confirm your booking." },
  { title: "Follow its progress", text: "Track your parcel along the way." },
];
const faqs = [
  { question: "How do I compare delivery prices?", answer: "Enter your full pickup and destination addresses, then choose your package type and weight. Select Compare prices to see the available delivery options." },
  { question: "Can I track my delivery?", answer: "Yes. Select Track a delivery above and enter your tracking number to follow your parcel’s progress." },
  { question: "What can I send?", answer: "Choose the package type that matches your parcel. Availability depends on its weight, size, contents and the courier. Contact support if you are unsure whether your item can be sent." },
  { question: "How do I contact support?", answer: "Email support@gosendeet.com with your question and, if you have one, your booking or tracking number." },
];
const guideSlugs = ["delivery-cost-nigeria", "delivery-for-instagram-whatsapp-sellers", "lagos-to-ibadan-delivery"];
const guides = guideSlugs.map(slug => posts.find(post => post.slug === slug && post.status === "published")).filter(post => post !== undefined);

const stories = [
  { name: "Toheeb", quote: "I used to struggle to find a courier that covered my route and work out where to drop off my package. With GoSendeet, it’s easier." },
  { name: "Chioma", quote: "I was able to manage over 30 orders with GoSendeet without using a spreadsheet." },
];

function QuoteCallToAction({ heading, description, label, onStartQuote, final = false }: {
  heading: string;
  description: string;
  label: string;
  onStartQuote: () => void;
  final?: boolean;
}) {
  return <section className={`landing-shell landing-cta${final ? " landing-final-cta" : ""}`} aria-label={heading}>
    <div><h2>{heading}</h2><p>{description}</p></div>
    <button type="button" className="landing-primary" onClick={onStartQuote}>{label}</button>
  </section>;
}

export default function LandingSections({ onStartQuote }: { onStartQuote: () => void }) {
  return <>
    <section className="landing-shell landing-trust" aria-label="Courier options and support">
      <p>Compare courier options</p>
      <div className="landing-carriers">{carriers.map(carrier => <img key={carrier.name} src={carrier.src} alt={carrier.name} loading="lazy" />)}</div>
      <a href="mailto:support@gosendeet.com" className="landing-support"><Headphones aria-hidden="true" /><span>Need help?<strong>support@gosendeet.com</strong></span></a>
    </section>

    <section className="landing-shell landing-routes" aria-labelledby="routes-heading">
      <h2 id="routes-heading">Where are you sending today?</h2>
      <div className="landing-card-row">{routes.map((route, index) => <Link key={route.label} to="/cost-calculator" state={{ mode: "compare", routePreset: { pickup: route.pickup, destination: route.destination } }} className="landing-route-card">
        <div className={`landing-card-photo landing-route-photo landing-photo-${index}`} aria-hidden="true" />
        <div className="landing-route-content"><div><h3>{route.label}</h3><p>{index === 0 ? <>From <strong>₦2,000</strong></> : "Compare prices"}</p></div></div>
      </Link>)}</div>
    </section>

    <section className="landing-steps" aria-labelledby="steps-heading">
      <div className="landing-shell landing-steps-layout">
        <div><h2 id="steps-heading">Ship in 3 Simple Steps</h2><p className="landing-intro">From quote to delivery, the whole process takes just minutes.</p>
          <ol>{steps.map((step, index) => <li key={step.title}><span className="landing-step-number">{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
          <button type="button" className="landing-primary" onClick={onStartQuote}>Get a quote</button>
        </div>
        <img src="/images/landing/handoff.webp" alt="A courier handing a parcel to its recipient" width="720" height="480" loading="lazy" />
      </div>
    </section>

    <section className="landing-stories" aria-labelledby="stories-heading">
      <div className="landing-shell"><h2 id="stories-heading">Stories from our senders</h2>
        <div className="landing-stories-row">
          {stories.map(story => <article key={story.name} className="landing-story"><UserRound aria-hidden="true" /><div><blockquote>“{story.quote}”</blockquote><h3>{story.name}</h3></div></article>)}
          <a className="landing-primary" href="mailto:support@gosendeet.com?subject=My%20GoSendeet%20delivery%20story">Share your story</a>
        </div>
      </div>
    </section>

    <section className="landing-shell landing-faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently asked questions</h2>
      <div>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div>
      <a className="landing-primary" href="mailto:support@gosendeet.com">Contact support</a>
    </section>

    <QuoteCallToAction heading="Ready to send?" description="Find a courier for your next delivery." label="Compare prices" onStartQuote={onStartQuote} />

    <section className="landing-guides" aria-labelledby="guides-heading">
      <div className="landing-shell"><div className="landing-section-heading"><h2 id="guides-heading">Useful guides before you send</h2><Link className="landing-primary" to="/blog">View all guides</Link></div>
        <div className="landing-card-row">{guides.map((guide, index) => <Link key={guide.slug} to={`/blog/${guide.slug}`} className="landing-guide-card">
          <div className={`landing-card-photo landing-guide-photo landing-photo-${index}`} aria-hidden="true" /><div><h3>{guide.title}</h3><span className="landing-primary landing-guide-cta">Read guide</span></div>
        </Link>)}</div>
      </div>
    </section>

    <QuoteCallToAction heading="Your next delivery starts here." description="Compare prices, choose a courier and book in one place." label="Get a quote" onStartQuote={onStartQuote} final />
  </>;
}
