import {
  NextResponse,
} from "next/server";

import {
  Resend,
} from "resend";

export const dynamic =
  "force-dynamic";

export async function GET() {
  try {
    const apiKey =
      process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "RESEND_API_KEY lipsește din .env.local",
        },
        {
          status: 500,
        }
      );
    }

    const resend =
      new Resend(apiKey);

    const {
      data,
      error,
    } =
      await resend.emails.send({
        from:
          "Garagio <comenzi@garagio.ro>",

        /*
         * Pentru primul test trimitem
         * către adresa asociată contului
         * tău Resend.
         *
         * ÎNLOCUIEȘTE adresa de mai jos
         * cu emailul tău.
         */
        to: [
          "pappaddy90@gmail.com",
        ],

        subject:
          "Garagio - test email",

        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 40px;
            "
          >
            <h1>
              Garagio funcționează! 🚗
            </h1>

            <p>
              Acesta este primul email
              trimis automat de Garagio.
            </p>

            <p>
              Dacă vezi acest mesaj,
              integrarea Next.js + Resend +
              garagio.ro funcționează.
            </p>
          </div>
        `,
      });

    if (error) {
      console.error(
        "Resend error:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });
  } catch (error) {
    console.error(
      "Test email error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Emailul nu a putut fi trimis.",
      },
      {
        status: 500,
      }
    );
  }
}