"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { createClient } from "../../lib/supabase/client";

import {
  CartProduct,
  useCart,
} from "../components/CartContext";

type Product = CartProduct & {
  databaseId: string;
};

type GarageVehicle = {
  id: string;
  brand: string;
  model: string;
  year: string;
  engine: string;
  vin: string;
  mileage: number;
  yearlyKm: number;
  lastServiceKm: number;
  lastServiceDate: string;
};

type DatabaseProduct = {
  id: string;
  name: string;
  brand: string | null;
  manufacturer_code: string | null;
  category: string | null;
  selling_price: number | string | null;
};

type AvailabilityItem = {
  productId: string;
  inStock: boolean;
  stockQuantity: number | null;
  deliveryDays: number | null;
  stockLabel: string;
  deliveryLabel: string;
};

type AvailabilityResponse = {
  availability?: AvailabilityItem[];
  error?: string;
};

const fallbackCategories = [
  "Toate",
  "Filtre",
  "Frânare",
  "Uleiuri",
  "Suspensie",
];

const categories = fallbackCategories;

function PartsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cartCount, addToCart } = useCart();

  const supabase = useMemo(() => createClient(), []);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const brand =
    searchParams.get("brand") || "BMW";

  const model =
    searchParams.get("model") || "Seria 3";

  const year =
    searchParams.get("year") || "2018";

  const engine =
    searchParams.get("engine") || "320d 190 CP";

  const urlCategory =
    searchParams.get("category");

  const urlTier =
    searchParams.get("tier");

  const initialCategory =
    urlCategory &&
    categories.includes(urlCategory)
      ? urlCategory
      : "Toate";

  const [category, setCategory] =
    useState(initialCategory);

  const [sort, setSort] =
    useState("recommended");

  const [addedProduct, setAddedProduct] =
    useState<number | null>(null);

  const [savedInGarage, setSavedInGarage] =
    useState(false);

  /*
   * Dacă URL-ul se schimbă fără ca pagina
   * să fie remontată, sincronizăm categoria.
   */
  useEffect(() => {
    if (
      urlCategory &&
      categories.includes(urlCategory)
    ) {
      setCategory(urlCategory);
    } else {
      setCategory("Toate");
    }
  }, [urlCategory]);

  /*
   * Încărcăm produsele publice din Supabase și disponibilitatea
   * din endpoint-ul nostru server-side.
   *
   * Browserul NU primește purchase_price sau alte date private
   * despre furnizori.
   */
  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      setCatalogError("");

      try {
        const [
          productResult,
          availabilityResponse,
        ] = await Promise.all([
          supabase
            .from("products")
            .select(
              "id, name, brand, manufacturer_code, category, selling_price"
            )
            .eq("is_active", true)
            .order("name"),

          fetch("/api/catalog/availability", {
            method: "GET",
            cache: "no-store",
          }),
        ]);

        const {
          data: productRows,
          error: productError,
        } = productResult;

        if (productError) {
          console.error(
            "Eroare catalog:",
            productError
          );

          setCatalogError(
            "Catalogul nu a putut fi încărcat."
          );

          setProducts([]);
          return;
        }

        let availabilityData: AvailabilityResponse = {};

        if (availabilityResponse.ok) {
          availabilityData =
            (await availabilityResponse.json()) as AvailabilityResponse;
        } else {
          console.error(
            "Eroare disponibilitate:",
            await availabilityResponse.text()
          );
        }

        const availabilityMap =
          new Map<string, AvailabilityItem>();

        for (
          const item of
          availabilityData.availability || []
        ) {
          availabilityMap.set(
            item.productId,
            item
          );
        }

        const mapped: Product[] =
          (
            (productRows || []) as DatabaseProduct[]
          ).map(
            (row, index) => {
              const availability =
                availabilityMap.get(
                  row.id
                );

              const stock =
                availability?.stockLabel ||
                "Disponibil la comandă";

              const delivery =
                availability?.deliveryLabel ||
                "Termen confirmat la comandă";

              return {
                id: index + 1,
                databaseId: row.id,

                name: row.name,
                brand:
                  row.brand ||
                  "Garagio",

                category:
                  row.category ||
                  "Altele",

                price:
                  Number(
                    row.selling_price ||
                    0
                  ),

                stock,
                delivery,

                code:
                  row.manufacturer_code ||
                  "—",

                recommended:
                  Boolean(
                    availability?.inStock
                  ) &&
                  index < 2,
              };
            }
          );

        setProducts(mapped);
      } catch (loadError) {
        console.error(
          "Eroare încărcare catalog:",
          loadError
        );

        setCatalogError(
          "Catalogul nu a putut fi încărcat."
        );

        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadProducts();
  }, [supabase]);

  /*
   * Verificăm în Supabase dacă mașina este deja în Garaj.
   */
  useEffect(() => {
    async function checkGarage() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setSavedInGarage(false);
        return;
      }

      const { data, error } = await supabase
        .from("vehicles")
        .select("id")
        .eq("user_id", userData.user.id)
        .eq("brand", brand)
        .eq("model", model)
        .eq("year", year)
        .eq("engine", engine)
        .limit(1);

      if (error) {
        console.error("Nu am putut verifica Garajul:", error);
        setSavedInGarage(false);
        return;
      }

      setSavedInGarage(Boolean(data && data.length > 0));
    }

    checkGarage();
  }, [supabase, brand, model, year, engine]);

  const filteredProducts = useMemo(() => {
    let result =
      category === "Toate"
        ? [...products]
        : products.filter(
            (product) =>
              product.category === category
          );

    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "recommended") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.recommended)) -
          Number(Boolean(a.recommended))
      );
    }

    return result;
  }, [products, category, sort]);

  function handleAddToCart(
    product: Product
  ) {
    addToCart(product);

    setAddedProduct(product.id);

    window.setTimeout(() => {
      setAddedProduct(null);
    }, 900);
  }

  /*
   * Schimbă categoria și actualizează
   * și URL-ul fără să pierdem mașina.
   */
  function handleCategoryChange(
    newCategory: string
  ) {
    setCategory(newCategory);

    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (newCategory === "Toate") {
      params.delete("category");
    } else {
      params.set(
        "category",
        newCategory
      );
    }

    router.replace(
      `/piese?${params.toString()}`,
      {
        scroll: false,
      }
    );
  }

  /*
   * Salvează mașina selectată direct
   * în Garajul Meu.
   *
   * Kilometrajul rămâne 0 momentan.
   * Utilizatorul îl poate completa ulterior.
   */
  async function saveVehicleToGarage() {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        router.push("/cont");
        return;
      }

      const { data: existing, error: existingError } = await supabase
        .from("vehicles")
        .select("id")
        .eq("user_id", userData.user.id)
        .eq("brand", brand)
        .eq("model", model)
        .eq("year", year)
        .eq("engine", engine)
        .limit(1);

      if (existingError) {
        console.error("Nu am putut verifica Garajul:", existingError);
        return;
      }

      if (existing && existing.length > 0) {
        setSavedInGarage(true);
        return;
      }

      const { error: insertError } = await supabase.from("vehicles").insert({
        user_id: userData.user.id,
        brand,
        model,
        year,
        engine,
        vin: null,
        mileage: 0,
        yearly_km: 15000,
        last_service_km: 0,
        last_service_date: null,
      });

      if (insertError) {
        console.error("Nu am putut salva mașina:", insertError);
        return;
      }

      setSavedInGarage(true);
    } catch (error) {
      console.error("Nu am putut salva mașina:", error);
    }
  }

  return (
    <main className="catalog-page">
      <header className="topbar catalog-topbar">
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

          <Link href="/garaj">
            Garajul meu
          </Link>

          <button
            type="button"
            className="cart-button"
            onClick={() =>
              router.push("/cos")
            }
          >
            Coș

            <span>
              {cartCount}
            </span>
          </button>
        </nav>
      </header>

      <section className="catalog-hero">
        <div className="catalog-container">
          <div className="breadcrumb">
            <Link href="/">
              Acasă
            </Link>

            <span>/</span>

            <span>
              Piese auto
            </span>
          </div>

          <div className="selected-car-bar">
            <div className="selected-car-main">
              <div className="selected-car-icon">
                G
              </div>

              <div>
                <span className="selected-label">
                  MAȘINA SELECTATĂ
                </span>

                <h1>
                  {brand} {model}
                </h1>

                <p>
                  {year} · {engine}
                </p>
              </div>
            </div>

            <div className="compatibility-badge">
              ✓ Compatibilitate activă
            </div>

            <div className="selected-car-actions">
              {savedInGarage ? (
                <Link
                  href="/garaj"
                  className="garage-saved-button"
                >
                  ✓ Salvată în Garaj
                </Link>
              ) : (
                <button
                  type="button"
                  className="save-garage-button"
                  onClick={
                    saveVehicleToGarage
                  }
                >
                  ♡ Salvează în Garaj
                </button>
              )}

              <Link
                className="change-car-button"
                href="/"
              >
                Schimbă mașina
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-content">
        <div className="catalog-container">
          <div className="catalog-title-row">
            <div>
              <span className="eyebrow orange">
                CATALOG GARAGIO
              </span>

              <h2>
                Piese compatibile cu{" "}
                {brand} {model}
              </h2>

              <p>
                {year} · {engine}
              </p>

              {urlTier && (
                <p className="catalog-tier-info">
                  Gamă selectată:{" "}
                  <strong>
                    {urlTier}
                  </strong>
                </p>
              )}

              <p>
                Produsele, prețurile și
                disponibilitatea sunt încărcate
                din catalogul Garagio. Datele
                furnizorilor sunt procesate
                server-side.
              </p>
            </div>

            <div className="catalog-result-count">
              <strong>
                {filteredProducts.length}
              </strong>

              <span>
                produse
              </span>
            </div>
          </div>

          <div className="catalog-layout">
            <aside className="catalog-sidebar">
              <div className="filter-block">
                <strong>
                  Categorii
                </strong>

                <div className="filter-list">
                  {categories.map(
                    (item) => (
                      <button
                        type="button"
                        key={item}
                        className={
                          category === item
                            ? "filter-button active"
                            : "filter-button"
                        }
                        onClick={() =>
                          handleCategoryChange(
                            item
                          )
                        }
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="filter-block">
                <strong>
                  Compatibilitate
                </strong>

                <div className="compatibility-info">
                  <span>
                    ✓
                  </span>

                  <p>
                    Afișăm doar produse
                    compatibile cu configurația
                    selectată.
                  </p>
                </div>
              </div>

              <div className="filter-block">
                <strong>
                  Ai dubii?
                </strong>

                <p className="sidebar-text">
                  Introdu seria VIN la checkout
                  pentru verificarea
                  suplimentară a
                  compatibilității.
                </p>
              </div>

              <div className="filter-block">
                <strong>
                  Garajul Meu
                </strong>

                {savedInGarage ? (
                  <>
                    <p className="sidebar-text">
                      Mașina aceasta este deja
                      salvată în Garajul tău.
                    </p>

                    <Link
                      href="/garaj"
                      className="sidebar-garage-link"
                    >
                      Deschide Garajul →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="sidebar-text">
                      Salveaz-o pentru a o
                      selecta mai rapid data
                      viitoare.
                    </p>

                    <button
                      type="button"
                      className="sidebar-save-garage"
                      onClick={
                        saveVehicleToGarage
                      }
                    >
                      + Salvează mașina
                    </button>
                  </>
                )}
              </div>
            </aside>

            <div className="catalog-main">
              <div className="catalog-toolbar">
                <div className="category-pills">
                  {categories.map(
                    (item) => (
                      <button
                        type="button"
                        key={item}
                        className={
                          category === item
                            ? "category-pill active"
                            : "category-pill"
                        }
                        onClick={() =>
                          handleCategoryChange(
                            item
                          )
                        }
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(
                      e.target.value
                    )
                  }
                  className="sort-select"
                >
                  <option value="recommended">
                    Recomandate
                  </option>

                  <option value="price-low">
                    Preț crescător
                  </option>

                  <option value="price-high">
                    Preț descrescător
                  </option>
                </select>
              </div>

              {isLoadingProducts ? (
                <div className="catalog-empty">
                  <strong>Se încarcă produsele...</strong>
                </div>
              ) : catalogError ? (
                <div className="catalog-empty">
                  <strong>{catalogError}</strong>
                  <p>Reîncarcă pagina și încearcă din nou.</p>
                </div>
              ) : filteredProducts.length ===
              0 ? (
                <div className="catalog-empty">
                  <strong>
                    Momentan nu avem produse
                    în această categorie.
                  </strong>

                  <p>
                    Încearcă o altă categorie sau
                    revino la toate produsele.
                  </p>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() =>
                      handleCategoryChange(
                        "Toate"
                      )
                    }
                  >
                    Vezi toate produsele
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map(
                    (product) => (
                      <article
                        className="product-card"
                        key={product.id}
                      >
                        <div className="product-image">
                          <div className="product-placeholder">
                            {product.brand
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          {product.recommended && (
                            <span className="product-recommended">
                              ALEGERE GARAGIO
                            </span>
                          )}
                        </div>

                        <div className="product-content">
                          <div className="product-meta">
                            <span>
                              {product.brand}
                            </span>

                            <span>
                              Cod{" "}
                              {product.code}
                            </span>
                          </div>

                          <h3>
                            {product.name}
                          </h3>

                          <div className="product-compatible">
                            ✓ Compatibil cu{" "}
                            {brand} {model}
                          </div>

                          <div className="product-stock-row">
                            <span
                              className={
                                product.stock ===
                                "În stoc"
                                  ? "stock-good"
                                  : ""
                              }
                            >
                              ●{" "}
                              {product.stock}
                            </span>

                            <span>
                              {product.delivery}
                            </span>
                          </div>

                          <div className="product-bottom">
                            <div className="product-price">
                              {product.oldPrice && (
                                <span className="old-price">
                                  {product.oldPrice.toFixed(
                                    2
                                  )}{" "}
                                  lei
                                </span>
                              )}

                              <strong>
                                {product.price.toFixed(
                                  2
                                )}{" "}
                                lei
                              </strong>

                              <small>
                                TVA inclus
                              </small>
                            </div>

                            <button
                              type="button"
                              className={
                                addedProduct ===
                                product.id
                                  ? "add-cart-button added"
                                  : "add-cart-button"
                              }
                              onClick={() =>
                                handleAddToCart(
                                  product
                                )
                              }
                            >
                              {addedProduct ===
                              product.id
                                ? "✓ Adăugat"
                                : "Adaugă în coș"}
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="catalog-help">
        <div className="catalog-container catalog-help-inner">
          <div>
            <span className="eyebrow orange">
              GARAGIO
            </span>

            <h2>
              Nu ești sigur ce piesă îți
              trebuie?
            </h2>

            <p>
              Salvează mașina în Garajul tău
              sau folosește VIN-ul pentru o
              identificare mai precisă.
            </p>
          </div>

          {savedInGarage ? (
            <Link
              className="primary-link-button"
              href="/garaj"
            >
              Deschide Garajul Meu →
            </Link>
          ) : (
            <button
              type="button"
              className="primary-link-button"
              onClick={
                saveVehicleToGarage
              }
            >
              Salvează mașina în Garaj →
            </button>
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

          <Link href="/garaj">
            Garajul meu
          </Link>

          <Link href="/cont">
            Cont
          </Link>
        </div>

        <p>
          © 2026 Garagio. Toate drepturile
          rezervate.
        </p>
      </footer>
    </main>
  );
}

export default function PartsPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#f8fafc",
            color: "#0f172a",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          Se încarcă piesele...
        </main>
      }
    >
      <PartsPageContent />
    </Suspense>
  );
}
