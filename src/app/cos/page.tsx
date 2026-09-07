"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../components/CartContext";

export default function CartPage() {
  const {
    items,
    cartCount,
    subtotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const freeShippingThreshold = 300;

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= freeShippingThreshold
      ? 0
      : 19.9;

  const total = subtotal + shipping;

  const remainingForFreeShipping =
    Math.max(
      0,
      freeShippingThreshold - subtotal
    );

  return (
    <main className="cart-page">
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

          <Link href="/#revizie">
            Revizie
          </Link>

          <Link href="/#service">
            Service-uri
          </Link>

          <Link
            href="/cos"
            className="cart-button"
          >
            Coș
            <span>
              {cartCount}
            </span>
          </Link>
        </nav>
      </header>

      <section className="cart-header">
        <div className="cart-container">
          <div className="breadcrumb">
            <Link href="/">
              Acasă
            </Link>

            <span>/</span>

            <span>
              Coșul meu
            </span>
          </div>

          <span className="eyebrow orange">
            COMANDA TA
          </span>

          <h1>
            Coșul meu
          </h1>

          <p>
            Verifică produsele înainte de
            finalizarea comenzii.
          </p>
        </div>
      </section>

      <section className="cart-content">
        <div className="cart-container">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                G
              </div>

              <h2>
                Coșul tău este gol
              </h2>

              <p>
                Selectează mașina și
                descoperă piesele
                compatibile.
              </p>

              <Link
                href="/"
                className="primary-link-button"
              >
                Caută piese →
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-products">
                <div className="cart-products-header">
                  <div>
                    <h2>
                      Produse
                    </h2>

                    <span>
                      {cartCount}{" "}
                      {cartCount === 1
                        ? "produs"
                        : "produse"}
                    </span>
                  </div>

                  <button
                    className="clear-cart-button"
                    onClick={clearCart}
                  >
                    Golește coșul
                  </button>
                </div>

                {items.map((item) => (
                  <article
                    className="cart-item"
                    key={item.id}
                  >
                    <div className="cart-item-image">
                      {item.brand
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="cart-item-info">
                      <span className="cart-item-brand">
                        {item.brand}
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <span className="cart-item-code">
                        Cod produs:{" "}
                        {item.code}
                      </span>

                      <div className="cart-compatible">
                        ✓ Compatibilitate
                        verificată
                      </div>
                    </div>

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                        aria-label="Scade cantitatea"
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                        aria-label="Crește cantitatea"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      <strong>
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}{" "}
                        lei
                      </strong>

                      {item.quantity >
                        1 && (
                        <span>
                          {item.price.toFixed(
                            2
                          )}{" "}
                          lei / buc.
                        </span>
                      )}

                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                      >
                        Elimină
                      </button>
                    </div>
                  </article>
                ))}

                <Link
                  href="/piese"
                  className="continue-shopping"
                >
                  ← Continuă cumpărăturile
                </Link>
              </div>

              <aside className="order-summary">
                <span className="summary-eyebrow">
                  SUMAR COMANDĂ
                </span>

                <h2>
                  Total
                </h2>

                {subtotal <
                  freeShippingThreshold && (
                  <div className="shipping-progress-box">
                    <strong>
                      Mai adaugă{" "}
                      {remainingForFreeShipping.toFixed(
                        2
                      )}{" "}
                      lei
                    </strong>

                    <span>
                      pentru livrare
                      gratuită
                    </span>

                    <div className="shipping-progress">
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal /
                              freeShippingThreshold) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {subtotal >=
                  freeShippingThreshold && (
                  <div className="free-shipping-success">
                    ✓ Ai livrare gratuită
                  </div>
                )}

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

                <div className="summary-divider" />

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
                    {total.toFixed(2)} lei
                  </strong>
                </div>

                <Link
                  href="/checkout"
                  className="checkout-button"
                >
                  Continuă spre checkout →
                </Link>

                <div className="summary-benefits">
                  <span>
                    ✓ Plată securizată
                  </span>

                  <span>
                    ✓ Verificare
                    compatibilitate
                  </span>

                  <span>
                    ✓ Factură inclusă
                  </span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <Image
            src="/logo-garagio-v2.png"
            alt="Garagio"
            width={500}
            height={150}
            className="footer-logo"
          />
        </div>

        <div className="footer-links">
          <Link href="/">
            Acasă
          </Link>

          <Link href="/piese">
            Piese auto
          </Link>

          <Link href="/#service">
            Service-uri
          </Link>

          <Link href="/#garaj">
            Garajul meu
          </Link>
        </div>

        <p>
          © 2026 Garagio. Toate
          drepturile rezervate.
        </p>
      </footer>
    </main>
  );
}