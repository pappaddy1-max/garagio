import Image from "next/image";
import Link from "next/link";

import { company } from "../data/company";

export default function DeliveryPage() {
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
            width: "min(1040px, 88%)",
            margin: "0 auto",
          }}
        >
          <span className="eyebrow orange">
            COMENZI GARAGIO
          </span>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(40px, 5vw, 62px)",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Politica de livrare
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
            Informații despre expedierea, costul și recepția
            comenzilor plasate pe Garagio.
          </p>
        </div>
      </section>

      <section
        style={{
          width: "min(1040px, 88%)",
          margin: "0 auto",
          padding: "52px 0 90px",
        }}
      >
        <div
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            padding: "clamp(24px, 5vw, 52px)",
          }}
        >
          <div
            style={{
              marginBottom: "42px",
              padding: "20px",
              borderRadius: "12px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              color: "#9a3412",
              fontSize: "13px",
              lineHeight: 1.7,
            }}
          >
            Costul și termenul estimativ de livrare sunt afișate
            în checkout înainte de finalizarea comenzii. Informațiile
            de mai jos descriu regulile generale aplicabile.
          </div>

          <DeliverySection number="1" title="Zona de livrare">
            <p>
              Garagio livrează comenzile la adresa indicată de client
              în procesul de checkout, în localitățile în care serviciile
              de curierat utilizate sunt disponibile.
            </p>

            <p>
              Clientul este responsabil pentru introducerea corectă a
              numelui, numărului de telefon și adresei de livrare.
            </p>
          </DeliverySection>

          <DeliverySection number="2" title="Costul livrării">
            <p>
              Costul de transport este afișat în coș și în checkout,
              înainte de plasarea comenzii.
            </p>

            <p>
              În prezent, pentru comenzile sub pragul de transport
              gratuit, platforma poate aplica un cost standard de
              livrare de <strong>19,90 lei</strong>.
            </p>

            <p>
              Pentru comenzile cu o valoare de cel puțin{" "}
              <strong>300 lei</strong>, Garagio poate oferi livrare
              gratuită, dacă această opțiune este afișată în coș la
              momentul plasării comenzii.
            </p>

            <p>
              Garagio își rezervă dreptul de a modifica tarifele și
              pragurile de transport, însă clientului i se aplică
              exclusiv costul afișat și acceptat la plasarea comenzii.
            </p>
          </DeliverySection>

          <DeliverySection number="3" title="Termenul de livrare">
            <p>
              Termenul de livrare depinde de disponibilitatea produselor,
              furnizor, localitatea de destinație și serviciul de curierat.
            </p>

            <p>
              Termenele afișate în catalog sau comunicate clientului sunt
              estimative. Dacă pentru o comandă este necesară aprovizionarea
              de la un furnizor extern, termenul poate fi mai mare decât în
              cazul produselor disponibile imediat.
            </p>

            <p>
              Dacă apare o întârziere semnificativă, Garagio poate contacta
              clientul folosind datele furnizate în comandă.
            </p>
          </DeliverySection>

          <DeliverySection number="4" title="Comenzi cu mai multe produse">
            <p>
              Dacă produsele din aceeași comandă provin din surse sau
              depozite diferite, livrarea poate necesita un timp
              suplimentar de consolidare.
            </p>

            <p>
              În anumite situații, produsele pot fi expediate separat,
              dacă acest lucru este necesar pentru procesarea eficientă
              a comenzii. Clientul va fi informat atunci când o astfel
              de situație afectează livrarea.
            </p>
          </DeliverySection>

          <DeliverySection number="5" title="Confirmarea și expedierea">
            <p>
              După plasarea comenzii, clientul primește o confirmare cu
              numărul comenzii. Acest mesaj confirmă înregistrarea
              comenzii în sistem.
            </p>

            <p>
              Pe măsură ce comanda este procesată, statusul acesteia
              poate fi actualizat în contul Garagio și pot fi transmise
              notificări prin email.
            </p>

            <p>
              După integrarea completă cu serviciul de curierat, Garagio
              va putea comunica și numărul AWB sau linkul de urmărire
              atunci când acestea sunt disponibile.
            </p>
          </DeliverySection>

          <DeliverySection number="6" title="Recepția coletului">
            <p>
              La primirea coletului, clientul este încurajat să verifice
              starea exterioară a ambalajului.
            </p>

            <p>
              Dacă ambalajul prezintă deteriorări evidente, clientul poate
              solicita curierului consemnarea situației, în măsura în care
              procedura curierului permite acest lucru.
            </p>

            <p>
              Orice problemă legată de lipsa unui produs, deteriorare sau
              neconcordanță trebuie comunicată Garagio cât mai repede,
              pentru a putea fi verificată și soluționată.
            </p>
          </DeliverySection>

          <DeliverySection number="7" title="Livrare nereușită">
            <p>
              Dacă livrarea nu poate fi efectuată din cauza unei adrese
              incorecte, a imposibilității de contactare a destinatarului
              sau a refuzului nejustificat de primire, coletul poate fi
              returnat către expeditor.
            </p>

            <p>
              Pentru o eventuală retrimitere, Garagio poate solicita
              confirmarea datelor de livrare și, după caz, achitarea
              costurilor suplimentare generate de o nouă expediere.
            </p>
          </DeliverySection>

          <DeliverySection
            number="8"
            title="Situații independente de Garagio"
          >
            <p>
              Întârzieri pot apărea din motive independente de Garagio,
              inclusiv condiții meteo severe, perioade aglomerate,
              indisponibilități logistice, probleme ale curierului,
              restricții de circulație sau alte evenimente externe.
            </p>

            <p>
              În astfel de situații vom încerca să comunicăm informațiile
              disponibile și să facilităm soluționarea livrării.
            </p>
          </DeliverySection>

          <DeliverySection number="9" title="Modificarea adresei">
            <p>
              Dacă dorești modificarea adresei după plasarea comenzii,
              contactează Garagio cât mai repede.
            </p>

            <p>
              După predarea coletului către curier, modificarea adresei
              poate depinde de politica și posibilitățile tehnice ale
              companiei de curierat.
            </p>
          </DeliverySection>

          <DeliverySection number="10" title="Contact pentru livrare">
            <p>
              Pentru întrebări despre livrarea unei comenzi, ne poți
              contacta folosind numărul comenzii și datele de mai jos.
            </p>

            <div style={infoBoxStyle}>
              <strong>{company.brand}</strong>

              <a href={`mailto:${company.email}`}>
                {company.email}
              </a>

              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                {company.phone}
              </a>
            </div>
          </DeliverySection>

          <div
            style={{
              marginTop: "42px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Link href="/termeni" style={secondaryButtonStyle}>
              Termeni și condiții
            </Link>

            <Link href="/retur" style={primaryButtonStyle}>
              Politica de retur →
            </Link>
          </div>

          <div
            style={{
              marginTop: "32px",
              padding: "18px",
              borderRadius: "12px",
              background: "#f8fafc",
              color: "#64748b",
              fontSize: "12px",
              lineHeight: 1.6,
            }}
          >
            Ultima actualizare: septembrie 2026.
          </div>
        </div>
      </section>
    </main>
  );
}

function DeliverySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: "30px 0",
        borderTop: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            flex: "0 0 auto",
            width: "32px",
            height: "32px",
            display: "grid",
            placeItems: "center",
            borderRadius: "9px",
            background: "#fff7ed",
            color: "#ff6a00",
            fontSize: "11px",
            fontWeight: 900,
          }}
        >
          {number}
        </span>

        <div
          style={{
            minWidth: 0,
            width: "100%",
          }}
        >
          <h2
            style={{
              margin: "3px 0 15px",
              fontSize: "21px",
            }}
          >
            {title}
          </h2>

          <div
            style={{
              color: "#475569",
              fontSize: "14px",
              lineHeight: 1.75,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

const infoBoxStyle: React.CSSProperties = {
  display: "grid",
  gap: "6px",
  margin: "18px 0",
  padding: "18px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  background: "#f8fafc",
  color: "#475569",
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
