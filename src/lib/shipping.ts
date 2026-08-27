/** Shared shipping policy — single source of truth for the cart and checkout.
 *
 *  Design ref: canvas 1g / 1h. Both mockups show a $609 cart, i.e. the
 *  over-threshold state, which is why standard delivery reads FREE there.
 *
 *  NOTE: the standard rate *below* the threshold is not defined by the design,
 *  the shipping policy page, or the API, so the UI does not quote one — it
 *  shows "Calculated at checkout" and leaves the figure to the backend rather
 *  than inventing a fee. Replace this with the real rate once one exists.
 */
export const FREE_SHIPPING_THRESHOLD = 150;
export const EXPRESS_SHIPPING_FEE = 24;

export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}
