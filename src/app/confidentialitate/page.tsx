import Image from "next/image";
import Link from "next/link";

import { company } from "../data/company";

export default function PrivacyPage() {
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
            DATE CU CARACTER PERSONAL
          </span>

          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "clamp(40px, 5vw, 62px)",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Politica de confidențialitate
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin: 0,
              color: "#cbd5e1",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            Cum colectăm, folosim și protejăm datele personale în
            cadrul platformei Garagio.
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
            Această politică descrie, la nivel general, modul în care
            Garagio prelucrează datele personale necesare funcționării
            conturilor, comenzilor, comunicărilor și serviciilor platformei.
          </div>

          <PrivacySection number="1" title="Operatorul datelor">
            <p>
              Operatorul datelor cu caracter personal este:
            </p>

            <div style={infoBoxStyle}>
              <strong>{company.legalName}</strong>
              <span>CUI: {company.cui}</span>
              <span>
                Nr. Registrul Comerțului:{" "}
                {company.registrationNumber}
              </span>
              <span>{company.address}</span>
              <a href={`mailto:${company.email}`}>
                {company.email}
              </a>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                {company.phone}
              </a>
            </div>
          </PrivacySection>

          <PrivacySection number="2" title="Ce date putem colecta">
            <p>
              În funcție de modul în care folosești Garagio, putem
              prelucra următoarele categorii de date:
            </p>

            <ul style={listStyle}>
              <li>nume și prenume;</li>
              <li>adresă de email;</li>
              <li>număr de telefon;</li>
              <li>adresă de livrare și date de facturare;</li>
              <li>date despre companie, dacă plasezi o comandă pe firmă;</li>
              <li>
                informații despre vehicul, precum marcă, model,
                motorizare, an, kilometraj și VIN;
              </li>
              <li>istoricul comenzilor și al statusurilor acestora;</li>
              <li>
                informații introduse în „Garajul meu”, inclusiv
                revizii și mentenanță;
              </li>
              <li>
                informații tehnice privind utilizarea website-ului,
                în măsura în care acestea sunt colectate de infrastructura
                tehnică folosită;
              </li>
              <li>
                conținutul mesajelor transmise către Garagio prin email
                sau alte canale de suport.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection number="3" title="Scopurile prelucrării">
            <p>
              Datele pot fi utilizate pentru:
            </p>

            <ul style={listStyle}>
              <li>crearea și administrarea contului Garagio;</li>
              <li>funcționarea secțiunii „Garajul meu”;</li>
              <li>identificarea pieselor potrivite pentru vehicul;</li>
              <li>procesarea și administrarea comenzilor;</li>
              <li>livrare, facturare și comunicarea cu clientul;</li>
              <li>
                transmiterea emailurilor tranzacționale privind comenzile;
              </li>
              <li>gestionarea retururilor, reclamațiilor și garanțiilor;</li>
              <li>prevenirea fraudelor și securitatea platformei;</li>
              <li>îndeplinirea obligațiilor legale și fiscale;</li>
              <li>
                îmbunătățirea funcționalității și experienței de utilizare.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection number="4" title="Temeiurile juridice">
            <p>
              Prelucrarea datelor se poate baza, după caz, pe:
            </p>

            <ul style={listStyle}>
              <li>
                executarea unui contract sau efectuarea de demersuri
                înainte de încheierea acestuia;
              </li>
              <li>îndeplinirea unei obligații legale;</li>
              <li>
                interesul legitim al Garagio, atunci când acesta nu
                prevalează asupra drepturilor persoanei vizate;
              </li>
              <li>
                consimțământul, acolo unde legislația sau natura
                activității impune acest temei.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection number="5" title="Contul Garagio">
            <p>
              Pentru utilizatorii autentificați, Garagio poate păstra
              datele de profil, vehiculele salvate, istoricul comenzilor
              și alte informații asociate contului.
            </p>

            <p>
              Autentificarea este realizată prin infrastructură tehnică
              dedicată, iar Garagio nu afișează și nu stochează parola
              utilizatorului în format lizibil.
            </p>
          </PrivacySection>

          <PrivacySection number="6" title="Garajul meu">
            <p>
              Funcția „Garajul meu” poate conține informații despre
              vehicule și întreținerea acestora, inclusiv VIN, kilometraj,
              revizii și operațiuni de mentenanță.
            </p>

            <p>
              Aceste date sunt utilizate pentru personalizarea experienței,
              afișarea istoricului și, unde este posibil, recomandarea
              produselor compatibile.
            </p>
          </PrivacySection>

          <PrivacySection number="7" title="Comenzi și livrare">
            <p>
              Pentru procesarea unei comenzi sunt necesare datele de
              identificare și contact, adresa de livrare, produsele
              comandate și informațiile necesare facturării.
            </p>

            <p>
              Datele strict necesare livrării pot fi comunicate
              companiei de curierat sau altor furnizori implicați în
              executarea comenzii.
            </p>
          </PrivacySection>

          <PrivacySection number="8" title="Plăți">
            <p>
              La activarea plății online, procesarea datelor de card va
              fi realizată prin procesatorul de plăți utilizat de Garagio.
            </p>

            <p>
              Garagio nu intenționează să stocheze în propriile baze de
              date numărul complet al cardului, codul CVV sau alte date
              sensibile ale cardului care sunt gestionate direct de
              procesatorul de plăți.
            </p>
          </PrivacySection>

          <PrivacySection number="9" title="Emailuri tranzacționale">
            <p>
              Garagio poate trimite emailuri necesare executării
              serviciului, cum ar fi confirmarea comenzii, modificarea
              statusului, expedierea sau alte informații legate direct
              de comandă.
            </p>

            <p>
              Aceste mesaje sunt diferite de comunicările comerciale
              opționale sau newslettere.
            </p>
          </PrivacySection>

          <PrivacySection number="10" title="Furnizori tehnici">
            <p>
              Pentru funcționarea platformei, Garagio utilizează sau poate
              utiliza furnizori tehnici care prelucrează date în numele
              nostru sau în cadrul propriilor responsabilități.
            </p>

            <p>
              În prezent, infrastructura tehnică include servicii precum:
            </p>

            <ul style={listStyle}>
              <li>
                <strong>Supabase</strong> — autentificare și bază de date;
              </li>
              <li>
                <strong>Vercel</strong> — găzduirea și livrarea aplicației
                web;
              </li>
              <li>
                <strong>Resend</strong> — transmiterea emailurilor
                tranzacționale;
              </li>
              <li>
                furnizori de curierat, după integrarea logistică;
              </li>
              <li>
                procesator de plăți, după activarea plății online.
              </li>
            </ul>

            <p>
              Lista furnizorilor tehnici se poate modifica pe măsură ce
              platforma evoluează.
            </p>
          </PrivacySection>

          <PrivacySection number="11" title="Transferuri de date">
            <p>
              Unii furnizori tehnici pot utiliza infrastructură situată
              în mai multe jurisdicții.
            </p>

            <p>
              Atunci când este necesar un transfer internațional de date,
              acesta trebuie realizat folosind mecanismele permise de
              legislația aplicabilă privind protecția datelor.
            </p>
          </PrivacySection>

          <PrivacySection number="12" title="Perioada de stocare">
            <p>
              Datele sunt păstrate doar atât timp cât sunt necesare
              scopurilor pentru care au fost colectate sau cât timp
              legislația impune păstrarea acestora.
            </p>

            <p>
              De exemplu, documentele și informațiile aferente
              tranzacțiilor pot fi păstrate pe perioadele necesare pentru
              obligații fiscale, contabile, garanții, reclamații și
              apărarea drepturilor legale.
            </p>
          </PrivacySection>

          <PrivacySection number="13" title="Securitatea datelor">
            <p>
              Garagio aplică măsuri tehnice și organizatorice rezonabile
              pentru protejarea datelor împotriva accesului neautorizat,
              pierderii, modificării sau divulgării nepermise.
            </p>

            <p>
              Website-ul este disponibil prin conexiune HTTPS, iar cheile
              și credențialele tehnice sensibile sunt păstrate în zona
              server-side și nu sunt intenționat expuse în interfața
              publică.
            </p>
          </PrivacySection>

          <PrivacySection number="14" title="Drepturile persoanei vizate">
            <p>
              În condițiile prevăzute de legislația privind protecția
              datelor, poți beneficia, după caz, de:
            </p>

            <ul style={listStyle}>
              <li>dreptul de acces;</li>
              <li>dreptul la rectificarea datelor;</li>
              <li>dreptul la ștergere;</li>
              <li>dreptul la restricționarea prelucrării;</li>
              <li>dreptul la portabilitatea datelor;</li>
              <li>dreptul la opoziție;</li>
              <li>
                dreptul de retragere a consimțământului, atunci când
                prelucrarea se bazează pe consimțământ;
              </li>
              <li>
                dreptul de a depune o plângere la autoritatea competentă
                pentru protecția datelor.
              </li>
            </ul>
          </PrivacySection>

          <PrivacySection number="15" title="Solicitări GDPR">
            <p>
              Pentru exercitarea drepturilor sau pentru întrebări privind
              modul în care sunt utilizate datele, ne poți contacta la:
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
              Pentru protejarea datelor, Garagio poate solicita informații
              suplimentare necesare verificării identității persoanei care
              formulează cererea.
            </p>
          </PrivacySection>

          <PrivacySection number="16" title="Cookie-uri și tehnologii similare">
            <p>
              Website-ul poate utiliza cookie-uri sau tehnologii similare
              strict necesare funcționării, securității și autentificării.
            </p>

            <p>
              Dacă vor fi introduse cookie-uri de analiză, marketing sau
              alte tehnologii care necesită consimțământ, Garagio va
              afișa mecanismele de informare și alegere necesare înainte
              de utilizarea acestora, acolo unde legea o cere.
            </p>
          </PrivacySection>

          <PrivacySection number="17" title="Date despre minori">
            <p>
              Garagio nu este conceput în mod specific ca serviciu
              destinat minorilor.
            </p>

            <p>
              Dacă avem motive să credem că datele unui minor au fost
              furnizate în mod necorespunzător, situația poate fi
              analizată și datele pot fi eliminate sau restricționate
              potrivit obligațiilor legale aplicabile.
            </p>
          </PrivacySection>

          <PrivacySection number="18" title="Modificarea politicii">
            <p>
              Această politică poate fi actualizată pentru a reflecta
              schimbări legislative, tehnice sau operaționale.
            </p>

            <p>
              Versiunea actualizată va fi publicată pe website, împreună
              cu data ultimei modificări.
            </p>
          </PrivacySection>

          <PrivacySection number="19" title="Contact">
            <p>
              Pentru întrebări privind confidențialitatea sau protecția
              datelor:
            </p>

            <div style={infoBoxStyle}>
              <strong>{company.legalName}</strong>
              <span>{company.address}</span>
              <a href={`mailto:${company.email}`}>
                {company.email}
              </a>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`}>
                {company.phone}
              </a>
            </div>
          </PrivacySection>

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

            <Link href="/retur" style={secondaryButtonStyle}>
              Retur și anulare
            </Link>

            <Link href="/contact" style={primaryButtonStyle}>
              Contact →
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

function PrivacySection({
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

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: "7px",
  paddingLeft: "22px",
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
