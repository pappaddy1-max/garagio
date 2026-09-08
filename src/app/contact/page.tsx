"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { company } from "../data/company";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      orderNumber: String(formData.get("orderNumber") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    setSuccessMessage("");
    setErrorMessage("");

    if (!payload.name || !payload.email || !payload.message) {
      setErrorMessage(
        "Completează numele, adresa de email și mesajul."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Mesajul nu a putut fi trimis."
        );
      }

      form.reset();
      setSuccessMessage(
        "Mesajul a fost trimis cu succes. Îți vom răspunde cât mai curând."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "A apărut o eroare la trimiterea mesajului."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <header className="topbar">
        <Link className="brand" href="/">
          <Image
            src="/logo-garagio-v2.png"
            alt="Garagio"
            width={500}
            height={150}
            className="brand-logo"
            priority
          />
        </Link>

        <nav>
          <Link href="/">Acasă</Link>
          <Link href="/piese">Piese auto</Link>
          <Link href="/garaj">Garajul meu</Link>
          <Link href="/cont" className="ghost-btn">
            Cont
          </Link>
        </nav>
      </header>

      <section
        style={{
          background:
            "radial-gradient(circle at 82% 40%, rgba(255,106,0,.12), transparent 25%), #0f172a",
          color: "white",
          padding: "62px 0",
        }}
      >
        <div
          style={{
            width: "min(1080px, 88%)",
            margin: "0 auto",
          }}
        >
          <span className="eyebrow orange">
            CONTACT GARAGIO
          </span>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(40px, 5vw, 62px)",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Suntem aici să te ajutăm.
          </h1>

          <p
            style={{
              maxWidth: "720px",
              margin: 0,
              color: "#cbd5e1",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            Pentru comenzi, compatibilitate, livrare, retururi sau
            întrebări despre Garajul Meu, ne poți contacta folosind
            datele de mai jos.
          </p>
        </div>
      </section>

      <section
        style={{
          width: "min(1080px, 88%)",
          margin: "0 auto",
          padding: "52px 0 90px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <ContactCard
              eyebrow="EMAIL"
              title={company.email}
              text="Pentru întrebări generale, comenzi și solicitări de suport."
              href={`mailto:${company.email}`}
              action="Trimite email →"
            />

            <ContactCard
              eyebrow="TELEFON"
              title={company.phone}
              text="Pentru situații care necesită clarificare rapidă."
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              action="Sună acum →"
            />

            <div
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <span className="eyebrow orange">
                DATE COMERCIANT
              </span>

              <h2
                style={{
                  margin: "3px 0 16px",
                  fontSize: "22px",
                }}
              >
                {company.legalName}
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "8px",
                  color: "#64748b",
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}
              >
                <span>CUI: {company.cui}</span>

                <span>
                  Nr. Registrul Comerțului:{" "}
                  {company.registrationNumber}
                </span>

                <span>{company.address}</span>

                <span>
                  Website:{" "}
                  <a
                    href={company.website}
                    style={{
                      color: "#ff6a00",
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    {company.website.replace("https://", "")}
                  </a>
                </span>
              </div>
            </div>

            <div
              style={{
                background: "#0f172a",
                color: "white",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <span className="eyebrow orange">
                PROGRAM CONTACT
              </span>

              <h2
                style={{
                  margin: "3px 0 14px",
                  fontSize: "22px",
                }}
              >
                Răspundem cât mai repede.
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "7px",
                  color: "#cbd5e1",
                  fontSize: "13px",
                }}
              >
                <span>Luni – Vineri: 09:00 – 18:00</span>
                <span>Sâmbătă: 10:00 – 14:00</span>
                <span>Duminică: închis</span>
              </div>

              <p
                style={{
                  margin: "16px 0 0",
                  color: "#94a3b8",
                  fontSize: "11px",
                  lineHeight: 1.6,
                }}
              >
                Emailurile pot fi trimise oricând. Programul de mai sus
                se referă la intervalul orientativ de răspuns telefonic.
              </p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "18px",
              padding: "28px",
            }}
          >
            <span className="eyebrow orange">
              TRIMITE UN MESAJ
            </span>

            <h2
              style={{
                margin: "3px 0 8px",
                fontSize: "28px",
              }}
            >
              Cu ce te putem ajuta?
            </h2>

            <p
              style={{
                margin: "0 0 24px",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Completează formularul, iar mesajul va fi trimis direct
              către echipa Garagio.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              <label style={labelStyle}>
                Nume și prenume
                <input
                  type="text"
                  name="name"
                  placeholder="Numele tău"
                  autoComplete="name"
                  required
                  style={fieldStyle}
                />
              </label>

              <label style={labelStyle}>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email@exemplu.ro"
                  autoComplete="email"
                  required
                  style={fieldStyle}
                />
              </label>

              <label style={labelStyle}>
                Telefon
                <input
                  type="tel"
                  name="phone"
                  placeholder="07..."
                  autoComplete="tel"
                  style={fieldStyle}
                />
              </label>

              <label style={labelStyle}>
                Subiect
                <select
                  name="subject"
                  defaultValue="Comandă"
                  style={fieldStyle}
                >
                  <option>Comandă</option>
                  <option>Compatibilitate piese</option>
                  <option>Livrare</option>
                  <option>Retur / garanție</option>
                  <option>Cont / Garajul Meu</option>
                  <option>Altceva</option>
                </select>
              </label>

              <label style={labelStyle}>
                Număr comandă
                <input
                  type="text"
                  name="orderNumber"
                  placeholder="Opțional"
                  style={fieldStyle}
                />
              </label>

              <label style={labelStyle}>
                Mesaj
                <textarea
                  name="message"
                  placeholder="Scrie aici detaliile solicitării..."
                  rows={7}
                  required
                  style={{
                    ...fieldStyle,
                    resize: "vertical",
                    minHeight: "150px",
                  }}
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  border: 0,
                  borderRadius: "10px",
                  background: "#ff6a00",
                  color: "white",
                  minHeight: "50px",
                  padding: "0 20px",
                  fontWeight: 900,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Se trimite..." : "Trimite mesajul"}
              </button>

              {successMessage && (
                <div
                  role="status"
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    color: "#047857",
                    fontSize: "12px",
                    lineHeight: 1.55,
                  }}
                >
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div
                  role="alert"
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    fontSize: "12px",
                    lineHeight: 1.55,
                  }}
                >
                  {errorMessage}
                </div>
              )}
            </form>

            <div
              style={{
                marginTop: "18px",
                padding: "14px",
                borderRadius: "10px",
                background: "#f8fafc",
                color: "#64748b",
                fontSize: "11px",
                lineHeight: 1.55,
              }}
            >
              Pentru retururi și garanții, include dacă este posibil
              numărul comenzii și codul produsului.
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "26px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/termeni" style={secondaryButtonStyle}>
            Termeni și condiții
          </Link>

          <Link href="/livrare" style={secondaryButtonStyle}>
            Livrare
          </Link>

          <Link href="/retur" style={secondaryButtonStyle}>
            Retur și anulare
          </Link>

          <Link
            href="/confidentialitate"
            style={primaryButtonStyle}
          >
            Confidențialitate →
          </Link>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  eyebrow,
  title,
  text,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <span className="eyebrow orange">
        {eyebrow}
      </span>

      <h2
        style={{
          margin: "3px 0 8px",
          fontSize: "22px",
          wordBreak: "break-word",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "0 0 18px",
          color: "#64748b",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        {text}
      </p>

      <a
        href={href}
        style={{
          color: "#ff6a00",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: 900,
        }}
      >
        {action}
      </a>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: "7px",
  color: "#334155",
  fontSize: "12px",
  fontWeight: 800,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d8dee8",
  borderRadius: "9px",
  background: "white",
  color: "#0f172a",
  minHeight: "48px",
  padding: "12px 13px",
  font: "inherit",
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 16px",
  background: "#ff6a00",
  color: "white",
  borderRadius: "9px",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: 800,
};

const secondaryButtonStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 16px",
  background: "white",
  color: "#0f172a",
  border: "1px solid #e2e8f0",
  borderRadius: "9px",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: 800,
};
