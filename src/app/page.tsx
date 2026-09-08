import Image from "next/image";
import Link from "next/link";

import VehicleSelector from "./components/VehicleSelector";
import { company } from "./data/company";

const categories = [
  {
    name: "Revizie",
    slug: "Revizie",
  },
  {
    name: "Frânare",
    slug: "Frânare",
  },
  {
    name: "Filtre",
    slug: "Filtre",
  },
  {
    name: "Uleiuri",
    slug: "Uleiuri",
  },
  {
    name: "Suspensie",
    slug: "Suspensie",
  },
  {
    name: "Distribuție",
    slug: "Distribuție",
  },
  {
    name: "Ambreiaj",
    slug: "Ambreiaj",
  },
  {
    name: "Electrică",
    slug: "Electrică",
  },
];

export default function Home() {
  return (
    <main>
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
          <a href="#piese">
            Piese auto
          </a>

          <a href="#revizie">
            Revizie
          </a>

          <a href="#service">
            Service-uri
          </a>

          <Link href="/garaj">
            Garajul meu
          </Link>

          <Link
            href="/cont"
            className="ghost-btn"
          >
            Cont
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-content">
          <span className="eyebrow">
            GARAGIO
          </span>

          <h1>
            Piesele potrivite
            <br />
            pentru mașina ta.
          </h1>

          <p>
            Selectează mașina și îți arătăm
            doar piese compatibile. Poți
            căuta fără să îți creezi cont.
          </p>

          <VehicleSelector />
        </div>
      </section>

      <section
        className="section"
        id="piese"
      >
        <div className="section-heading">
          <span className="eyebrow orange">
            PENTRU MAȘINA TA
          </span>

          <h2>
            Ce cauți?
          </h2>

          <p>
            Selectează categoria și vezi
            produsele disponibile în catalogul
            Garagio.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className="category-card"
              key={category.name}
              href={`/piese?category=${encodeURIComponent(
                category.slug
              )}`}
            >
              <div className="category-icon">
                +
              </div>

              <strong>
                {category.name}
              </strong>

              <span>
                Vezi produse →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="section dark-section"
        id="revizie"
      >
        <div className="split">
          <div>
            <span className="eyebrow orange">
              REVIZIA TA
            </span>

            <h2>
              Tot ce îți trebuie, într-un
              singur coș.
            </h2>

            <p>
              Ulei, filtre și consumabile
              potrivite pentru mașina ta.
              Alegi nivelul de calitate, iar
              Garagio îți construiește kitul.
            </p>

            <Link
              href="/piese?category=Revizie"
              className="primary-link-button"
            >
              Vezi kiturile de revizie →
            </Link>
          </div>

          <div className="plans">
            <Link
              href="/piese?category=Revizie&tier=Economy"
              className="plan"
            >
              <span>
                ECONOMY
              </span>

              <strong>
                Preț bun
              </strong>

              <p>
                Variante accesibile și
                compatibile pentru întreținerea
                curentă.
              </p>
            </Link>

            <Link
              href="/piese?category=Revizie&tier=Recommended"
              className="plan featured"
            >
              <div className="recommended-badge">
                RECOMANDAT
              </div>

              <span>
                RECOMMENDED
              </span>

              <strong>
                Alegerea Garagio
              </strong>

              <p>
                Echilibrul potrivit între
                calitate, producător și preț.
              </p>
            </Link>

            <Link
              href="/piese?category=Revizie&tier=Premium"
              className="plan"
            >
              <span>
                PREMIUM
              </span>

              <strong>
                Branduri premium
              </strong>

              <p>
                Pentru cei care preferă
                componente din gama superioară.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="section"
        id="garaj"
      >
        <div className="split garage-section">
          <div>
            <span className="eyebrow orange">
              GARAJUL MEU
            </span>

            <h2>
              Mai mult decât un magazin de
              piese.
            </h2>

            <p>
              Salvează mașina, kilometrajul și
              istoricul reviziilor. Garagio te
              ajută să urmărești întreținerea și
              să găsești din nou rapid produsele
              potrivite.
            </p>

            <ul className="benefit-list">
              <li>
                ✓ Mașinile tale salvate
              </li>

              <li>
                ✓ Istoric revizii și comenzi
              </li>

              <li>
                ✓ Remindere pentru mentenanță
              </li>

              <li>
                ✓ Oferte personalizate
              </li>
            </ul>

            <Link
              href="/garaj"
              className="primary-link-button"
            >
              Deschide Garajul Meu →
            </Link>
          </div>

          <div className="garage-card">
            <div className="garage-card-top">
              <div>
                <small>
                  MAȘINA TA
                </small>

                <h3>
                  BMW Seria 3
                </h3>

                <p>
                  320d · 2018 · 190 CP
                </p>
              </div>

              <span className="status">
                ACTIV
              </span>
            </div>

            <div className="garage-stats">
              <div>
                <span>
                  Kilometraj
                </span>

                <strong>
                  152.430 km
                </strong>
              </div>

              <div>
                <span>
                  Ultima revizie
                </span>

                <strong>
                  142.210 km
                </strong>
              </div>

              <div>
                <span>
                  Următoarea estimată
                </span>

                <strong className="orange-text">
                  ~2.300 km
                </strong>
              </div>
            </div>

            <div className="garage-alert">
              <div>
                <span>
                  REVIZIE ESTIMATĂ
                </span>

                <strong>
                  Se apropie următoarea revizie
                </strong>
              </div>

              <Link href="/piese?category=Revizie">
                Vezi kitul →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-grid">
          <div>
            <span>
              01
            </span>

            <strong>
              Compatibilitate
            </strong>

            <p>
              Vezi produse potrivite pentru
              mașina selectată.
            </p>
          </div>

          <div>
            <span>
              02
            </span>

            <strong>
              Alegi cum cumperi
            </strong>

            <p>
              Comparăm variante de preț,
              calitate și livrare.
            </p>
          </div>

          <div>
            <span>
              03
            </span>

            <strong>
              Garaj digital
            </strong>

            <p>
              Mașina, istoricul și comenzile
              tale într-un singur loc.
            </p>
          </div>

          <div>
            <span>
              04
            </span>

            <strong>
              Revizii mai simple
            </strong>

            <p>
              Primești recomandări când se
              apropie mentenanța.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section service-section"
        id="service"
      >
        <div className="section-heading">
          <span className="eyebrow orange">
            SERVICE FINDER
          </span>

          <h2>
            Ai piesele. Îți trebuie și un
            service?
          </h2>

          <p>
            Descoperă service-uri care acceptă
            montarea pieselor achiziționate prin
            Garagio.
          </p>
        </div>

        <div className="service-box">
          <select defaultValue="">
            <option
              value=""
              disabled
            >
              Selectează județul
            </option>

            <option>
              Buzău
            </option>

            <option>
              București
            </option>

            <option>
              Prahova
            </option>
          </select>

          <Link
            href="/service-uri"
            className="primary-link-button"
          >
            Găsește un service
          </Link>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">
            GARAGIO
          </span>

          <h2>
            Mașina ta. Mai simplu de
            întreținut.
          </h2>

          <p>
            Creează gratuit Garajul tău și
            salvează prima mașină.
          </p>
        </div>

        <Link
          href="/garaj"
          className="cta-btn"
        >
          Adaugă mașina →
        </Link>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-company">
            <div className="footer-logo-shell">
              <Image
                src="/logo-garagio-v2.png"
                alt="Garagio"
                width={500}
                height={150}
                className="footer-logo"
              />
            </div>

            <p className="footer-tagline">
              Garajul digital al mașinii tale.
            </p>

            <div className="footer-company-data">
              <strong>{company.legalName}</strong>

              <span>
                CUI: {company.cui}
              </span>

              <span>
                Nr. Registrul Comerțului:{" "}
                {company.registrationNumber}
              </span>

              <span>
                {company.address}
              </span>

              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                {company.phone}
              </a>

              <a href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </div>
          </div>

          <div className="footer-navigation">
            <div className="footer-column">
              <strong>Garagio</strong>

              <Link href="/">
                Acasă
              </Link>

              <Link href="/piese">
                Piese auto
              </Link>

              <Link href="/service-uri">
                Service-uri
              </Link>

              <Link href="/garaj">
                Garajul meu
              </Link>

              <Link href="/cont">
                Cont
              </Link>
            </div>

            <div className="footer-column">
              <strong>Informații</strong>

              <Link href="/termeni">
                Termeni și condiții
              </Link>

              <Link href="/livrare">
                Livrare
              </Link>

              <Link href="/retur">
                Retur și anulare
              </Link>

              <Link href="/confidentialitate">
                Confidențialitate / GDPR
              </Link>

              <Link href="/contact">
                Contact
              </Link>
            </div>

            <div className="footer-column">
              <strong>Consumatori</strong>

              <a
                href="https://anpc.ro/"
                target="_blank"
                rel="noreferrer"
              >
                ANPC
              </a>

              <span className="footer-note">
                Informațiile privind soluționarea
                alternativă a litigiilor vor fi
                afișate în secțiunea dedicată.
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 {company.brand}. Toate drepturile
            rezervate.
          </span>

          <span>
            {company.website.replace("https://", "")}
          </span>
        </div>
      </footer>
    </main>
  );
}