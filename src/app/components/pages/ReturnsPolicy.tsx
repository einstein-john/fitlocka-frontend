import PolicyPage, { PolicyH2 } from '@/app/components/pages/PolicyPage';
import { Link } from 'react-router';

export default function ReturnsPolicy() {
  return (
    <PolicyPage
      title="Returns policy — FITLOCKA"
      description="Returns, exchanges, and refunds for FITLOCKA orders: eligibility, time windows, and how to start a return."
      canonicalPath="/returns"
      heroEyebrow="Peace of mind"
      heroTitle="RETURNS"
      heroHighlight="& REFUNDS"
    >
      <p>
        We want you to love your jersey. If something is not right, read below for how returns work. Specific rules may also appear on your
        order confirmation or product page for limited releases or final-sale items.
      </p>

      <PolicyH2>Eligibility</PolicyH2>
      <p>
        Most unused items in original condition—with tags attached where applicable and included packaging—may be returned within{' '}
        <strong>30 days of delivery</strong> unless marked final sale at checkout or in the listing. Items that show wear, wash, or alteration
        after delivery may not qualify unless defective.
      </p>

      <PolicyH2>How to start a return</PolicyH2>
      <p>
        Contact us with your order number and the reason for the return. We will confirm whether the item is eligible and provide return
        instructions, including the address to ship to. Do not return items without approval, as they may not be linked to your order.
      </p>

      <PolicyH2>Refunds</PolicyH2>
      <p>
        After we receive and inspect the return, approved refunds are issued to the original payment method. Processing by banks or card
        networks can take additional business days. Original outbound shipping is generally non-refundable unless we shipped the wrong item or
        the product was defective or misdescribed.
      </p>

      <PolicyH2>Exchanges</PolicyH2>
      <p>
        If you need a different size or product, we may offer an exchange when stock allows. Otherwise, we may process a return and invite you
        to place a new order for the correct item.
      </p>

      <PolicyH2>Return shipping</PolicyH2>
      <p>
        Unless the error was ours (wrong item, major defect, or material description mismatch), return shipping costs are usually paid by the
        customer unless a prepaid label is provided in your return authorization.
      </p>

      <PolicyH2>Damaged or incorrect items</PolicyH2>
      <p>
        If your package arrives damaged or the item is not what you ordered, photograph the packaging and product and contact us within{' '}
        <strong>48 hours of delivery</strong> so we can prioritize a replacement or refund. See also our{' '}
        <Link to="/authenticity" className="text-[var(--accent)] underline">
          authenticity policy
        </Link>
        .
      </p>

      <PolicyH2>Non-returnable</PolicyH2>
      <p>
        Final sale, personalized or customized pieces, and certain collectibles may be excluded from returns. Those exceptions will be clearly
        noted before purchase.
      </p>
    </PolicyPage>
  );
}
