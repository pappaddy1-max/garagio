import Link from "next/link";

import {
  createClient,
} from "../../lib/supabase/server";

export default async function SupabaseTestPage() {
  let status =
    "Conexiunea nu a fost testată.";

  let success = false;

  try {
    const supabase =
      await createClient();

    const {
      data,
      error,
    } =
      await supabase.auth.getSession();

    if (error) {
      status =
        `Eroare Supabase: ${error.message}`;
    } else {
      success = true;

      status =
        "Conexiunea Next.js ↔ Supabase funcționează.";
    }

    console.log(
      "Supabase session:",
      data.session
    );
  } catch (error) {
    status =
      error instanceof Error
        ? error.message
        : "A apărut o eroare necunoscută.";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "80px 20px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "min(700px, 100%)",
          margin: "0 auto",
          background: "#ffffff",
          border:
            "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "40px",
        }}
      >
        <span
          style={{
            color: "#ff6a00",
            fontSize: "11px",
            fontWeight: 900,
            letterSpacing: "2px",
          }}
        >
          GARAGIO / SUPABASE
        </span>

        <h1
          style={{
            fontSize: "38px",
            margin:
              "12px 0 15px",
          }}
        >
          Test conexiune
        </h1>

        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            borderRadius: "12px",
            background:
              success
                ? "#ecfdf5"
                : "#fef2f2",
            color:
              success
                ? "#047857"
                : "#b91c1c",
            fontWeight: 800,
          }}
        >
          {success
            ? "✓ "
            : "✕ "}

          {status}
        </div>

        {success && (
          <p
            style={{
              marginTop: "20px",
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Aplicația poate comunica
            acum cu proiectul Supabase.
            E normal să nu existe încă
            o sesiune de utilizator.
          </p>
        )}

        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "25px",
            background: "#0f172a",
            color: "#ffffff",
            padding: "12px 18px",
            borderRadius: "9px",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          ← Înapoi la Garagio
        </Link>
      </div>
    </main>
  );
}