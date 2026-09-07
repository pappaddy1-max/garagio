"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "../components/CartContext";
import { createClient } from "../../lib/supabase/client";

type CustomerType = "individual" | "company";
type PaymentMethod = "card" | "cash";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  county: string;
  city: string;
  address: string;
  postalCode: string;

  vin: string;

  companyName: string;
  cui: string;
  regCom: string;

  notes: string;
};

type OrderSuccess = {
  orderNumber: string;
  total: number;
  email: string;
  paymentMethod: PaymentMethod;
};

export default function CheckoutPage() {
  const supabase = createClient();

  const {
    items,
    cartCount,
    subtotal,
    clearCart,
  } = useCart();

  const [customerType, setCustomerType] =
    useState<CustomerType>("individual");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");

  const [acceptTerms, setAcceptTerms] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState<OrderSuccess | null>(null);

  const [form, setForm] =
    useState<FormData>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",

      county: "",
      city: "",
      address: "",
      postalCode: "",

      vin: "",

      companyName: "",
      cui: "",
      regCom: "",

      notes: "",
    });

  const freeShippingThreshold = 300;

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= freeShippingThreshold
      ? 0
      : 19.9;

  const total = subtotal + shipping;

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function validateForm() {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim()
    ) {
      return "Completează numele și prenumele.";
    }

    if (!form.email.trim()) {
      return "Completează adresa de email.";
    }

    if (
      !form.email.includes("@") ||
      !form.email.includes(".")
    ) {
      return "Adresa de email nu pare validă.";
    }

    if (!form.phone.trim()) {
      return "Completează numărul de telefon.";
    }

    if (
      !form.county.trim() ||
      !form.city.trim()
    ) {
      return "Completează județul și localitatea.";
    }

    if (!form.address.trim()) {
      return "Completează adresa de livrare.";
    }

    if (
      form.vin.trim() &&
      form.vin.trim().length !== 17
    ) {
      return "Seria VIN trebuie să aibă exact 17 caractere.";
    }

    if (
      customerType === "company" &&
      !form.companyName.trim()
    ) {
      return "Completează denumirea firmei.";
    }

    if (
      customerType === "company" &&
      !form.cui.trim()
    ) {
      return "Completează CUI-ul firmei.";
    }

    if (!acceptTerms) {
      return "Trebuie să accepți termenii și condițiile.";
    }

    return "";
  }

  async function submitOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (items.length === 0) {
      setError(
        "Coșul este gol. Adaugă produse înainte de checkout."
      );
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const {
        data: sessionData,
      } =
        await supabase.auth.getSession();

      const accessToken =
        sessionData.session?.access_token;

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",

            ...(accessToken
              ? {
                  Authorization:
                    `Bearer ${accessToken}`,
                }
              : {}),
          },
          body: JSON.stringify({
            customerType,
            paymentMethod,

            customer: {
              firstName:
                form.firstName.trim(),
              lastName:
                form.lastName.trim(),
              email:
                form.email.trim(),
              phone:
                form.phone.trim(),
            },

            delivery: {
              county:
                form.county.trim(),
              city:
                form.city.trim(),
              address:
                form.address.trim(),
              postalCode:
                form.postalCode.trim(),
            },

            vin:
              form.vin
                .trim()
                .toUpperCase() ||
              null,

            company:
              customerType ===
              "company"
                ? {
                    name:
                      form.companyName.trim(),
                    cui:
                      form.cui.trim(),
                    regCom:
                      form.regCom.trim(),
                  }
                : null,

            notes:
              form.notes.trim() ||
              null,

            /*
             * Trimitem doar identificatorul
             * produsului și cantitatea.
             *
             * Serverul recitește prețurile
             * din Supabase și calculează
             * subtotalul/livrarea/totalul.
             */
            items: items.map(
              (item) => ({
                productId:
                  item.databaseId ||
                  null,
                productCode:
                  item.code,
                quantity:
                  item.quantity,
              })
            ),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Comanda nu a putut fi salvată."
        );
      }

      setSuccess({
        orderNumber:
          result.orderNumber,
        total:
          Number(result.total),
        email:
          form.email.trim(),
        paymentMethod,
      });

      clearCart();
    } catch (submitError) {
      console.error(
        "Eroare la plasarea comenzii:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "A apărut o eroare la plasarea comenzii."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="checkout-page">
        <header className="topbar">
          <Link
            className="brand"
            href="/"
          >
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
            <Link href="/">
              Acasă
            </Link>

            <Link href="/piese">
              Piese auto
            </Link>
          </nav>
        </header>

        <section className="order-success-page">
          <div className="order-success-card">
            <div className="success-icon">
              ✓
            </div>

            <span className="eyebrow orange">
              COMANDĂ ÎNREGISTRATĂ
            </span>

            <h1>
              Mulțumim pentru comandă.
            </h1>

            <p>
              Comanda ta a fost salvată în
              sistemul demo Garagio.
            </p>

            <div className="order-number-box">
              <span>
                NUMĂR COMANDĂ
              </span>

              <strong>
                {success.orderNumber}
              </strong>
            </div>

            <div className="success-details">
              <div>
                <span>
                  Total
                </span>

                <strong>
                  {success.total.toFixed(
                    2
                  )}{" "}
                  lei
                </strong>
              </div>

              <div>
                <span>
                  Plata
                </span>

                <strong>
                  {success.paymentMethod ===
                  "card"
                    ? "Card online"
                    : "Ramburs"}
                </strong>
              </div>

              <div>
                <span>
                  Confirmare
                </span>

                <strong>
                  {success.email}
                </strong>
              </div>
            </div>

            <div className="demo-warning">
              În această etapă nu a fost
              procesată nicio plată reală și
              comanda nu a fost transmisă
              unui furnizor.
            </div>

            <div className="success-actions">
              <Link
                href="/"
                className="checkout-secondary-button"
              >
                Înapoi acasă
              </Link>

              <Link
                href="/piese"
                className="checkout-primary-button"
              >
                Continuă cumpărăturile
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="topbar">
        <Link
          className="brand"
          href="/"
        >
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
          <Link href="/">
            Acasă
          </Link>

          <Link href="/piese">
            Piese auto
          </Link>

          <Link href="/cos">
            Înapoi la coș
          </Link>
        </nav>
      </header>

      <section className="checkout-header">
        <div className="checkout-container">
          <div className="breadcrumb">
            <Link href="/">
              Acasă
            </Link>

            <span>/</span>

            <Link href="/cos">
              Coș
            </Link>

            <span>/</span>

            <span>
              Checkout
            </span>
          </div>

          <span className="eyebrow orange">
            FINALIZARE COMANDĂ
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Completează datele de
            livrare și verifică
            ultima dată comanda.
          </p>
        </div>
      </section>

      <section className="checkout-content">
        <div className="checkout-container">
          {items.length === 0 ? (
            <div className="empty-checkout">
              <h2>
                Coșul tău este gol
              </h2>

              <p>
                Nu poți finaliza o
                comandă fără produse.
              </p>

              <Link
                href="/piese"
                className="checkout-primary-button"
              >
                Vezi piesele →
              </Link>
            </div>
          ) : (
            <form
              className="checkout-layout"
              onSubmit={submitOrder}
            >
              <div className="checkout-form-column">
                <section className="checkout-card">
                  <div className="checkout-card-header">
                    <span>01</span>

                    <div>
                      <h2>
                        Date de contact
                      </h2>

                      <p>
                        Folosim aceste date
                        pentru confirmarea și
                        livrarea comenzii.
                      </p>
                    </div>
                  </div>

                  <div className="checkout-fields two-columns">
                    <label>
                      Prenume *
                      <input
                        type="text"
                        value={
                          form.firstName
                        }
                        onChange={(e) =>
                          updateField(
                            "firstName",
                            e.target.value
                          )
                        }
                        placeholder="Adrian"
                      />
                    </label>

                    <label>
                      Nume *
                      <input
                        type="text"
                        value={
                          form.lastName
                        }
                        onChange={(e) =>
                          updateField(
                            "lastName",
                            e.target.value
                          )
                        }
                        placeholder="Papuc"
                      />
                    </label>

                    <label>
                      Email *
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          updateField(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="email@exemplu.ro"
                      />
                    </label>

                    <label>
                      Telefon *
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="+40 7xx xxx xxx"
                      />
                    </label>
                  </div>
                </section>

                <section className="checkout-card">
                  <div className="checkout-card-header">
                    <span>02</span>

                    <div>
                      <h2>
                        Adresa de livrare
                      </h2>

                      <p>
                        Comanda va fi livrată
                        prin curier la această
                        adresă.
                      </p>
                    </div>
                  </div>

                  <div className="checkout-fields two-columns">
                    <label>
                      Județ *
                      <input
                        type="text"
                        value={
                          form.county
                        }
                        onChange={(e) =>
                          updateField(
                            "county",
                            e.target.value
                          )
                        }
                        placeholder="Buzău"
                      />
                    </label>

                    <label>
                      Localitate *
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) =>
                          updateField(
                            "city",
                            e.target.value
                          )
                        }
                        placeholder="Buzău"
                      />
                    </label>

                    <label className="full-field">
                      Adresă *
                      <input
                        type="text"
                        value={
                          form.address
                        }
                        onChange={(e) =>
                          updateField(
                            "address",
                            e.target.value
                          )
                        }
                        placeholder="Stradă, număr, bloc, scară, apartament"
                      />
                    </label>

                    <label>
                      Cod poștal
                      <input
                        type="text"
                        value={
                          form.postalCode
                        }
                        onChange={(e) =>
                          updateField(
                            "postalCode",
                            e.target.value
                          )
                        }
                        placeholder="120000"
                      />
                    </label>
                  </div>
                </section>

                <section className="checkout-card">
                  <div className="checkout-card-header">
                    <span>03</span>

                    <div>
                      <h2>
                        Compatibilitate
                      </h2>

                      <p>
                        Opțional, poți furniza
                        seria VIN pentru
                        verificarea pieselor.
                      </p>
                    </div>
                  </div>

                  <div className="vin-checkout-box">
                    <label>
                      Seria VIN
                      <input
                        type="text"
                        maxLength={17}
                        value={form.vin}
                        onChange={(e) =>
                          updateField(
                            "vin",
                            e.target.value
                              .toUpperCase()
                          )
                        }
                        placeholder="WBA12345678901234"
                      />
                    </label>

                    <div className="vin-help">
                      <span>✓</span>

                      <p>
                        Dacă introduci VIN-ul,
                        Garagio îl poate folosi
                        ulterior pentru o
                        verificare suplimentară
                        înainte de expediere.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="checkout-card">
                  <div className="checkout-card-header">
                    <span>04</span>

                    <div>
                      <h2>
                        Facturare
                      </h2>

                      <p>
                        Selectează tipul de
                        client.
                      </p>
                    </div>
                  </div>

                  <div className="customer-type-selector">
                    <button
                      type="button"
                      className={
                        customerType ===
                        "individual"
                          ? "customer-type-button active"
                          : "customer-type-button"
                      }
                      onClick={() =>
                        setCustomerType(
                          "individual"
                        )
                      }
                    >
                      Persoană fizică
                    </button>

                    <button
                      type="button"
                      className={
                        customerType ===
                        "company"
                          ? "customer-type-button active"
                          : "customer-type-button"
                      }
                      onClick={() =>
                        setCustomerType(
                          "company"
                        )
                      }
                    >
                      Persoană juridică
                    </button>
                  </div>

                  {customerType ===
                    "company" && (
                    <div className="checkout-fields two-columns company-fields">
                      <label className="full-field">
                        Denumire firmă *
                        <input
                          type="text"
                          value={
                            form.companyName
                          }
                          onChange={(e) =>
                            updateField(
                              "companyName",
                              e.target.value
                            )
                          }
                          placeholder="GARAGIO SRL"
                        />
                      </label>

                      <label>
                        CUI *
                        <input
                          type="text"
                          value={
                            form.cui
                          }
                          onChange={(e) =>
                            updateField(
                              "cui",
                              e.target.value
                            )
                          }
                          placeholder="RO12345678"
                        />
                      </label>

                      <label>
                        Nr. Registrul
                        Comerțului
                        <input
                          type="text"
                          value={
                            form.regCom
                          }
                          onChange={(e) =>
                            updateField(
                              "regCom",
                              e.target.value
                            )
                          }
                          placeholder="J10/123/2026"
                        />
                      </label>
                    </div>
                  )}
                </section>

                <section className="checkout-card">
                  <div className="checkout-card-header">
                    <span>05</span>

                    <div>
                      <h2>
                        Metoda de plată
                      </h2>

                      <p>
                        Pentru moment metodele
                        sunt demonstrative.
                      </p>
                    </div>
                  </div>

                  <div className="payment-options">
                    <button
                      type="button"
                      className={
                        paymentMethod ===
                        "card"
                          ? "payment-option active"
                          : "payment-option"
                      }
                      onClick={() =>
                        setPaymentMethod(
                          "card"
                        )
                      }
                    >
                      <div>
                        <strong>
                          Card online
                        </strong>

                        <span>
                          Visa / Mastercard
                        </span>
                      </div>

                      <span className="payment-radio" />
                    </button>

                    <button
                      type="button"
                      className={
                        paymentMethod ===
                        "cash"
                          ? "payment-option active"
                          : "payment-option"
                      }
                      onClick={() =>
                        setPaymentMethod(
                          "cash"
                        )
                      }
                    >
                      <div>
                        <strong>
                          Ramburs
                        </strong>

                        <span>
                          Plată la curier
                        </span>
                      </div>

                      <span className="payment-radio" />
                    </button>
                  </div>
                </section>

                <section className="checkout-card">
                  <div className="checkout-card-header">
                    <span>06</span>

                    <div>
                      <h2>
                        Observații
                      </h2>

                      <p>
                        Opțional.
                      </p>
                    </div>
                  </div>

                  <label className="checkout-notes">
                    Mesaj pentru comandă
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        updateField(
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Ex: Vă rog să verificați compatibilitatea înainte de expediere."
                    />
                  </label>
                </section>
              </div>

              <aside className="checkout-summary">
                <span className="summary-eyebrow">
                  COMANDA TA
                </span>

                <h2>
                  {cartCount}{" "}
                  {cartCount === 1
                    ? "produs"
                    : "produse"}
                </h2>

                <div className="checkout-product-list">
                  {items.map((item) => (
                    <div
                      className="checkout-product"
                      key={item.id}
                    >
                      <div className="checkout-product-icon">
                        {item.brand
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <div className="checkout-product-info">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.quantity} ×{" "}
                          {item.price.toFixed(
                            2
                          )}{" "}
                          lei
                        </span>
                      </div>

                      <strong className="checkout-product-total">
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}{" "}
                        lei
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary-divider" />

                <div className="summary-row">
                  <span>
                    Subtotal
                  </span>

                  <strong>
                    {subtotal.toFixed(2)}{" "}
                    lei
                  </strong>
                </div>

                <div className="summary-row">
                  <span>
                    Livrare
                  </span>

                  <strong
                    className={
                      shipping === 0
                        ? "free-shipping-text"
                        : ""
                    }
                  >
                    {shipping === 0
                      ? "GRATUIT"
                      : `${shipping.toFixed(
                          2
                        )} lei`}
                  </strong>
                </div>

                <div className="checkout-summary-divider" />

                <div className="summary-total">
                  <div>
                    <span>
                      TOTAL
                    </span>

                    <small>
                      TVA inclus
                    </small>
                  </div>

                  <strong>
                    {total.toFixed(2)}{" "}
                    lei
                  </strong>
                </div>

                {error && (
                  <div className="checkout-error">
                    {error}
                  </div>
                )}

                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      acceptTerms
                    }
                    onChange={(e) => {
                      setAcceptTerms(
                        e.target.checked
                      );

                      setError("");
                    }}
                  />

                  <span>
                    Sunt de acord cu
                    termenii și condițiile
                    și politica de
                    confidențialitate.
                  </span>
                </label>

                <button
                  type="submit"
                  className="place-order-button"
                  disabled={
                    isSubmitting
                  }
                >
                  {isSubmitting
                    ? "Se procesează..."
                    : paymentMethod ===
                      "card"
                    ? `Plătește ${total.toFixed(
                        2
                      )} lei`
                    : "Plasează comanda"}
                </button>

                <div className="checkout-security">
                  <span>
                    🔒 Checkout securizat
                  </span>

                  <span>
                    ✓ Compatibilitate
                  </span>

                  <span>
                    ✓ Factură
                  </span>
                </div>

                <div className="checkout-demo-notice">
                  DEMO — Butonul nu
                  procesează încă o plată
                  reală.
                </div>
              </aside>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}