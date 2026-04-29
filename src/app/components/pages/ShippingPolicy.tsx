import PolicyPage, { PolicyH2 } from '@/app/components/pages/PolicyPage';
import { Link } from 'react-router';

export default function ShippingPolicy() {
  return (
    <PolicyPage
      title="Shipping policy — FITLOCKA"
      description="Shipping regions, processing times, carriers, and delivery expectations for FITLOCKA orders."
      canonicalPath="/shipping"
      heroEyebrow="Delivery"
      heroTitle="SHIPPING"
      heroHighlight="& HANDLING"
    >
      <p>We pack every order with care so your jersey arrives ready to wear or display. Timelines below are typical; busy seasons may add a day or two.</p>

      <PolicyH2>Processing</PolicyH2>
      <p>
        Orders are usually processed within 1–3 business days (Monday–Friday, excluding holidays). You will receive a confirmation email when
        the order ships. Pre-orders or made-to-order items ship on the timeline stated in the listing.
      </p>

      <PolicyH2>Carriers</PolicyH2>
      <p>
        We ship via major carriers (e.g. postal service or courier depending on destination). The carrier and service level are selected for
        reliability; exact provider may vary by country.
      </p>

      <PolicyH2>Domestic shipping</PolicyH2>
      <p>
        Standard delivery typically takes a few business days after dispatch. Expedited options may be available at checkout when offered;
        estimated delivery dates are shown before you pay.
      </p>

      <PolicyH2>International shipping</PolicyH2>
      <p>
        International orders may be subject to customs duties, taxes, or import fees assessed by your country. Those charges are the buyer&apos;s
        responsibility and are not included in our product or shipping prices unless explicitly stated.
      </p>

      <PolicyH2>Address accuracy</PolicyH2>
      <p>
        Please double-check your shipping address at checkout. We are not responsible for delays or loss due to incorrect or incomplete
        addresses supplied by the customer.
      </p>

      <PolicyH2>Delays &amp; loss</PolicyH2>
      <p>
        Weather, customs, and carrier disruptions can delay packages. If tracking shows no movement for an unusually long time, contact us
        with your order number and we will help trace it. For packages marked delivered that you did not receive, check with the carrier and
        neighbors first; we will assist where we can.
      </p>

      <PolicyH2>Questions</PolicyH2>
      <p>
        For shipping issues related to an order placed on this site, use the contact options provided with your order confirmation or see{' '}
        <Link to="/returns" className="text-[var(--accent)] underline">
          returns
        </Link>{' '}
        for other post-purchase topics.
      </p>
    </PolicyPage>
  );
}
