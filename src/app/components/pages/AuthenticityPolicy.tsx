import PolicyPage, { PolicyH2 } from '@/app/components/pages/PolicyPage';
import { Link } from 'react-router';

export default function AuthenticityPolicy() {
  return (
    <PolicyPage
      title="Authenticity policy — FITLOCKA"
      description="How FITLOCKA sources, evaluates, and stands behind retro jerseys and vintage sportswear."
      canonicalPath="/authenticity"
      heroEyebrow="Trust & curation"
      heroTitle="AUTHENTICITY"
      heroHighlight="YOU CAN WEAR"
    >
      <p>
        FITLOCKA specializes in vintage and retro sports apparel. We take authenticity seriously—collectors and fans rely on us to describe
        each piece accurately so you know what you are buying.
      </p>

      <PolicyH2>How we source</PolicyH2>
      <p>
        Inventory comes from trusted dealers, consignors, and markets we have built relationships with over time. We favor pieces with clear
        provenance, consistent construction, and labeling that matches the era and brand.
      </p>

      <PolicyH2>How we describe condition</PolicyH2>
      <p>
        Listings include details on fabric, tags, printing or stitching, and wear (if any). Vintage items may show gentle aging; we call out
        flaws such as stains, holes, or heavy fading so there are no surprises.
      </p>

      <PolicyH2>Replicas and customization</PolicyH2>
      <p>
        Unless clearly stated in the product description, pieces are sold as original manufacturer or period-appropriate vintage—not modern
        reissues, unless labeled as such. Customized jerseys (e.g. name/number changes) are described when known.
      </p>

      <PolicyH2>If something seems off</PolicyH2>
      <p>
        If you believe an item is materially misrepresented, contact us promptly with your order number and photos. We review each case
        individually and may offer return, exchange, or resolution consistent with our{' '}
        <Link to="/returns" className="text-[var(--accent)] underline">
          returns policy
        </Link>
        .
      </p>

      <PolicyH2>No guarantee of investment value</PolicyH2>
      <p>Pieces are sold for wear and enjoyment. Past or future resale value is not guaranteed.</p>
    </PolicyPage>
  );
}
