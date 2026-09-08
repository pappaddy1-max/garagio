import Image from "next/image";
import Link from "next/link";

import { company } from "../data/company";

export default function ReturnPage() {
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
            DREPTURILE CLIENTULUI
          </span>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(40px, 5vw, 62px)",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Retur și anulare
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
            Condițiile generale privind retragerea din contract,
            returnarea produselor și rambursarea sumelor achitate.
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
            Pentru comenzile la distanță, consumatorii beneficiază,
            în condițiile legii, de dreptul de retragere în termen de
            14 zile, fără a fi necesară justificarea deciziei.
          </div>

          <ReturnSection number="1" title="Dreptul de retragere">
            <p>
              Dacă achiziția este efectuată de un consumator în cadrul
              unui contract la distanță, acesta are dreptul de a se
              retrage din contract, în condițiile legislației aplicabile,
              în termen de <strong>14 zile</strong>.
            </p>

            <p>
              Pentru cumpărarea de produse, termenul începe, de regulă,
              din ziua în care consumatorul sau o persoană indicată de
              acesta, alta decât transportatorul, intră în posesia fizică
              a produsului.
            </p>

            <p>
              Dacă o comandă conține mai multe produse livrate separat,
              calcularea termenului se face potrivit regulilor aplicabile
              ultimei livrări relevante.
            </p>
          </ReturnSection>

          <ReturnSection
            number="2"
            title="Cum anunți Garagio că dorești returul"
          >
            <p>
              Pentru exercitarea dreptului de retragere, clientul trebuie
              să transmită Garagio o declarație neechivocă din care să
              rezulte decizia de retragere.
            </p>

            <p>
              Solicitarea poate fi transmisă la:
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

            <p>
              Pentru identificarea rapidă a comenzii, recomandăm ca
              mesajul să includă numărul comenzii, numele clientului,
              produsele vizate și un număr de telefon.
            </p>
          </ReturnSection>

          <ReturnSection number="3" title="Expedierea produsului returnat">
            <p>
              După comunicarea retragerii, produsele trebuie returnate
              fără întârzieri nejustificate, în termenul prevăzut de lege.
            </p>

            <p>
              Adresa exactă și instrucțiunile logistice pentru retur vor
              fi comunicate de Garagio la înregistrarea solicitării, astfel
              încât coletul să poată fi identificat corect.
            </p>

            <p>
              Recomandăm ambalarea corespunzătoare a produsului pentru a
              preveni deteriorarea acestuia în timpul transportului.
            </p>
          </ReturnSection>

          <ReturnSection number="4" title="Costul transportului de retur">
            <p>
              Cu excepția cazului în care Garagio comunică în mod expres
              că suportă costul returului, costurile directe ale trimiterii
              produsului înapoi sunt suportate de consumator, în condițiile
              legii.
            </p>

            <p>
              Dacă returul este determinat de o eroare de livrare
              imputabilă Garagio sau de o neconformitate confirmată,
              situația va fi analizată separat, inclusiv în privința
              costurilor de transport.
            </p>
          </ReturnSection>

          <ReturnSection number="5" title="Starea produselor returnate">
            <p>
              Consumatorul poate examina produsul în măsura necesară
              pentru a-i stabili natura, caracteristicile și
              funcționarea.
            </p>

            <p>
              Clientul poate răspunde pentru diminuarea valorii produsului
              dacă aceasta rezultă din manipulări care depășesc ceea ce
              este necesar pentru o astfel de examinare.
            </p>

            <p>
              Pentru procesarea mai rapidă a returului, recomandăm ca
              produsul să fie trimis, pe cât posibil, împreună cu
              ambalajele, accesoriile, documentația și componentele
              primite.
            </p>
          </ReturnSection>

          <ReturnSection
            number="6"
            title="Piese montate, utilizate sau deteriorate"
          >
            <p>
              În cazul pieselor auto, montarea sau utilizarea poate produce
              urme, uzură, contaminare cu fluide, deteriorarea ambalajului
              ori alte modificări care pot afecta valoarea bunului.
            </p>

            <p>
              O piesă montată nu este exclusă automat de la analizarea
              unui retur doar pentru acest motiv, însă Garagio poate
              verifica dacă produsul a suferit o diminuare de valoare ca
              urmare a unei utilizări care depășește examinarea necesară
              permisă de lege.
            </p>

            <p>
              Defectele sau neconformitățile unui produs sunt tratate
              separat de simpla retragere din contract și beneficiază de
              drepturile legale aplicabile în materie de conformitate și
              garanții.
            </p>
          </ReturnSection>

          <ReturnSection number="7" title="Excepții de la dreptul de retragere">
            <p>
              Dreptul de retragere nu se aplică în cazurile în care
              legislația prevede în mod expres o excepție.
            </p>

            <p>
              De exemplu, dacă Garagio va comercializa în viitor produse
              realizate după specificațiile clientului sau clar
              personalizate, acestea pot intra într-o excepție legală,
              dacă sunt îndeplinite condițiile prevăzute de lege.
            </p>

            <p>
              O eventuală excepție aplicabilă unui produs va fi comunicată
              clientului în mod clar înainte de încheierea contractului,
              atunci când acest lucru este necesar.
            </p>
          </ReturnSection>

          <ReturnSection number="8" title="Rambursarea sumelor">
            <p>
              În cazul unei retrageri valabile, Garagio va rambursa
              sumele datorate consumatorului în termenul prevăzut de lege,
              calculat de la data la care este informat despre decizia de
              retragere.
            </p>

            <p>
              Garagio poate amâna rambursarea până la recepționarea
              produselor returnate sau până la primirea unei dovezi că
              acestea au fost expediate, în condițiile permise de lege.
            </p>

            <p>
              Rambursarea se efectuează, de regulă, prin aceeași metodă de
              plată utilizată pentru tranzacția inițială, cu excepția
              situațiilor în care părțile convin altfel și acest lucru nu
              generează costuri nejustificate pentru consumator.
            </p>
          </ReturnSection>

          <ReturnSection
            number="9"
            title="Costul livrării inițiale"
          >
            <p>
              În cazul retragerii din contract, rambursarea costurilor de
              livrare inițiale se realizează în limitele și condițiile
              prevăzute de legislația aplicabilă.
            </p>

            <p>
              Dacă un client a ales în mod expres o metodă de livrare mai
              scumpă decât livrarea standard oferită de Garagio, diferența
              de cost poate să nu fie rambursabilă, în condițiile legii.
            </p>
          </ReturnSection>

          <ReturnSection number="10" title="Anularea unei comenzi înainte de expediere">
            <p>
              Dacă o comandă nu a fost încă expediată, clientul poate
              solicita anularea acesteia contactând Garagio cât mai
              rapid.
            </p>

            <p>
              Vom încerca să oprim procesarea înainte de predarea
              produselor către curier. Dacă expedierea a avut deja loc,
              solicitarea va fi tratată potrivit procedurii aplicabile
              returului și retragerii.
            </p>
          </ReturnSection>

          <ReturnSection number="11" title="Produse greșite sau deteriorate">
            <p>
              Dacă ai primit un produs diferit de cel comandat sau există
              o deteriorare evidentă, contactează Garagio cât mai repede
              și transmite numărul comenzii și informațiile relevante.
            </p>

            <p>
              Fotografiile ambalajului și ale produsului pot ajuta la
              verificarea rapidă a situației, fără a limita drepturile
              legale ale clientului.
            </p>
          </ReturnSection>

          <ReturnSection number="12" title="Produse neconforme și garanții">
            <p>
              Dreptul de retragere este distinct de drepturile clientului
              în cazul unui produs neconform sau defect.
            </p>

            <p>
              Dacă problema privește conformitatea sau garanția, Garagio
              va analiza solicitarea potrivit legislației aplicabile și
              condițiilor de garanție relevante pentru produs.
            </p>
          </ReturnSection>

          <ReturnSection
            number="13"
            title="Achiziții efectuate de persoane juridice"
          >
            <p>
              Dreptul legal de retragere de 14 zile descris în această
              politică se referă la consumatori, astfel cum sunt definiți
              de legislația aplicabilă.
            </p>

            <p>
              Pentru comenzile efectuate în scop profesional de persoane
              juridice sau alte entități care nu au calitatea de
              consumator, condițiile de anulare sau retur pot fi stabilite
              separat.
            </p>
          </ReturnSection>

          <ReturnSection number="14" title="Contact">
            <p>
              Pentru o solicitare de retur, anulare sau garanție, ne poți
              contacta folosind datele de mai jos.
            </p>

            <div style={infoBoxStyle}>
              <strong>{company.legalName}</strong>
              <span>CUI: {company.cui}</span>

              <a href={`mailto:${company.email}`}>
                {company.email}
              </a>

              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                {company.phone}
              </a>
            </div>
          </ReturnSection>

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

            <Link href="/livrare" style={secondaryButtonStyle}>
              Politica de livrare
            </Link>

            <Link
              href="/confidentialitate"
              style={primaryButtonStyle}
            >
              Confidențialitate →
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

function ReturnSection({
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
