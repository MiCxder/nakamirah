import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: "Nakamirah <onboarding@resend.dev>", // replace later with your domain
      to: ["miranking@gmail.com"], // YOUR email
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family:sans-serif">
          <h2>New Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
