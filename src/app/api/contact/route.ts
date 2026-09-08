import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      subject,
      orderNumber,
      message,
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error:
            "Completează numele, emailul și mesajul.",
        },
        { status: 400 }
      );
    }

    const contactEmail =
      process.env.CONTACT_EMAIL ||
      "contact@garagio.ro";

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "Garagio <contact@garagio.ro>";

    const emailSubject =
      subject && subject.trim()
        ? `Garagio contact: ${subject}`
        : "Mesaj nou din formularul Garagio";

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a;">
          <h2>Mesaj nou din formularul Garagio</h2>

          <p><strong>Nume:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(phone || "-")}</p>
          <p><strong>Subiect:</strong> ${escapeHtml(subject || "-")}</p>
          <p><strong>Număr comandă:</strong> ${escapeHtml(
            orderNumber || "-"
          )}</p>

          <hr style="margin: 24px 0;" />

          <p><strong>Mesaj:</strong></p>
          <p style="white-space: pre-wrap;">
            ${escapeHtml(message)}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend contact error:", error);

      return NextResponse.json(
        {
          error:
            "Mesajul nu a putut fi trimis.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        error:
          "A apărut o eroare la trimiterea mesajului.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}