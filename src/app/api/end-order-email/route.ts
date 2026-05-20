import { Resend } from "resend";
import { orderConfirmationEmail } from "@/lib/emailTemplates/orderConfirmation";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
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