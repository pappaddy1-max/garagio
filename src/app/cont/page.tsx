"use client";

import Image from "next/image";
import Link from "next/link";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  createClient,
} from "../../lib/supabase/client";

type AuthMode =
  | "login"
  | "register";

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  password: string;
  confirmPassword: string;
};

type SavedProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type OrderItem = { id: string; product_name: string; product_brand: string | null; product_code: string | null; quantity: number; unit_price: number | string; line_total: number | string; };
type Order = { id: string; order_number: string; status: string; payment_method: string; payment_status: string; subtotal: number | string; shipping: number | string; total: number | string; created_at: string; order_items: OrderItem[]; };

export default function AccountPage() {
  const router = useRouter();

  const supabase =
    createClient();

  const [mode, setMode] =
    useState<AuthMode>("login");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [userId, setUserId] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [form, setForm] =
    useState<ProfileForm>({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",

      password: "",
      confirmPassword: "",
    });

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);

      try {
        const {
          data,
          error:
            userError,
        } =
          await supabase.auth.getUser();

        if (
          userError ||
          !data.user
        ) {
          setIsLoggedIn(false);
          setUserId("");
          setIsLoading(false);

          return;
        }

        const user =
          data.user;

        setIsLoggedIn(true);

        setUserId(
          user.id
        );

        setOrdersLoading(true);
        setOrdersError("");
        const { data: ordersData, error: ordersLoadError } = await supabase
          .from("orders")
          .select(`id, order_number, status, payment_method, payment_status, subtotal, shipping, total, created_at, order_items ( id, product_name, product_brand, product_code, quantity, unit_price, line_total )`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (ordersLoadError) {
          console.error("Eroare comenzi:", ordersLoadError);
          setOrdersError("Comenzile nu au putut fi încărcate.");
        } else {
          setOrders((ordersData || []) as Order[]);
        }
        setOrdersLoading(false);

        const {
          data:
            profileData,
          error:
            profileError,
        } =
          await supabase
            .from(
              "profiles"
            )
            .select(
              "first_name, last_name, phone"
            )
            .eq(
              "id",
              user.id
            )
            .maybeSingle();

        if (
          profileError
        ) {
          console.error(
            "Eroare profil:",
            profileError
          );
        }

        const firstName =
          profileData
            ?.first_name ||
          user
            .user_metadata
            ?.first_name ||
          "";

        const lastName =
          profileData
            ?.last_name ||
          user
            .user_metadata
            ?.last_name ||
          "";

        const phone =
          profileData
            ?.phone ||
          user
            .user_metadata
            ?.phone ||
          "";

        const email =
          user.email ||
          "";

        setForm({
          firstName,
          lastName,
          email,
          phone,

          password: "",
          confirmPassword:
            "",
        });

        /*
         * TEMPORAR:
         * Garajul actual încă citește
         * garagio-profile din localStorage.
         *
         * După migrarea Garajului în
         * Supabase eliminăm această parte.
         */
        const localProfile:
          SavedProfile = {
          firstName,
          lastName,
          email,
          phone,
        };

        window.localStorage.setItem(
          "garagio-profile",
          JSON.stringify(
            localProfile
          )
        );
      } catch (
        loadError
      ) {
        console.error(
          "Eroare la încărcarea contului:",
          loadError
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  function updateField(
    field:
      keyof ProfileForm,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

    setError("");
    setMessage("");
  }

  function changeMode(
    nextMode: AuthMode
  ) {
    setMode(
      nextMode
    );

    setError("");
    setMessage("");

    setForm(
      (current) => ({
        ...current,

        firstName:
          nextMode ===
          "login"
            ? ""
            : current.firstName,

        lastName:
          nextMode ===
          "login"
            ? ""
            : current.lastName,

        phone:
          nextMode ===
          "login"
            ? ""
            : current.phone,

        password: "",
        confirmPassword:
          "",
      })
    );
  }

  function validateRegister() {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim()
    ) {
      return "Completează numele și prenumele.";
    }

    if (
      !form.email.trim() ||
      !form.email.includes(
        "@"
      )
    ) {
      return "Completează o adresă de email validă.";
    }

    if (
      !form.phone.trim()
    ) {
      return "Completează numărul de telefon.";
    }

    if (
      form.password.length <
      6
    ) {
      return "Parola trebuie să aibă minimum 6 caractere.";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      return "Parolele nu coincid.";
    }

    return "";
  }

  function validateLogin() {
    if (
      !form.email.trim() ||
      !form.email.includes(
        "@"
      )
    ) {
      return "Completează adresa de email.";
    }

    if (
      !form.password
    ) {
      return "Completează parola.";
    }

    return "";
  }

  async function createAccount(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError =
      validateRegister();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const {
        data,
        error:
          signUpError,
      } =
        await supabase.auth.signUp(
          {
            email:
              form.email
                .trim()
                .toLowerCase(),

            password:
              form.password,

            options: {
              data: {
                first_name:
                  form.firstName.trim(),

                last_name:
                  form.lastName.trim(),

                phone:
                  form.phone.trim(),
              },
            },
          }
        );

      if (
        signUpError
      ) {
        setError(
          signUpError.message
        );

        return;
      }

      if (
        !data.user
      ) {
        setError(
          "Contul nu a putut fi creat."
        );

        return;
      }

      /*
       * Dacă Supabase are confirmarea
       * emailului activată, user-ul este
       * creat dar nu există încă sesiune.
       */
      if (
        !data.session
      ) {
        setMessage(
          "Cont creat. Verifică emailul și confirmă adresa, apoi revino aici și autentifică-te."
        );

        setMode(
          "login"
        );

        setForm(
          (current) => ({
            ...current,

            password: "",
            confirmPassword:
              "",
          })
        );

        return;
      }

      /*
       * Dacă avem sesiune imediat,
       * completăm profilul.
       */
      const {
        error:
          profileError,
      } =
        await supabase
          .from(
            "profiles"
          )
          .upsert(
            {
              id:
                data.user.id,

              first_name:
                form.firstName.trim(),

              last_name:
                form.lastName.trim(),

              phone:
                form.phone.trim(),

              updated_at:
                new Date().toISOString(),
            },
            {
              onConflict:
                "id",
            }
          );

      if (
        profileError
      ) {
        console.error(
          "Eroare salvare profil:",
          profileError
        );
      }

      const localProfile:
        SavedProfile = {
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        phone:
          form.phone.trim(),
      };

      window.localStorage.setItem(
        "garagio-profile",
        JSON.stringify(
          localProfile
        )
      );

      setIsLoggedIn(true);

      setUserId(
        data.user.id
      );

      router.push(
        "/garaj"
      );

      router.refresh();
    } catch (
      registerError
    ) {
      console.error(
        registerError
      );

      setError(
        "A apărut o eroare la crearea contului."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function login(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError =
      validateLogin();

    if (
      validationError
    ) {
      setError(
        validationError
      );

      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const {
        data,
        error:
          loginError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email:
              form.email
                .trim()
                .toLowerCase(),

            password:
              form.password,
          }
        );

      if (
        loginError
      ) {
        setError(
          loginError.message
        );

        return;
      }

      if (
        !data.user
      ) {
        setError(
          "Autentificarea nu a reușit."
        );

        return;
      }

      const user =
        data.user;

      const {
        data:
          profileData,
        error:
          profileError,
      } =
        await supabase
          .from(
            "profiles"
          )
          .select(
            "first_name, last_name, phone"
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle();

      if (
        profileError
      ) {
        console.error(
          "Eroare profil:",
          profileError
        );
      }

      const firstName =
        profileData
          ?.first_name ||
        user
          .user_metadata
          ?.first_name ||
        "";

      const lastName =
        profileData
          ?.last_name ||
        user
          .user_metadata
          ?.last_name ||
        "";

      const phone =
        profileData
          ?.phone ||
        user
          .user_metadata
          ?.phone ||
        "";

      /*
       * Dacă triggerul a creat profilul
       * gol, sincronizăm metadatele
       * utilizatorului în profiles.
       */
      const {
        error:
          syncError,
      } =
        await supabase
          .from(
            "profiles"
          )
          .upsert(
            {
              id:
                user.id,

              first_name:
                firstName,

              last_name:
                lastName,

              phone,

              updated_at:
                new Date().toISOString(),
            },
            {
              onConflict:
                "id",
            }
          );

      if (
        syncError
      ) {
        console.error(
          "Eroare sincronizare profil:",
          syncError
        );
      }

      const localProfile:
        SavedProfile = {
        firstName,
        lastName,

        email:
          user.email ||
          form.email
            .trim()
            .toLowerCase(),

        phone,
      };

      window.localStorage.setItem(
        "garagio-profile",
        JSON.stringify(
          localProfile
        )
      );

      setIsLoggedIn(true);

      setUserId(
        user.id
      );

      setForm({
        firstName,
        lastName,

        email:
          user.email ||
          form.email,

        phone,

        password: "",
        confirmPassword:
          "",
      });

      router.push(
        "/garaj"
      );

      router.refresh();
    } catch (
      loginException
    ) {
      console.error(
        loginException
      );

      setError(
        "A apărut o eroare la autentificare."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveProfile(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!userId) {
      setError(
        "Nu există un utilizator autentificat."
      );

      return;
    }

    if (
      !form.firstName.trim() ||
      !form.lastName.trim()
    ) {
      setError(
        "Completează numele și prenumele."
      );

      return;
    }

    if (
      !form.phone.trim()
    ) {
      setError(
        "Completează numărul de telefon."
      );

      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const {
        error:
          profileError,
      } =
        await supabase
          .from(
            "profiles"
          )
          .upsert(
            {
              id:
                userId,

              first_name:
                form.firstName.trim(),

              last_name:
                form.lastName.trim(),

              phone:
                form.phone.trim(),

              updated_at:
                new Date().toISOString(),
            },
            {
              onConflict:
                "id",
            }
          );

      if (
        profileError
      ) {
        setError(
          profileError.message
        );

        return;
      }

      /*
       * Sincronizăm și metadata Auth.
       */
      const {
        error:
          metadataError,
      } =
        await supabase.auth.updateUser(
          {
            data: {
              first_name:
                form.firstName.trim(),

              last_name:
                form.lastName.trim(),

              phone:
                form.phone.trim(),
            },
          }
        );

      if (
        metadataError
      ) {
        console.error(
          "Eroare metadata:",
          metadataError
        );
      }

      const localProfile:
        SavedProfile = {
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email,

        phone:
          form.phone.trim(),
      };

      window.localStorage.setItem(
        "garagio-profile",
        JSON.stringify(
          localProfile
        )
      );

      setMessage(
        "Profilul a fost actualizat."
      );
    } catch (
      saveError
    ) {
      console.error(
        saveError
      );

      setError(
        "A apărut o eroare la salvarea profilului."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const {
        error:
          logoutError,
      } =
        await supabase.auth.signOut();

      if (
        logoutError
      ) {
        setError(
          logoutError.message
        );

        return;
      }

      window.localStorage.removeItem(
        "garagio-profile"
      );

      setIsLoggedIn(false);
      setUserId("");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        password: "",
        confirmPassword:
          "",
      });

      setMode(
        "login"
      );

      setMessage(
        "Te-ai delogat."
      );

      router.refresh();
    } catch (
      logoutException
    ) {
      console.error(
        logoutException
      );

      setError(
        "A apărut o eroare la delogare."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatPrice(value: number | string) { return Number(value).toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function formatOrderDate(value: string) { return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
  function statusLabel(status: string) { const labels: Record<string,string> = { new: "Comandă nouă", confirmed: "Confirmată", processing: "În procesare", ordered_from_supplier: "Comandată la furnizor", shipped: "Expediată", completed: "Finalizată", cancelled: "Anulată" }; return labels[status] || status; }
  function paymentLabel(method: string) { return method === "cash" ? "Ramburs" : "Card online"; }

  if (isLoading) {
    return (
      <main className="account-page">
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
        </header>

        <section className="account-content">
          <div className="account-container">
            <div
              className="account-card"
              style={{
                textAlign:
                  "center",
              }}
            >
              Se încarcă
              contul...
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="account-page">
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

          <Link href="/garaj">
            Garajul meu
          </Link>

          <Link href="/cos">
            Coș
          </Link>
        </nav>
      </header>

      <section className="account-header">
        <div className="account-container">
          <span className="eyebrow orange">
            CONT GARAGIO
          </span>

          <h1>
            {isLoggedIn
              ? "Profilul meu"
              : mode ===
                "login"
              ? "Bine ai revenit."
              : "Creează-ți contul."}
          </h1>

          <p>
            {isLoggedIn
              ? "Administrează datele contului tău Garagio."
              : "Contul tău păstrează mașinile, reviziile și comenzile disponibile de pe orice dispozitiv."}
          </p>
        </div>
      </section>

      <section className="account-content">
        <div className="account-container">
          <div className="account-layout">
            {!isLoggedIn ? (
              <form
                className="account-card"
                onSubmit={
                  mode ===
                  "login"
                    ? login
                    : createAccount
                }
              >
                <div className="account-card-header">
                  <h2>
                    {mode ===
                    "login"
                      ? "Autentificare"
                      : "Creează cont"}
                  </h2>

                  <p>
                    {mode ===
                    "login"
                      ? "Intră în contul tău Garagio."
                      : "Creează un cont gratuit Garagio."}
                  </p>
                </div>

                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "8px",
                    marginBottom:
                      "24px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      changeMode(
                        "login"
                      )
                    }
                    style={{
                      border:
                        mode ===
                        "login"
                          ? "1px solid #ff6a00"
                          : "1px solid #e5e7eb",

                      background:
                        mode ===
                        "login"
                          ? "#fff7ed"
                          : "#ffffff",

                      color:
                        mode ===
                        "login"
                          ? "#ff6a00"
                          : "#475569",

                      padding:
                        "12px",

                      borderRadius:
                        "9px",

                      fontWeight:
                        800,
                    }}
                  >
                    Autentificare
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeMode(
                        "register"
                      )
                    }
                    style={{
                      border:
                        mode ===
                        "register"
                          ? "1px solid #ff6a00"
                          : "1px solid #e5e7eb",

                      background:
                        mode ===
                        "register"
                          ? "#fff7ed"
                          : "#ffffff",

                      color:
                        mode ===
                        "register"
                          ? "#ff6a00"
                          : "#475569",

                      padding:
                        "12px",

                      borderRadius:
                        "9px",

                      fontWeight:
                        800,
                    }}
                  >
                    Creează cont
                  </button>
                </div>

                {mode ===
                  "register" && (
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
                        placeholder="Georgian-Adrian"
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

                    <label className="full-field">
                      Telefon *

                      <input
                        type="tel"
                        value={
                          form.phone
                        }
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
                )}

                <div
                  className="checkout-fields"
                  style={{
                    marginTop:
                      mode ===
                      "register"
                        ? "16px"
                        : "0",
                  }}
                >
                  <label>
                    Email *

                    <input
                      type="email"
                      autoComplete="email"
                      value={
                        form.email
                      }
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
                    Parolă *

                    <input
                      type="password"
                      autoComplete={
                        mode ===
                        "login"
                          ? "current-password"
                          : "new-password"
                      }
                      value={
                        form.password
                      }
                      onChange={(e) =>
                        updateField(
                          "password",
                          e.target.value
                        )
                      }
                      placeholder="Minimum 6 caractere"
                    />
                  </label>

                  {mode ===
                    "register" && (
                    <label>
                      Confirmă parola *

                      <input
                        type="password"
                        autoComplete="new-password"
                        value={
                          form.confirmPassword
                        }
                        onChange={(e) =>
                          updateField(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        placeholder="Repetă parola"
                      />
                    </label>
                  )}
                </div>

                {error && (
                  <div className="checkout-error">
                    {error}
                  </div>
                )}

                {message && (
                  <div
                    style={{
                      marginTop:
                        "18px",
                      padding:
                        "13px",

                      borderRadius:
                        "9px",

                      background:
                        "#ecfdf5",

                      color:
                        "#047857",

                      fontSize:
                        "12px",

                      fontWeight:
                        700,

                      lineHeight:
                        1.5,
                    }}
                  >
                    {message}
                  </div>
                )}

                <div className="account-actions">
                  <button
                    className="primary-btn"
                    type="submit"
                    disabled={
                      isSubmitting
                    }
                  >
                    {isSubmitting
                      ? "Se procesează..."
                      : mode ===
                        "login"
                      ? "Intră în cont"
                      : "Creează cont"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                className="account-card"
                onSubmit={
                  saveProfile
                }
              >
                <div className="account-card-header">
                  <h2>
                    Date personale
                  </h2>

                  <p>
                    Profilul este
                    salvat acum în
                    baza de date
                    Garagio.
                  </p>
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
                    />
                  </label>

                  <label>
                    Email

                    <input
                      type="email"
                      value={
                        form.email
                      }
                      readOnly
                      style={{
                        background:
                          "#f8fafc",

                        color:
                          "#64748b",
                      }}
                    />
                  </label>

                  <label>
                    Telefon *

                    <input
                      type="tel"
                      value={
                        form.phone
                      }
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value
                        )
                      }
                    />
                  </label>
                </div>

                {error && (
                  <div className="checkout-error">
                    {error}
                  </div>
                )}

                {message && (
                  <div
                    style={{
                      marginTop:
                        "18px",

                      padding:
                        "13px",

                      borderRadius:
                        "9px",

                      background:
                        "#ecfdf5",

                      color:
                        "#047857",

                      fontSize:
                        "12px",

                      fontWeight:
                        700,
                    }}
                  >
                    {message}
                  </div>
                )}

                <div className="account-actions">
                  <button
                    className="primary-btn"
                    type="submit"
                    disabled={
                      isSubmitting
                    }
                  >
                    {isSubmitting
                      ? "Se salvează..."
                      : "Salvează modificările"}
                  </button>

                  <button
                    className="secondary-action-button"
                    type="button"
                    onClick={
                      logout
                    }
                    disabled={
                      isSubmitting
                    }
                  >
                    Delogare
                  </button>
                </div>
              </form>
            )}

            <aside className="account-benefits">
              <span className="eyebrow orange">
                {isLoggedIn
                  ? "CONT ACTIV"
                  : "DE CE CONT?"}
              </span>

              <h2>
                {isLoggedIn
                  ? `Salut, ${
                      form.firstName ||
                      "șofer"
                    }.`
                  : "Garagio devine al mașinii tale."}
              </h2>

              <div className="account-benefit-list">
                <div>
                  ✓ Salvezi mai
                  multe mașini
                </div>

                <div>
                  ✓ Păstrezi
                  kilometrajul
                </div>

                <div>
                  ✓ Urmărești
                  reviziile
                </div>

                <div>
                  ✓ Primești
                  remindere
                </div>

                <div>
                  ✓ Vezi comenzile
                  anterioare
                </div>
              </div>

              {isLoggedIn ? (
                <Link
                  href="/garaj"
                  className="primary-link-button"
                >
                  Deschide Garajul Meu →
                </Link>
              ) : (
                <p
                  style={{
                    color:
                      "#94a3b8",

                    fontSize:
                      "12px",

                    lineHeight:
                      1.6,
                  }}
                >
                  Creează contul
                  o singură dată,
                  iar ulterior
                  mașinile și
                  istoricul vor fi
                  disponibile de pe
                  orice dispozitiv.
                </p>
              )}
            </aside>
          </div>
        </div>
      </section>

      {isLoggedIn && (
        <section className="account-content" style={{ paddingTop: "0" }}>
          <div className="account-container">
            <div className="account-card" style={{ width: "100%", maxWidth: "none" }}>
              <div className="account-card-header">
                <span className="eyebrow orange">ISTORIC COMENZI</span>
                <h2>Comenzile mele</h2>
                <p>Aici găsești comenzile asociate contului tău Garagio.</p>
              </div>
              {ordersLoading ? (
                <div style={{ padding: "24px 0", color: "#64748b" }}>Se încarcă comenzile...</div>
              ) : ordersError ? (
                <div className="checkout-error">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div style={{ padding: "24px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#f8fafc" }}>
                  <strong>Nu ai încă nicio comandă.</strong>
                  <p style={{ marginTop: "8px", color: "#64748b" }}>După prima comandă, aceasta va apărea aici.</p>
                  <Link href="/piese" className="primary-link-button">Vezi piesele auto →</Link>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                  {orders.map((order) => (
                    <article key={order.id} style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", background: "#fff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                        <div><div style={{ color: "#64748b", fontSize: "12px", fontWeight: 700 }}>COMANDĂ</div><strong style={{ display: "block", marginTop: "4px", fontSize: "18px" }}>{order.order_number}</strong><div style={{ marginTop: "6px", color: "#64748b", fontSize: "13px" }}>{formatOrderDate(order.created_at)}</div></div>
                        <div style={{ textAlign: "right" }}><span style={{ display: "inline-block", padding: "7px 10px", borderRadius: "999px", background: "#fff7ed", color: "#ea580c", fontSize: "12px", fontWeight: 800 }}>{statusLabel(order.status)}</span><strong style={{ display: "block", marginTop: "10px", fontSize: "20px" }}>{formatPrice(order.total)} lei</strong><div style={{ marginTop: "4px", color: "#64748b", fontSize: "12px" }}>{paymentLabel(order.payment_method)}</div></div>
                      </div>
                      <div style={{ display: "grid", gap: "10px", paddingTop: "16px" }}>
                        {order.order_items.map((item) => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center" }}>
                            <div><strong>{item.product_name}</strong><div style={{ marginTop: "3px", color: "#64748b", fontSize: "12px" }}>{item.product_brand || "Garagio"}{item.product_code ? ` · ${item.product_code}` : ""} · {item.quantity} buc.</div></div>
                            <strong style={{ whiteSpace: "nowrap" }}>{formatPrice(item.line_total)} lei</strong>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "24px", flexWrap: "wrap", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #e2e8f0", color: "#64748b", fontSize: "12px" }}>
                        <span>Produse: <strong>{formatPrice(order.subtotal)} lei</strong></span><span>Livrare: <strong>{Number(order.shipping) === 0 ? "Gratuită" : `${formatPrice(order.shipping)} lei`}</strong></span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}