import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
  User,
} from "@supabase/supabase-js";

import {
  Resend,
} from "resend";

export const dynamic =
  "force-dynamic";

const ALLOWED_STATUSES = [
  "new",
  "confirmed",
  "processing",
  "ordered_from_supplier",
  "shipped",
  "completed",
  "cancelled",
] as const;

type OrderStatus =
  (typeof ALLOWED_STATUSES)[number];

type AdminOrderForEmail = {
  id: string;
  order_number: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  total: number | string;
  payment_method: string;
  updated_at: string;
};

function createAdminClient() {
  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;

  if (
    !url ||
    !serviceRoleKey
  ) {
    throw new Error(
      "Configurarea Supabase server-side lipsește."
    );
  }

  return createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

async function getAdminUser(
  request: NextRequest
): Promise<
  | {
      user: User;
      supabase: ReturnType<
        typeof createAdminClient
      >;
    }
  | {
      error: NextResponse;
    }
> {
  const authorization =
    request.headers.get(
      "authorization"
    );

  if (
    !authorization?.startsWith(
      "Bearer "
    )
  ) {
    return {
      error:
        NextResponse.json(
          {
            error:
              "Trebuie să fii autentificat.",
          },
          {
            status: 401,
          }
        ),
    };
  }

  const token =
    authorization.slice(7);

  const supabase =
    createAdminClient();

  const {
    data: userData,
    error: userError,
  } =
    await supabase.auth.getUser(
      token
    );

  if (
    userError ||
    !userData.user
  ) {
    return {
      error:
        NextResponse.json(
          {
            error:
              "Sesiune invalidă sau expirată.",
          },
          {
            status: 401,
          }
        ),
    };
  }

  const {
    data: roleData,
    error: roleError,
  } = await supabase
    .from("user_roles")
    .select("role")
    .eq(
      "user_id",
      userData.user.id
    )
    .maybeSingle();

  if (
    roleError ||
    roleData?.role !==
      "admin"
  ) {
    return {
      error:
        NextResponse.json(
          {
            error:
              "Nu ai acces la panoul de administrare.",
          },
          {
            status: 403,
          }
        ),
    };
  }

  return {
    user: userData.user,
    supabase,
  };
}

function escapeHtml(
  value: unknown
) {
  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

function formatLei(
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

function statusLabel(
  status: string
) {
  const labels:
    Record<
      string,
      string
    > = {
    new:
      "Comandă nouă",
    confirmed:
      "Confirmată",
    processing:
      "În procesare",
    ordered_from_supplier:
      "Comandată la furnizor",
    shipped:
      "Expediată",
    completed:
      "Finalizată",
    cancelled:
      "Anulată",
  };

  return (
    labels[status] ||
    status
  );
}

function statusMessage(
  status: OrderStatus
) {
  const messages:
    Record<
      OrderStatus,
      {
        title: string;
        text: string;
      }
    > = {
    new: {
      title:
        "Comanda ta a fost înregistrată",
      text:
        "Am înregistrat comanda și urmează să o verificăm.",
    },

    confirmed: {
      title:
        "Comanda ta a fost confirmată",
      text:
        "Am verificat comanda și aceasta a fost confirmată.",
    },

    processing: {
      title:
        "Comanda ta este în procesare",
      text:
        "Pregătim comanda și verificăm disponibilitatea produselor.",
    },

    ordered_from_supplier: {
      title:
        "Produsele au fost comandate la furnizor",
      text:
        "Comanda este în lucru, iar produsele necesare au fost solicitate furnizorului.",
    },

    shipped: {
      title:
        "Comanda ta a fost expediată",
      text:
        "Comanda a plecat spre tine. Detaliile de livrare vor fi disponibile separat atunci când integrăm AWB-ul curierului.",
    },

    completed: {
      title:
        "Comanda ta a fost finalizată",
      text:
        "Comanda este marcată ca finalizată. Îți mulțumim că ai ales Garagio.",
    },

    cancelled: {
      title:
        "Comanda ta a fost anulată",
      text:
        "Comanda a fost anulată. Dacă ai nevoie de ajutor, răspunde acestui email.",
    },
  };

  return messages[status];
}

function buildStatusEmail(
  order:
    AdminOrderForEmail,
  status:
    OrderStatus
) {
  const message =
    statusMessage(
      status
    );

  return `
    <!doctype html>
    <html lang="ro">
      <body
        style="
          margin:0;
          background:#f3f4f6;
          font-family:Arial,sans-serif;
          color:#111827;
        "
      >
        <div
          style="
            max-width:650px;
            margin:0 auto;
            padding:30px 16px;
          "
        >
          <div
            style="
              background:#111827;
              padding:28px 30px;
              border-radius:16px 16px 0 0;
            "
          >
            <div
              style="
                font-size:28px;
                font-weight:800;
                color:#ffffff;
              "
            >
              GARAGIO
            </div>

            <div
              style="
                margin-top:5px;
                color:#fb923c;
                font-size:13px;
                font-weight:700;
              "
            >
              Actualizare comandă
            </div>
          </div>

          <div
            style="
              background:#ffffff;
              padding:30px;
              border-radius:0 0 16px 16px;
            "
          >
            <h1
              style="
                margin:0 0 12px;
                font-size:24px;
              "
            >
              ${escapeHtml(
                message.title
              )}
            </h1>

            <p
              style="
                color:#4b5563;
                line-height:1.6;
              "
            >
              Salut,
              ${escapeHtml(
                order.first_name
              )}.
              ${escapeHtml(
                message.text
              )}
            </p>

            <div
              style="
                margin:24px 0;
                padding:16px;
                background:#fff7ed;
                border:1px solid #fed7aa;
                border-radius:10px;
              "
            >
              <div>
                <strong>
                  ${escapeHtml(
                    order.order_number
                  )}
                </strong>
              </div>

              <div
                style="
                  margin-top:7px;
                  color:#6b7280;
                "
              >
                Status:
                <strong>
                  ${escapeHtml(
                    statusLabel(
                      status
                    )
                  )}
                </strong>
              </div>

              <div
                style="
                  margin-top:7px;
                  color:#6b7280;
                "
              >
                Total:
                <strong>
                  ${formatLei(
                    order.total
                  )} lei
                </strong>
              </div>
            </div>

            <p
              style="
                color:#6b7280;
                font-size:13px;
                line-height:1.6;
              "
            >
              Poți urmări istoricul comenzilor
              din contul tău Garagio.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

async function sendStatusEmail(
  order:
    AdminOrderForEmail,
  status:
    OrderStatus
) {
  const apiKey =
    process.env
      .RESEND_API_KEY;

  if (!apiKey) {
    console.error(
      "RESEND_API_KEY lipsește. Statusul a fost salvat fără email."
    );

    return;
  }

  const resend =
    new Resend(
      apiKey
    );

  try {
    const result =
      await resend.emails.send(
        {
          from:
            "Garagio <comenzi@garagio.ro>",

          to: [
            order.email,
          ],

          subject:
            `${statusLabel(
              status
            )} — ${order.order_number} | Garagio`,

          html:
            buildStatusEmail(
              order,
              status
            ),
        }
      );

    if (
      result.error
    ) {
      console.error(
        "Resend status email error:",
        result.error
      );
    }
  } catch (
    emailError
  ) {
    console.error(
      "Status email failed:",
      emailError
    );
  }
}

/*
 * =========================================================
 * GET
 * Toate comenzile pentru admin
 * =========================================================
 */

export async function GET(
  request: NextRequest
) {
  try {
    const auth =
      await getAdminUser(
        request
      );

    if ("error" in auth) {
      return auth.error;
    }

    const { supabase } =
      auth;

    const {
      data,
      error,
    } = await supabase
      .from("orders")
      .select(
        `
          id,
          user_id,
          order_number,
          status,
          customer_type,
          first_name,
          last_name,
          email,
          phone,
          county,
          city,
          address,
          postal_code,
          vin,
          company_name,
          cui,
          reg_com,
          payment_method,
          payment_status,
          subtotal,
          shipping,
          total,
          notes,
          created_at,
          updated_at,

          order_items (
            id,
            product_id,
            product_name,
            product_brand,
            product_code,
            quantity,
            unit_price,
            line_total
          )
        `
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(
        "Admin orders error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Comenzile nu au putut fi încărcate.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        orders:
          data || [],
      },
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Admin GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Eroare internă Garagio.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * =========================================================
 * PATCH
 * Modificarea statusului unei comenzi
 * + email automat către client
 * =========================================================
 */

export async function PATCH(
  request: NextRequest
) {
  try {
    const auth =
      await getAdminUser(
        request
      );

    if ("error" in auth) {
      return auth.error;
    }

    const { supabase } =
      auth;

    let body: {
      orderId?: string;
      status?: string;
    };

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Date invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const orderId =
      body.orderId?.trim();

    const status =
      body.status?.trim();

    if (
      !orderId ||
      !status
    ) {
      return NextResponse.json(
        {
          error:
            "Lipsește comanda sau statusul.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_STATUSES.includes(
        status as OrderStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Status invalid.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Citim comanda înainte,
     * ca să știm statusul vechi
     * și să evităm email dublu
     * dacă adminul selectează
     * același status.
     */
    const {
      data:
        existingOrder,
      error:
        existingOrderError,
    } = await supabase
      .from("orders")
      .select(
        `
          id,
          order_number,
          status,
          first_name,
          last_name,
          email,
          total,
          payment_method,
          updated_at
        `
      )
      .eq(
        "id",
        orderId
      )
      .maybeSingle();

    if (
      existingOrderError
    ) {
      console.error(
        "Admin read order:",
        existingOrderError
      );

      return NextResponse.json(
        {
          error:
            "Comanda nu a putut fi verificată.",
        },
        {
          status: 500,
        }
      );
    }

    if (!existingOrder) {
      return NextResponse.json(
        {
          error:
            "Comanda nu există.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      existingOrder.status ===
      status
    ) {
      return NextResponse.json(
        {
          ok: true,
          order:
            existingOrder,
        }
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("orders")
      .update({
        status,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        orderId
      )
      .select(
        `
          id,
          order_number,
          status,
          first_name,
          last_name,
          email,
          total,
          payment_method,
          updated_at
        `
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Admin update order:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Statusul nu a putut fi modificat.",
        },
        {
          status: 500,
        }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Comanda nu există.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Statusul este deja salvat.
     * Dacă emailul eșuează,
     * NU revenim la statusul vechi.
     */
    await sendStatusEmail(
      data as AdminOrderForEmail,
      status as OrderStatus
    );

    return NextResponse.json({
      ok: true,
      order: data,
    });
  } catch (error) {
    console.error(
      "Admin PATCH error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Eroare internă Garagio.",
      },
      {
        status: 500,
      }
    );
  }
}
