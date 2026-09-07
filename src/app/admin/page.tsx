"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClient,
} from "../../lib/supabase/client";

type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  product_brand: string | null;
  product_code: string | null;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

type Order = {
  id: string;
  user_id: string | null;

  order_number: string;
  status: string;

  customer_type:
    | "individual"
    | "company";

  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  county: string;
  city: string;
  address: string;
  postal_code: string | null;

  vin: string | null;

  company_name: string | null;
  cui: string | null;
  reg_com: string | null;

  payment_method: string;
  payment_status: string;

  subtotal: number | string;
  shipping: number | string;
  total: number | string;

  notes: string | null;

  created_at: string;
  updated_at: string;

  order_items: OrderItem[];
};

const STATUS_OPTIONS = [
  {
    value: "new",
    label: "Comandă nouă",
  },
  {
    value: "confirmed",
    label: "Confirmată",
  },
  {
    value: "processing",
    label: "În procesare",
  },
  {
    value:
      "ordered_from_supplier",
    label:
      "Comandată la furnizor",
  },
  {
    value: "shipped",
    label: "Expediată",
  },
  {
    value: "completed",
    label: "Finalizată",
  },
  {
    value: "cancelled",
    label: "Anulată",
  },
];

export default function AdminPage() {
  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    accessError,
    setAccessError,
  ] = useState("");

  const [
    selectedOrderId,
    setSelectedOrderId,
  ] = useState<string | null>(
    null
  );

  const [
    updatingOrderId,
    setUpdatingOrderId,
  ] = useState<string | null>(
    null
  );

  const [
    filterStatus,
    setFilterStatus,
  ] = useState("all");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    currentUserEmail,
    setCurrentUserEmail,
  ] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function getAccessToken() {
    const {
      data: sessionData,
    } =
      await supabase.auth.getSession();

    return (
      sessionData.session
        ?.access_token || null
    );
  }

  async function loadOrders() {
    setIsLoading(true);
    setAccessError("");

    try {
      const {
        data: userData,
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !userData.user
      ) {
        setAccessError(
          "Trebuie să fii autentificat pentru a accesa panoul de administrare."
        );

        setOrders([]);
        return;
      }

      setCurrentUserEmail(
        userData.user.email || ""
      );

      const token =
        await getAccessToken();

      if (!token) {
        setAccessError(
          "Sesiunea nu este disponibilă. Autentifică-te din nou."
        );

        return;
      }

      const response =
        await fetch(
          "/api/admin/orders",
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setAccessError(
          result?.error ||
            "Panoul de administrare nu a putut fi încărcat."
        );

        setOrders([]);
        return;
      }

      setOrders(
        result.orders || []
      );
    } catch (error) {
      console.error(
        "Admin load error:",
        error
      );

      setAccessError(
        "A apărut o eroare la încărcarea panoului de administrare."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOrderStatus(
    orderId: string,
    status: string
  ) {
    setUpdatingOrderId(
      orderId
    );

    try {
      const token =
        await getAccessToken();

      if (!token) {
        window.alert(
          "Sesiunea a expirat. Autentifică-te din nou."
        );

        return;
      }

      const response =
        await fetch(
          "/api/admin/orders",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId,
              status,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        window.alert(
          result?.error ||
            "Statusul nu a putut fi modificat."
        );

        return;
      }

      setOrders(
        (current) =>
          current.map(
            (order) =>
              order.id ===
              orderId
                ? {
                    ...order,
                    status:
                      result
                        .order
                        .status,
                    updated_at:
                      result
                        .order
                        .updated_at,
                  }
                : order
          )
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      window.alert(
        "A apărut o eroare la modificarea statusului."
      );
    } finally {
      setUpdatingOrderId(
        null
      );
    }
  }

  function formatMoney(
    value: number | string
  ) {
    return Number(
      value
    ).toLocaleString(
      "ro-RO",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  function formatDate(
    value: string
  ) {
    return new Intl.DateTimeFormat(
      "ro-RO",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(
      new Date(value)
    );
  }

  function statusLabel(
    status: string
  ) {
    return (
      STATUS_OPTIONS.find(
        (item) =>
          item.value ===
          status
      )?.label || status
    );
  }

  function paymentLabel(
    method: string
  ) {
    return method === "cash"
      ? "Ramburs"
      : "Card online";
  }

  const filteredOrders =
    useMemo(() => {
      const normalized =
        searchTerm
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const statusMatches =
            filterStatus ===
              "all" ||
            order.status ===
              filterStatus;

          if (!statusMatches) {
            return false;
          }

          if (!normalized) {
            return true;
          }

          const searchable =
            [
              order.order_number,
              order.first_name,
              order.last_name,
              order.email,
              order.phone,
              order.city,
              order.county,
              order.company_name,
              order.cui,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            normalized
          );
        }
      );
    }, [
      orders,
      filterStatus,
      searchTerm,
    ]);

  const selectedOrder =
    selectedOrderId
      ? orders.find(
          (order) =>
            order.id ===
            selectedOrderId
        ) || null
      : null;

  const totalRevenue =
    orders
      .filter(
        (order) =>
          order.status !==
          "cancelled"
      )
      .reduce(
        (sum, order) =>
          sum +
          Number(
            order.total
          ),
        0
      );

  const newOrders =
    orders.filter(
      (order) =>
        order.status === "new"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        [
          "confirmed",
          "processing",
          "ordered_from_supplier",
        ].includes(
          order.status
        )
    ).length;

  if (isLoading) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#f8fafc",
        }}
      >
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

        <div
          style={{
            width:
              "min(1200px, 92%)",
            margin:
              "70px auto",
            background:
              "white",
            padding:
              "40px",
            borderRadius:
              "18px",
            border:
              "1px solid #e2e8f0",
            textAlign:
              "center",
          }}
        >
          Se încarcă panoul
          de administrare...
        </div>
      </main>
    );
  }

  if (accessError) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          background:
            "#f8fafc",
        }}
      >
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

            <Link href="/cont">
              Cont
            </Link>
          </nav>
        </header>

        <section
          style={{
            width:
              "min(720px, 92%)",
            margin:
              "80px auto",
            background:
              "white",
            padding:
              "40px",
            borderRadius:
              "18px",
            border:
              "1px solid #e2e8f0",
          }}
        >
          <span className="eyebrow orange">
            ADMIN GARAGIO
          </span>

          <h1>
            Acces restricționat
          </h1>

          <div className="checkout-error">
            {accessError}
          </div>

          <div
            style={{
              marginTop:
                "24px",
              display:
                "flex",
              gap: "10px",
              flexWrap:
                "wrap",
            }}
          >
            <Link
              href="/cont"
              className="primary-link-button"
            >
              Mergi la cont →
            </Link>

            <button
              type="button"
              className="vehicle-cancel-button"
              onClick={
                loadOrders
              }
            >
              Reîncearcă
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f8fafc",
      }}
    >
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
            Catalog
          </Link>

          <Link href="/garaj">
            Garaj
          </Link>

          <Link href="/cont">
            Cont
          </Link>
        </nav>
      </header>

      <section
        style={{
          background:
            "#0f172a",
          color: "white",
          padding:
            "52px 0",
        }}
      >
        <div
          style={{
            width:
              "min(1240px, 92%)",
            margin:
              "0 auto",
            display:
              "flex",
            justifyContent:
              "space-between",
            gap: "30px",
            alignItems:
              "flex-end",
            flexWrap:
              "wrap",
          }}
        >
          <div>
            <span className="eyebrow orange">
              GARAGIO ADMIN
            </span>

            <h1
              style={{
                margin:
                  "7px 0 8px",
                fontSize:
                  "46px",
              }}
            >
              Comenzi
            </h1>

            <p
              style={{
                margin: 0,
                color:
                  "#94a3b8",
              }}
            >
              Administrează
              comenzile și
              statusurile
              clienților.
            </p>
          </div>

          <div
            style={{
              color:
                "#94a3b8",
              fontSize:
                "12px",
            }}
          >
            Logat ca{" "}
            <strong
              style={{
                color:
                  "white",
              }}
            >
              {
                currentUserEmail
              }
            </strong>
          </div>
        </div>
      </section>

      <section
        style={{
          width:
            "min(1240px, 92%)",
          margin:
            "0 auto",
          padding:
            "34px 0 80px",
        }}
      >
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "14px",
            marginBottom:
              "24px",
          }}
        >
          <AdminStat
            label="COMENZI TOTAL"
            value={String(
              orders.length
            )}
          />

          <AdminStat
            label="COMENZI NOI"
            value={String(
              newOrders
            )}
          />

          <AdminStat
            label="ÎN LUCRU"
            value={String(
              processingOrders
            )}
          />

          <AdminStat
            label="VALOARE COMENZI"
            value={`${formatMoney(
              totalRevenue
            )} lei`}
          />
        </div>

        <div
          style={{
            background:
              "white",
            border:
              "1px solid #e2e8f0",
            borderRadius:
              "16px",
            padding:
              "18px",
            display:
              "flex",
            gap: "12px",
            alignItems:
              "center",
            flexWrap:
              "wrap",
            marginBottom:
              "20px",
          }}
        >
          <input
            type="search"
            value={
              searchTerm
            }
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Caută comandă, client, email, telefon..."
            style={{
              flex:
                "1 1 320px",
              minHeight:
                "42px",
              border:
                "1px solid #d8dee8",
              borderRadius:
                "9px",
              padding:
                "0 13px",
              outline:
                "none",
            }}
          />

          <select
            value={
              filterStatus
            }
            onChange={(e) =>
              setFilterStatus(
                e.target.value
              )
            }
            style={{
              minHeight:
                "42px",
              border:
                "1px solid #d8dee8",
              borderRadius:
                "9px",
              padding:
                "0 12px",
              background:
                "white",
            }}
          >
            <option value="all">
              Toate statusurile
            </option>

            {STATUS_OPTIONS.map(
              (item) => (
                <option
                  key={
                    item.value
                  }
                  value={
                    item.value
                  }
                >
                  {item.label}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            className="vehicle-cancel-button"
            onClick={
              loadOrders
            }
          >
            Reîncarcă
          </button>
        </div>

        {filteredOrders.length ===
        0 ? (
          <div
            style={{
              background:
                "white",
              border:
                "1px solid #e2e8f0",
              borderRadius:
                "16px",
              padding:
                "50px",
              textAlign:
                "center",
            }}
          >
            <strong>
              Nu există comenzi
              pentru filtrul
              selectat.
            </strong>
          </div>
        ) : (
          <div
            style={{
              display:
                "grid",
              gap: "12px",
            }}
          >
            {filteredOrders.map(
              (order) => (
                <article
                  key={
                    order.id
                  }
                  style={{
                    background:
                      "white",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius:
                      "15px",
                    overflow:
                      "hidden",
                  }}
                >
                  <div
                    style={{
                      padding:
                        "18px",
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1.35fr 1fr 1fr auto",
                      gap: "18px",
                      alignItems:
                        "center",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display:
                            "block",
                          color:
                            "#64748b",
                          fontSize:
                            "10px",
                          fontWeight:
                            900,
                          letterSpacing:
                            ".08em",
                        }}
                      >
                        COMANDĂ
                      </span>

                      <strong
                        style={{
                          display:
                            "block",
                          marginTop:
                            "4px",
                          fontSize:
                            "16px",
                        }}
                      >
                        {
                          order.order_number
                        }
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "5px",
                          color:
                            "#64748b",
                          fontSize:
                            "11px",
                        }}
                      >
                        {formatDate(
                          order.created_at
                        )}
                      </span>
                    </div>

                    <div>
                      <strong
                        style={{
                          display:
                            "block",
                        }}
                      >
                        {
                          order.first_name
                        }{" "}
                        {
                          order.last_name
                        }
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "5px",
                          color:
                            "#64748b",
                          fontSize:
                            "11px",
                        }}
                      >
                        {
                          order.email
                        }
                      </span>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "2px",
                          color:
                            "#64748b",
                          fontSize:
                            "11px",
                        }}
                      >
                        {
                          order.phone
                        }
                      </span>
                    </div>

                    <div>
                      <strong
                        style={{
                          display:
                            "block",
                          fontSize:
                            "17px",
                        }}
                      >
                        {formatMoney(
                          order.total
                        )}{" "}
                        lei
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "5px",
                          color:
                            "#64748b",
                          fontSize:
                            "11px",
                        }}
                      >
                        {paymentLabel(
                          order.payment_method
                        )}
                      </span>
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                        flexWrap:
                          "wrap",
                        justifyContent:
                          "flex-end",
                      }}
                    >
                      <select
                        value={
                          order.status
                        }
                        disabled={
                          updatingOrderId ===
                          order.id
                        }
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        style={{
                          minHeight:
                            "38px",
                          border:
                            "1px solid #d8dee8",
                          borderRadius:
                            "8px",
                          padding:
                            "0 10px",
                          background:
                            "white",
                          fontWeight:
                            700,
                          fontSize:
                            "11px",
                        }}
                      >
                        {STATUS_OPTIONS.map(
                          (item) => (
                            <option
                              key={
                                item.value
                              }
                              value={
                                item.value
                              }
                            >
                              {
                                item.label
                              }
                            </option>
                          )
                        )}
                      </select>

                      <button
                        type="button"
                        className="vehicle-edit-button"
                        onClick={() =>
                          setSelectedOrderId(
                            selectedOrderId ===
                              order.id
                              ? null
                              : order.id
                          )
                        }
                      >
                        {selectedOrderId ===
                        order.id
                          ? "Închide"
                          : "Detalii"}
                      </button>
                    </div>
                  </div>

                  {selectedOrderId ===
                    order.id && (
                    <OrderDetails
                      order={
                        order
                      }
                    />
                  )}
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function AdminStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "white",
        border:
          "1px solid #e2e8f0",
        borderRadius:
          "14px",
        padding:
          "18px",
      }}
    >
      <span
        style={{
          display:
            "block",
          color:
            "#64748b",
          fontSize:
            "9px",
          fontWeight:
            900,
          letterSpacing:
            ".08em",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display:
            "block",
          marginTop:
            "7px",
          fontSize:
            "24px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function OrderDetails({
  order,
}: {
  order: Order;
}) {
  return (
    <div
      style={{
        borderTop:
          "1px solid #e2e8f0",
        padding:
          "20px",
        background:
          "#f8fafc",
      }}
    >
      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "18px",
        }}
      >
        <DetailBlock
          title="CLIENT"
        >
          <strong>
            {order.first_name}{" "}
            {order.last_name}
          </strong>

          <span>
            {order.email}
          </span>

          <span>
            {order.phone}
          </span>

          <span>
            {order.user_id
              ? "Cont Garagio"
              : "Guest checkout"}
          </span>
        </DetailBlock>

        <DetailBlock
          title="LIVRARE"
        >
          <strong>
            {order.city},{" "}
            {order.county}
          </strong>

          <span>
            {order.address}
          </span>

          {order.postal_code && (
            <span>
              Cod poștal:{" "}
              {
                order.postal_code
              }
            </span>
          )}
        </DetailBlock>

        <DetailBlock
          title="PLATĂ / FACTURARE"
        >
          <strong>
            {order.payment_method ===
            "cash"
              ? "Ramburs"
              : "Card online"}
          </strong>

          <span>
            Status plată:{" "}
            {
              order.payment_status
            }
          </span>

          {order.customer_type ===
            "company" && (
            <>
              <span>
                {
                  order.company_name
                }
              </span>

              <span>
                CUI:{" "}
                {order.cui}
              </span>

              {order.reg_com && (
                <span>
                  Reg. Com.:{" "}
                  {
                    order.reg_com
                  }
                </span>
              )}
            </>
          )}
        </DetailBlock>
      </div>

      {(order.vin ||
        order.notes) && (
        <div
          style={{
            marginTop:
              "18px",
            display:
              "grid",
            gap: "10px",
          }}
        >
          {order.vin && (
            <div>
              <strong>
                VIN:{" "}
              </strong>

              <span>
                {order.vin}
              </span>
            </div>
          )}

          {order.notes && (
            <div>
              <strong>
                Observații:{" "}
              </strong>

              <span>
                {order.notes}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          marginTop:
            "20px",
          background:
            "white",
          border:
            "1px solid #e2e8f0",
          borderRadius:
            "12px",
          overflow:
            "hidden",
        }}
      >
        {order.order_items.map(
          (item, index) => (
            <div
              key={
                item.id
              }
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "1fr auto auto",
                gap:
                  "18px",
                alignItems:
                  "center",
                padding:
                  "14px 16px",
                borderTop:
                  index === 0
                    ? "none"
                    : "1px solid #e2e8f0",
              }}
            >
              <div>
                <strong>
                  {
                    item.product_name
                  }
                </strong>

                <span
                  style={{
                    display:
                      "block",
                    marginTop:
                      "3px",
                    color:
                      "#64748b",
                    fontSize:
                      "11px",
                  }}
                >
                  {item.product_brand ||
                    "Garagio"}
                  {item.product_code
                    ? ` · ${item.product_code}`
                    : ""}
                </span>
              </div>

              <span
                style={{
                  color:
                    "#64748b",
                  fontSize:
                    "12px",
                }}
              >
                {item.quantity} ×{" "}
                {Number(
                  item.unit_price
                ).toFixed(
                  2
                )}{" "}
                lei
              </span>

              <strong>
                {Number(
                  item.line_total
                ).toFixed(
                  2
                )}{" "}
                lei
              </strong>
            </div>
          )
        )}
      </div>

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "flex-end",
          gap: "22px",
          flexWrap:
            "wrap",
          marginTop:
            "16px",
        }}
      >
        <span>
          Subtotal:{" "}
          <strong>
            {Number(
              order.subtotal
            ).toFixed(
              2
            )}{" "}
            lei
          </strong>
        </span>

        <span>
          Livrare:{" "}
          <strong>
            {Number(
              order.shipping
            ) === 0
              ? "Gratuit"
              : `${Number(
                  order.shipping
                ).toFixed(
                  2
                )} lei`}
          </strong>
        </span>

        <span>
          Total:{" "}
          <strong>
            {Number(
              order.total
            ).toFixed(
              2
            )}{" "}
            lei
          </strong>
        </span>
      </div>
    </div>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <div
      style={{
        background:
          "white",
        border:
          "1px solid #e2e8f0",
        borderRadius:
          "10px",
        padding:
          "14px",
        display:
          "grid",
        gap: "5px",
      }}
    >
      <span
        style={{
          color:
            "#64748b",
          fontSize:
            "9px",
          fontWeight:
            900,
          letterSpacing:
            ".08em",
        }}
      >
        {title}
      </span>

      {children}
    </div>
  );
}
