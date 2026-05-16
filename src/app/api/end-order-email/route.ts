import { Resend } from "resend";
import { orderConfirmationEmail } from "@/lib/emailTemplates/orderConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, items, total } = body;

    const html = orderConfirmationEmail({
      customerName: "Customer",
      items,
      total,
    });

    const data = await resend.emails.send({
      from: "Nakamirah <onboarding@resend.dev>",
      to: [email],
      subject: "Your Beat Purchase 🎧",
      html,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}