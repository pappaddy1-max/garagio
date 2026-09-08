import Image from "next/image";
import Link from "next/link";

import { company } from "../data/company";

export default function TermsPage() {
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
            INFORMAȚII LEGALE
          </span>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(40px, 5vw, 62px)",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Termeni și condiții
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
            Condițiile de utilizare a platformei Garagio și de
            achiziționare a produselor comercializate prin aceasta.
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
          <LegalIntro />

          <LegalSection number="1" title="Operatorul platformei">
            <p>
              Platforma online Garagio, disponibilă la{" "}
              <strong>{company.website}</strong>, este operată de:
            </p>

            <div style={infoBoxStyle}>
              <strong>{company.legalName}</strong>
              <span>CUI: {company.cui}</span>
              <span>
                Nr. Registrul Comerțului:{" "}
                {company.registrationNumber}
              </span>
              <span>Sediu profesional: {company.address}</span>
              <span>Telefon: {company.phone}</span>
              <span>Email: {company.email}</span>
            </div>

            <p>
              În cuprinsul prezentului document, operatorul este denumit
              „Garagio”, „noi”, „operatorul” sau „vânzătorul”, după
              context.
            </p>
          </LegalSection>

          <LegalSection number="2" title="Aplicabilitate">
            <p>
              Prezenții Termeni și condiții se aplică utilizării
              website-ului Garagio, creării și utilizării unui cont,
              folosirii funcției „Garajul meu”, plasării comenzilor și
              relației comerciale dintre Garagio și clienți.
            </p>

            <p>
              Prin utilizarea website-ului și, după caz, prin bifarea
              căsuței de acceptare înainte de finalizarea unei comenzi,
              clientul confirmă că a citit și acceptă acești Termeni și
              condiții.
            </p>
          </LegalSection>

          <LegalSection number="3" title="Produse și informații">
            <p>
              Garagio comercializează piese, accesorii și consumabile
              auto. Pentru fiecare produs pot fi afișate denumirea,
              producătorul, codul produsului, categoria, prețul,
              disponibilitatea și termenul estimativ de livrare.
            </p>

            <p>
              Imaginile, denumirile comerciale și descrierile au rol de
              prezentare. Pot exista diferențe neesențiale de ambalaj,
              etichetare sau aspect determinate de producător, fără ca
              acestea să afecteze caracteristicile tehnice ale
              produsului.
            </p>
          </LegalSection>

          <LegalSection
            number="4"
            title="Compatibilitatea pieselor cu vehiculul"
          >
            <p>
              Garagio poate utiliza informații precum marca, modelul,
              anul, motorizarea, puterea, seria VIN sau alte date ale
              vehiculului pentru a facilita identificarea produselor
              compatibile.
            </p>

            <p>
              Clientul este responsabil pentru corectitudinea datelor
              introduse despre vehicul. În situațiile în care
              compatibilitatea nu poate fi stabilită cu certitudine,
              Garagio poate solicita informații suplimentare înainte de
              confirmarea sau expedierea comenzii.
            </p>

            <p>
              Recomandările automate nu înlocuiesc verificările tehnice
              necesare atunci când există variante diferite pentru
              același model sau aceeași motorizare.
            </p>
          </LegalSection>

          <LegalSection number="5" title="Prețuri">
            <p>
              Prețurile sunt afișate în lei (RON) și reprezintă prețul
              de vânzare aplicabil la momentul plasării comenzii.
              Eventualele costuri de livrare sunt afișate separat
              înainte de finalizarea comenzii.
            </p>

            <p>
              În cazul unei erori evidente de afișare sau de preț,
              Garagio poate contacta clientul pentru clarificare înainte
              de confirmarea comenzii. O eroare tehnică evidentă nu
              obligă vânzătorul să livreze produsul la un preț vădit
              eronat.
            </p>
          </LegalSection>

          <LegalSection number="6" title="Plasarea și confirmarea comenzii">
            <p>
              O comandă poate fi plasată atât de un utilizator
              autentificat, cât și, dacă această opțiune este
              disponibilă în checkout, fără cont.
            </p>

            <p>
              După transmiterea comenzii, clientul primește un număr de
              comandă și, în mod normal, o confirmare automată prin
              email. Mesajul automat confirmă înregistrarea comenzii în
              sistem.
            </p>

            <p>
              Garagio poate verifica disponibilitatea, compatibilitatea,
              datele de contact sau alte elemente necesare înainte de
              procesarea finală a comenzii.
            </p>
          </LegalSection>

          <LegalSection number="7" title="Modalități de plată">
            <p>
              Modalitățile de plată efectiv disponibile sunt afișate în
              pagina de checkout. Acestea pot include:
            </p>

            <ul style={listStyle}>
              <li>plata ramburs la livrare;</li>
              <li>
                plata online cu cardul, după activarea procesatorului de
                plăți;
              </li>
              <li>
                alte modalități de plată comunicate clar în checkout.
              </li>
            </ul>

            <p>
              Pentru plata online cu cardul, datele cardului vor fi
              procesate de furnizorul de servicii de plată, nu de
              Garagio, în conformitate cu infrastructura și regulile
              procesatorului utilizat.
            </p>
          </LegalSection>

          <LegalSection number="8" title="Livrare">
            <p>
              Produsele sunt livrate la adresa indicată de client.
              Costul și termenul estimativ de livrare sunt afișate sau
              comunicate înainte de finalizarea procesării comenzii.
            </p>

            <p>
              Termenele afișate sunt estimative și pot varia în funcție
              de stoc, furnizor, curier, localitatea de livrare,
              perioade aglomerate sau situații independente de Garagio.
            </p>

            <p>
              Informații detaliate sunt disponibile în{" "}
              <Link href="/livrare" style={inlineLinkStyle}>
                Politica de livrare
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection number="9" title="Retur și anulare">
            <p>
              Consumatorii beneficiază de drepturile de retragere și
              retur aplicabile contractelor la distanță, în condițiile
              prevăzute de legislația aplicabilă și de politica Garagio.
            </p>

            <p>
              Produsele trebuie returnate în condiții care permit
              verificarea lor, fără deteriorări produse prin manipulări
              care depășesc ceea ce este necesar pentru stabilirea
              naturii și caracteristicilor produsului.
            </p>

            <p>
              Pot exista situații în care dreptul de retragere nu se
              aplică, dacă legea prevede o excepție pentru categoria sau
              situația respectivă.
            </p>

            <p>
              Condițiile complete sunt prezentate în{" "}
              <Link href="/retur" style={inlineLinkStyle}>
                Politica de retur și anulare
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection number="10" title="Garanții și reclamații">
            <p>
              Produsele beneficiază de garanțiile legale și, acolo unde
              este cazul, de garanțiile comerciale oferite de
              producător sau distribuitor.
            </p>

            <p>
              Pentru sesizări referitoare la produse, comenzi, livrare
              sau garanții, clientul poate contacta Garagio la{" "}
              <a
                href={`mailto:${company.email}`}
                style={inlineLinkStyle}
              >
                {company.email}
              </a>{" "}
              sau la {company.phone}.
            </p>
          </LegalSection>

          <LegalSection number="11" title="Contul Garagio și Garajul meu">
            <p>
              Funcțiile de cont și „Garajul meu” permit salvarea unor
              informații precum vehicule, kilometraj, istoric de
              mentenanță și comenzi.
            </p>

            <p>
              Utilizatorul este responsabil pentru păstrarea
              confidențialității datelor de autentificare și pentru
              corectitudinea informațiilor introduse în cont.
            </p>
          </LegalSection>

          <LegalSection
            number="12"
            title="Date cu caracter personal"
          >
            <p>
              Datele personale sunt prelucrate pentru administrarea
              conturilor, procesarea comenzilor, comunicarea cu
              clienții, livrare, facturare, securitate și îndeplinirea
              obligațiilor legale.
            </p>

            <p>
              Detalii despre categoriile de date, scopurile și
              drepturile persoanelor vizate vor fi prezentate în{" "}
              <Link
                href="/confidentialitate"
                style={inlineLinkStyle}
              >
                Politica de confidențialitate
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection number="13" title="Proprietate intelectuală">
            <p>
              Conținutul original Garagio, inclusiv elemente grafice,
              structură, texte, denumiri și elemente de identitate
              vizuală, este protejat conform legislației aplicabile.
            </p>

            <p>
              Mărcile, siglele și denumirile producătorilor sau ale
              terților aparțin titularilor lor și sunt utilizate pentru
              identificarea produselor și serviciilor.
            </p>
          </LegalSection>

          <LegalSection number="14" title="Limitarea răspunderii">
            <p>
              Garagio depune eforturi pentru menținerea corectitudinii
              informațiilor și funcționarea continuă a platformei, însă
              nu poate garanta lipsa totală a întreruperilor,
              indisponibilităților tehnice sau erorilor provenite din
              servicii furnizate de terți.
            </p>

            <p>
              Garagio nu răspunde pentru probleme generate de
              introducerea unor date greșite de către client, montarea
              necorespunzătoare a pieselor, utilizarea contrară
              indicațiilor producătorului sau intervenții tehnice
              efectuate necorespunzător.
            </p>
          </LegalSection>

          <LegalSection number="15" title="Forță majoră">
            <p>
              Nicio parte nu va fi răspunzătoare pentru neexecutarea
              obligațiilor atunci când aceasta este cauzată de un
              eveniment de forță majoră sau de o situație externă care
              nu putea fi prevăzută ori evitată în mod rezonabil, în
              condițiile legii.
            </p>
          </LegalSection>

          <LegalSection number="16" title="Soluționarea reclamațiilor">
            <p>
              Înainte de inițierea unui demers formal, clienții sunt
              încurajați să contacteze Garagio pentru soluționarea
              directă a oricărei probleme.
            </p>

            <p>
              Consumatorii pot consulta și informațiile publicate de
              Autoritatea Națională pentru Protecția Consumatorilor
              (ANPC), inclusiv mecanismele disponibile pentru
              soluționarea alternativă a litigiilor.
            </p>

            <a
              href="https://anpc.ro/"
              target="_blank"
              rel="noreferrer"
              style={externalButtonStyle}
            >
              Accesează ANPC →
            </a>
          </LegalSection>

          <LegalSection number="17" title="Modificarea termenilor">
            <p>
              Garagio poate actualiza prezentul document atunci când
              apar modificări legislative, operaționale, tehnice sau
              comerciale. Versiunea aplicabilă este cea publicată pe
              website la momentul utilizării sau plasării comenzii.
            </p>
          </LegalSection>

          <LegalSection number="18" title="Contact">
            <p>
              Pentru orice întrebare privind acești Termeni și condiții
              ne poți contacta folosind datele de mai jos.
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
          </LegalSection>

          <div
            style={{
              marginTop: "42px",
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

function LegalIntro() {
  return (
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
      Acest document stabilește regulile generale de utilizare a
      platformei Garagio și de plasare a comenzilor. Politicile
      specifice privind livrarea, returul și confidențialitatea fac
      parte din cadrul contractual aplicabil.
    </div>
  );
}

function LegalSection({
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

        <div style={{ minWidth: 0, width: "100%" }}>
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

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: "7px",
  paddingLeft: "22px",
};

const inlineLinkStyle: React.CSSProperties = {
  color: "#ff6a00",
  fontWeight: 800,
  textDecoration: "none",
};

const externalButtonStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: "8px",
  padding: "12px 16px",
  background: "#0f172a",
  color: "white",
  borderRadius: "9px",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: 800,
};
