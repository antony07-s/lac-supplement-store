import StaticPageLayout from '../components/layout/StaticPageLayout.jsx'

function ShippingPolicy() {
  return <StaticPageLayout title="Delivery & Shipping Policy">
    <p className="text-sm text-stone-500">Effective date: September 22, 2026</p>
    <p>This Delivery and Shipping Policy applies to purchases made through https://ayusydah.com/.</p>
    <p>The website is operated by: <strong>Sapphire Agro Foods</strong><br />GST Registration No.: 03DKUPS1343R1ZC<br />Business Address: VPO Manakdheri, District Hoshiarpur, Punjab – 144203, India.</p>

    {/* // TODO: Needs India-specific delivery zones and courier list — pending client input, do not remove Malaysia content until replacement text is confirmed. */}
    <h3 className="font-semibold text-gray-800 pt-2">1. Delivery Coverage</h3>
    <p>We currently deliver to addresses within Malaysia, including Peninsular Malaysia, Sabah, Sarawak, and the Federal Territory of Labuan. Delivery to certain islands, remote locations, restricted areas or P.O. Box addresses may not be available or may require additional charges. International shipping is available only when specifically confirmed by us before payment.</p>

    <h3 className="font-semibold text-gray-800 pt-2">2. Shipping Charges</h3>
    <p>Shipping charges are calculated according to delivery destination, parcel weight and dimensions, number and type of products, courier service selected, remote-area or special-handling charges, and any applicable shipping promotion. The applicable shipping charge will be displayed during checkout or communicated to the customer before payment.</p>
    <ul className="list-disc space-y-1 pl-5">
      <li>Peninsular Malaysia: Calculated and displayed at checkout</li>
      <li>Sabah, Sarawak and Labuan: Calculated and displayed at checkout</li>
      <li>Remote or special-delivery areas: Additional charges may apply</li>
      <li>International destinations: Quotation required before payment</li>
    </ul>
    <p>Shipping charges for East Malaysia are normally higher than for Peninsular Malaysia because of air-freight and courier costs. Free-shipping promotions, when available, will be subject to the stated minimum purchase, delivery area, weight limit and promotional conditions.</p>

    <h3 className="font-semibold text-gray-800 pt-2">3. Order-Processing Time</h3>
    <p>Orders are normally prepared within 1–3 business days after payment has been successfully confirmed. Orders placed on weekends, Malaysian public holidays or after the daily processing cut-off time will be processed on the next business day.</p>
    <p>Processing may take longer when a product is temporarily unavailable, the order contains pre-order items, additional payment verification is required, the delivery address is incomplete, the order is unusually large or heavy, or circumstances beyond our reasonable control affect operations. Processing time is separate from courier delivery time.</p>

    <h3 className="font-semibold text-gray-800 pt-2">4. Estimated Delivery Time</h3>
    <ul className="list-disc space-y-1 pl-5">
      <li>Peninsular Malaysia: 2–5 business days</li>
      <li>Sabah, Sarawak and Labuan: 5–10 business days</li>
      <li>Remote locations: May require additional time</li>
      <li>International destinations: Based on destination and courier quotation</li>
    </ul>
    <p>These periods are estimates only and are not guaranteed delivery dates. Delivery may take longer during sales campaigns, festive seasons, public holidays, severe weather, courier disruptions, customs inspections or other circumstances outside our reasonable control.</p>

    <h3 className="font-semibold text-gray-800 pt-2">5. Courier Selection</h3>
    <p>Orders may be shipped through an appropriate courier or logistics provider selected according to the destination, parcel size, service availability and delivery requirements. We may use providers such as LEX, J&amp;T Express, Pos Laju, Ninja Van, DHL eCommerce, or another authorised delivery provider. A customer's preferred courier may be considered but cannot always be guaranteed.</p>

    <h3 className="font-semibold text-gray-800 pt-2">6. Tracking Information</h3>
    <p>When tracking is available, the tracking number will be sent through email, WhatsApp, SMS or the customer's order page after dispatch. Tracking information may require up to 24 hours to become active after the parcel is handed to the courier. Customers are responsible for monitoring the tracking status and responding promptly to calls or messages from the courier.</p>

    <h3 className="font-semibold text-gray-800 pt-2">7. Customer's Delivery Responsibilities</h3>
    <p>Customers must provide the recipient's correct full name, a complete delivery address, the correct postcode, city and state, a valid telephone number, and any necessary building, unit, floor or access information. We are not responsible for delay, non-delivery or additional expenses caused by incorrect, incomplete or outdated information provided by the customer. Customers should check all delivery information carefully before confirming an order.</p>

    <h3 className="font-semibold text-gray-800 pt-2">8. Address Changes</h3>
    <p>Address changes must be requested before the order is packed or dispatched. Once a parcel has been handed to the courier, we cannot guarantee that the delivery address can be changed. Any courier charge arising from an approved address correction, parcel redirection or redelivery may be payable by the customer.</p>

    <h3 className="font-semibold text-gray-800 pt-2">9. Delivery Attempts</h3>
    <p>The courier may contact the recipient or attempt delivery according to its operating procedures. If delivery is unsuccessful because no one is available to receive the parcel, the recipient cannot be contacted, access to the premises is restricted, the address is incorrect or incomplete, or the recipient refuses delivery without a valid reason, the courier may attempt redelivery, hold the parcel for collection or return it to us. Additional courier or redelivery charges may be charged to the customer.</p>

    <h3 className="font-semibold text-gray-800 pt-2">10. Returned-to-Sender Parcels</h3>
    <p>If a parcel is returned to us because of an incorrect address, unsuccessful delivery attempts, failure to collect or unjustified refusal, the customer may request redelivery after paying the applicable delivery charge; or, if a refund is approved, the original delivery charge, return-delivery charge and other reasonable costs may be deducted to the extent permitted by law. Products that are perishable, temperature-sensitive, opened, damaged or unsuitable for resale after being returned may not qualify for a refund, except where required by law.</p>

    <h3 className="font-semibold text-gray-800 pt-2">11. Receiving and Inspecting the Parcel</h3>
    <p>Customers should inspect the parcel immediately after delivery. If the parcel appears damaged, crushed, opened or resealed, take clear photographs before opening it, record an unedited unboxing video where possible, keep the courier packaging and delivery label, and contact us within 48 hours after delivery. Claims involving damaged, missing, incorrect or defective products will be handled according to our Refund, Return and Cancellation Policy.</p>

    <h3 className="font-semibold text-gray-800 pt-2">12. Delivered Status but Parcel Not Received</h3>
    <p>If tracking shows that the parcel has been delivered but you have not received it: check with household members, reception, security personnel and neighbours; check whether the courier left the parcel in a designated safe location; contact the courier using the tracking number; and inform us promptly if the parcel still cannot be found. We will assist with the courier investigation. A replacement or refund will be considered after the investigation confirms that the parcel was lost or incorrectly delivered.</p>

    <h3 className="font-semibold text-gray-800 pt-2">13. Delayed or Missing Parcels</h3>
    <p>A parcel is not automatically considered lost merely because it arrives later than the estimated delivery period. If there has been no tracking update for an unreasonable period, contact us so that we can request an investigation from the courier. Any replacement or refund for a missing parcel will be considered after the courier completes its investigation and confirms the parcel's status.</p>

    <h3 className="font-semibold text-gray-800 pt-2">14. Risk of Damage or Loss</h3>
    <p>We remain responsible for preparing and packing products with reasonable care. Risk generally passes to the customer when the order is successfully delivered to the address provided, subject to any rights or remedies that cannot be excluded under Malaysian law. We are not responsible for loss occurring after confirmed delivery because of theft, exposure to weather, unattended premises or incorrect delivery instructions provided by the customer.</p>

    <h3 className="font-semibold text-gray-800 pt-2">15. Split Shipments</h3>
    <p>An order may be divided into multiple parcels when products are stored at different locations, certain products become available earlier, a parcel exceeds the courier's weight or size limit, or separate packaging is required for safety. Where we decide to split an order after payment, the customer will not normally be charged an additional shipping fee unless this is agreed in advance.</p>

    <h3 className="font-semibold text-gray-800 pt-2">16. Pre-Orders and Out-of-Stock Products</h3>
    <p>Pre-order products will be dispatched according to the estimated availability date shown on the product page or communicated during purchase. If an order includes both available and pre-order products, the order may be held until all products are ready unless split delivery is arranged. If a product becomes unavailable after payment, we will offer an alternative product, store credit or a refund for the unavailable item.</p>

    <h3 className="font-semibold text-gray-800 pt-2">17. International Delivery</h3>
    <p>International orders require prior confirmation. Customers are responsible for import permits, customs duties, taxes, regulatory requirements, customs-clearance charges, and ensuring that the products may legally be imported into the destination country. We are not responsible for products detained, rejected, confiscated or destroyed by foreign customs or regulatory authorities because the customer failed to meet the destination country's requirements.</p>

    <h3 className="font-semibold text-gray-800 pt-2">18. Force Majeure and Delivery Disruptions</h3>
    <p>We are not responsible for delays caused by circumstances beyond our reasonable control, including floods or severe weather, natural disasters, epidemics or public-health restrictions, strikes, road closures, courier-system failures, customs inspections, government restrictions, or disruption to transportation or communication services. We will take reasonable steps to assist affected customers and provide available delivery updates.</p>

    <h3 className="font-semibold text-gray-800 pt-2">19. Contact Us</h3>
    <p>For shipping enquiries, tracking assistance or delivery problems, contact:<br />AYUSYDAH Customer Service, operated by Sapphire Agro Foods<br />GST Registration No.: 03DKUPS1343R1ZC<br />Email: lsmu@hotmail.com<br />WhatsApp/Telephone: +91 7626 863977<br />Customer-service hours: 9am to 5pm</p>
    <p>Please provide your name, order number and tracking number when contacting us.</p>
  </StaticPageLayout>
}

export default ShippingPolicy