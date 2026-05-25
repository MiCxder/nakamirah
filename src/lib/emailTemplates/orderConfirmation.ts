import { formatCurrency } from "@/lib/currency";

export function orderConfirmationEmail({
  customerName,
  items,
  total,
}: {
  customerName: string;
  items: {
    title: string;
    license: string;
    price: number;
  }[];
  total: number;
}) {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Thank you for your purchase, ${customerName}!</h2>

      <p>Your beats are ready for download.</p>

      <h3>Order Summary:</h3>

      <ul>
        ${items
          .map(
            (item) => `
          <li>
            ${item.title} (${item.license}) - ${formatCurrency(item.price)}
          </li>
        `
          )
          .join("")}
      </ul>

      <p><strong>Total: ${formatCurrency(total)}</strong></p>

      <a href="https://yourdomain.com/downloads">
        Download your beats
      </a>
    </div>
  `;
}
