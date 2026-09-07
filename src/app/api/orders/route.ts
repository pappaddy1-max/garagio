import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

type CheckoutItem = {
  productId?: string | null;
  productCode?: string | null;
  quantity?: number;
};

type CheckoutBody = {
  customerType?: "individual" | "company";
  paymentMethod?: "card" | "cash";

  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };

  delivery?: {
    county?: string;
    city?: string;
    address?: string;
    postalCode?: string;
  };

  vin?: string | null;

  company?: {
    name?: string;
    cui?: string;
    regCom?: string;
  } | null;

  notes?: string | null;
  items?: CheckoutItem[];
};

type ProductRow = {
  id: string;
  name: string;
  brand: string | null;
  manufacturer_code: string | null;
  selling_price: number | string | null;
};

const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_PRICE = 19.9;

function adminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Configurarea Supabase server-side lipsește."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function money(value: number) {
  return Math.round(value * 100) / 100;
}

function createOrderNumber() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(
      2,
      "0"
    ) +
    String(now.getDate()).padStart(
      2,
      "0"
    );

  const random =
    crypto.randomUUID()
      .replaceAll("-", "")
      .slice(0, 8)
      .toUpperCase();

  return `GRG-${date}-${random}`;
}

function text(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}


function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLei(value: number) {
  return value.toLocaleString("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function customerEmailHtml(params: {
  firstName: string;
  orderNumber: string;
  orderItems: Array<{
    product_name: string;
    product_brand: string | null;
    product_code: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "card" | "cash";
  county: string;
  city: string;
  address: string;
  postalCode: string;
}) {
  const rows = params.orderItems.map((item) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #e5e7eb">
        <strong>${escapeHtml(item.product_name)}</strong>
        <div style="font-size:12px;color:#6b7280;margin-top:4px">
          ${escapeHtml(item.product_brand || "Garagio")}
          ${item.product_code ? ` · ${escapeHtml(item.product_code)}` : ""}
        </div>
      </td>
      <td style="padding:14px 8px;text-align:center;border-bottom:1px solid #e5e7eb">
        ${item.quantity}
      </td>
      <td style="padding:14px 0;text-align:right;border-bottom:1px solid #e5e7eb;white-space:nowrap">
        ${formatLei(item.line_total)} lei
      </td>
    </tr>
  `).join("");

  return `
    <!doctype html>
    <html lang="ro">
      <body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif;color:#111827">
        <div style="max-width:680px;margin:0 auto;padding:30px 16px">
          <div style="background:#111827;padding:28px 30px;border-radius:16px 16px 0 0">
            <div style="font-size:28px;font-weight:800;color:#fff">GARAGIO</div>
            <div style="margin-top:5px;color:#fb923c;font-size:13px;font-weight:700">
              Confirmare comandă
            </div>
          </div>

          <div style="background:#fff;padding:30px;border-radius:0 0 16px 16px">
            <h1 style="margin:0 0 12px;font-size:24px">
              Mulțumim pentru comandă, ${escapeHtml(params.firstName)}!
            </h1>

            <p style="color:#4b5563;line-height:1.6">
              Am înregistrat comanda ta. Numărul comenzii este
              <strong>${escapeHtml(params.orderNumber)}</strong>.
            </p>

            <div style="margin:24px 0;padding:16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px">
              <strong>${escapeHtml(params.orderNumber)}</strong>
              <div style="margin-top:6px;color:#6b7280;font-size:13px">
                Plată: ${params.paymentMethod === "cash" ? "Ramburs" : "Card online"}
              </div>
            </div>

            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr>
                  <th style="text-align:left;font-size:12px;color:#6b7280">PRODUS</th>
                  <th style="text-align:center;font-size:12px;color:#6b7280">BUC.</th>
                  <th style="text-align:right;font-size:12px;color:#6b7280">TOTAL</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <div style="margin-top:20px;line-height:1.8">
              <div>Subtotal: <strong>${formatLei(params.subtotal)} lei</strong></div>
              <div>Livrare: <strong>${params.shipping === 0 ? "Gratuită" : `${formatLei(params.shipping)} lei`}</strong></div>
              <div style="font-size:20px;margin-top:8px">
                Total: <strong>${formatLei(params.total)} lei</strong>
              </div>
            </div>

            <h2 style="font-size:18px;margin:28px 0 8px">Livrare</h2>
            <p style="color:#4b5563;line-height:1.6">
              ${escapeHtml(params.address)}<br>
              ${escapeHtml(params.city)}, ${escapeHtml(params.county)}
              ${params.postalCode ? `<br>Cod poștal: ${escapeHtml(params.postalCode)}` : ""}
            </p>

            <p style="margin-top:28px;color:#6b7280;font-size:13px">
              Vom reveni cu actualizări pe măsură ce comanda este procesată.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function adminEmailHtml(params: {
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  county: string;
  total: number;
  paymentMethod: "card" | "cash";
  orderItems: Array<{
    product_name: string;
    quantity: number;
    line_total: number;
  }>;
}) {
  const items = params.orderItems.map(
    (item) =>
      `<li>${escapeHtml(item.product_name)} × ${item.quantity} — ${formatLei(item.line_total)} lei</li>`
  ).join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;padding:30px;color:#111827">
      <h1>Comandă nouă Garagio</h1>
      <p>Comanda <strong>${escapeHtml(params.orderNumber)}</strong> a fost înregistrată.</p>
      <p>
        <strong>${escapeHtml(params.firstName)} ${escapeHtml(params.lastName)}</strong><br>
        ${escapeHtml(params.email)}<br>
        ${escapeHtml(params.phone)}<br>
        ${escapeHtml(params.city)}, ${escapeHtml(params.county)}
      </p>
      <ul>${items}</ul>
      <p>Plată: <strong>${params.paymentMethod === "cash" ? "Ramburs" : "Card online"}</strong></p>
      <p style="font-size:20px">Total: <strong>${formatLei(params.total)} lei</strong></p>
    </div>
  `;
}

export async function POST(
  request: NextRequest
) {
  const supabase = adminClient();

  let body: CheckoutBody;

  try {
    body =
      (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Datele comenzii nu sunt valide.",
      },
      { status: 400 }
    );
  }

  const firstName =
    text(body.customer?.firstName);

  const lastName =
    text(body.customer?.lastName);

  const email =
    text(body.customer?.email);

  const phone =
    text(body.customer?.phone);

  const county =
    text(body.delivery?.county);

  const city =
    text(body.delivery?.city);

  const address =
    text(body.delivery?.address);

  const postalCode =
    text(body.delivery?.postalCode);

  const customerType =
    body.customerType === "company"
      ? "company"
      : "individual";

  const paymentMethod =
    body.paymentMethod === "cash"
      ? "cash"
      : "card";

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !county ||
    !city ||
    !address
  ) {
    return NextResponse.json(
      {
        error:
          "Completează toate datele obligatorii.",
      },
      { status: 400 }
    );
  }

  if (
    !email.includes("@") ||
    !email.includes(".")
  ) {
    return NextResponse.json(
      {
        error:
          "Adresa de email nu este validă.",
      },
      { status: 400 }
    );
  }

  const vin =
    text(body.vin).toUpperCase();

  if (vin && vin.length !== 17) {
    return NextResponse.json(
      {
        error:
          "Seria VIN trebuie să aibă exact 17 caractere.",
      },
      { status: 400 }
    );
  }

  const companyName =
    text(body.company?.name);

  const cui =
    text(body.company?.cui);

  const regCom =
    text(body.company?.regCom);

  if (
    customerType === "company" &&
    (!companyName || !cui)
  ) {
    return NextResponse.json(
      {
        error:
          "Completează denumirea firmei și CUI-ul.",
      },
      { status: 400 }
    );
  }

  const incomingItems =
    Array.isArray(body.items)
      ? body.items
      : [];

  if (incomingItems.length === 0) {
    return NextResponse.json(
      {
        error:
          "Coșul este gol.",
      },
      { status: 400 }
    );
  }

  /*
   * Consolidăm cantitățile după UUID.
   * Nu avem încredere în prețul primit
   * din browser.
   */
  const quantityByProduct =
    new Map<string, number>();

  for (const item of incomingItems) {
    const productId =
      text(item.productId);

    const quantity =
      Number(item.quantity);

    if (
      !productId ||
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      quantity > 99
    ) {
      return NextResponse.json(
        {
          error:
            "Un produs din coș nu este valid. Reîncarcă pagina Piese și adaugă-l din nou.",
        },
        { status: 400 }
      );
    }

    quantityByProduct.set(
      productId,
      (quantityByProduct.get(productId) ||
        0) + quantity
    );
  }

  const productIds =
    [...quantityByProduct.keys()];

  const {
    data: productRows,
    error: productsError,
  } = await supabase
    .from("products")
    .select(
      "id, name, brand, manufacturer_code, selling_price"
    )
    .in("id", productIds)
    .eq("is_active", true);

  if (productsError) {
    console.error(
      "Order products error:",
      productsError
    );

    return NextResponse.json(
      {
        error:
          "Produsele nu au putut fi verificate.",
      },
      { status: 500 }
    );
  }

  const products =
    (productRows || []) as ProductRow[];

  if (
    products.length !==
    productIds.length
  ) {
    return NextResponse.json(
      {
        error:
          "Unul dintre produse nu mai este disponibil.",
      },
      { status: 409 }
    );
  }

  const orderItems =
    products.map((product) => {
      const quantity =
        quantityByProduct.get(
          product.id
        ) || 0;

      const unitPrice =
        Number(product.selling_price);

      if (
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        throw new Error(
          `Preț invalid pentru produsul ${product.id}.`
        );
      }

      return {
        product_id: product.id,
        product_name: product.name,
        product_brand:
          product.brand,
        product_code:
          product.manufacturer_code,
        quantity,
        unit_price:
          money(unitPrice),
        line_total:
          money(
            unitPrice * quantity
          ),
      };
    });

  const subtotal =
    money(
      orderItems.reduce(
        (sum, item) =>
          sum + item.line_total,
        0
      )
    );

  const shipping =
    subtotal === 0 ||
    subtotal >=
      FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_PRICE;

  const total =
    money(subtotal + shipping);

  /*
   * Dacă există sesiune Supabase, asociem
   * comanda contului. Guest checkout rămâne
   * cu user_id = null.
   */
  let userId: string | null = null;

  const authorization =
    request.headers.get(
      "authorization"
    );

  if (
    authorization?.startsWith(
      "Bearer "
    )
  ) {
    const token =
      authorization.slice(7);

    const {
      data: userData,
    } = await supabase.auth.getUser(
      token
    );

    userId =
      userData.user?.id || null;
  }

  let orderId: string | null = null;
  let orderNumber = "";

  /*
   * UUID-ul din număr face coliziunile
   * extrem de improbabile. Reîncercăm totuși
   * de câteva ori dacă unique constraint-ul
   * este lovit.
   */
  for (
    let attempt = 0;
    attempt < 3;
    attempt++
  ) {
    orderNumber =
      createOrderNumber();

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_number:
          orderNumber,

        status: "new",

        customer_type:
          customerType,

        first_name:
          firstName,

        last_name:
          lastName,

        email,
        phone,

        county,
        city,
        address,

        postal_code:
          postalCode || null,

        vin: vin || null,

        company_name:
          customerType ===
          "company"
            ? companyName
            : null,

        cui:
          customerType ===
          "company"
            ? cui
            : null,

        reg_com:
          customerType ===
          "company"
            ? regCom || null
            : null,

        payment_method:
          paymentMethod,

        payment_status:
          "pending",

        subtotal,
        shipping,
        total,

        notes:
          text(body.notes) ||
          null,
      })
      .select("id")
      .single();

    if (!orderError && order) {
      orderId = order.id;
      break;
    }

    if (orderError?.code !== "23505") {
      console.error(
        "Order insert error:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            "Comanda nu a putut fi creată.",
        },
        { status: 500 }
      );
    }
  }

  if (!orderId) {
    return NextResponse.json(
      {
        error:
          "Nu am putut genera numărul comenzii.",
      },
      { status: 500 }
    );
  }

  const {
    error: itemsError,
  } = await supabase
    .from("order_items")
    .insert(
      orderItems.map((item) => ({
        order_id: orderId,
        ...item,
      }))
    );

  if (itemsError) {
    console.error(
      "Order items insert error:",
      itemsError
    );

    /*
     * Evităm o comandă fără produse.
     * Pentru producție vom muta crearea
     * într-o tranzacție SQL/RPC atomică.
     */
    await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    return NextResponse.json(
      {
        error:
          "Produsele comenzii nu au putut fi salvate.",
      },
      { status: 500 }
    );
  }

  /*
   * Emailurile se trimit DUPĂ salvarea comenzii.
   * Dacă Resend e indisponibil, comanda rămâne validă.
   */
  const resendApiKey =
    process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error(
      "RESEND_API_KEY lipsește. Comanda a fost salvată fără email."
    );
  } else {
    const resend =
      new Resend(resendApiKey);

    try {
      const result =
        await resend.emails.send({
          from:
            "Garagio <comenzi@garagio.ro>",
          to: [email],
          subject:
            `Confirmare comandă ${orderNumber} | Garagio`,
          html: customerEmailHtml({
            firstName,
            orderNumber,
            orderItems,
            subtotal,
            shipping,
            total,
            paymentMethod,
            county,
            city,
            address,
            postalCode,
          }),
        });

      if (result.error) {
        console.error(
          "Resend client error:",
          result.error
        );
      }
    } catch (emailError) {
      console.error(
        "Email client nereușit:",
        emailError
      );
    }

    const adminEmail =
      process.env.GARAGIO_ADMIN_EMAIL;

    if (adminEmail) {
      try {
        const result =
          await resend.emails.send({
            from:
              "Garagio <comenzi@garagio.ro>",
            to: [adminEmail],
            replyTo: email,
            subject:
              `Comandă nouă ${orderNumber} — ${formatLei(total)} lei`,
            html: adminEmailHtml({
              orderNumber,
              firstName,
              lastName,
              email,
              phone,
              city,
              county,
              total,
              paymentMethod,
              orderItems,
            }),
          });

        if (result.error) {
          console.error(
            "Resend admin error:",
            result.error
          );
        }
      } catch (emailError) {
        console.error(
          "Email admin nereușit:",
          emailError
        );
      }
    }
  }

  return NextResponse.json(
    {
      ok: true,
      orderNumber,
      subtotal,
      shipping,
      total,
      paymentMethod,
    },
    {
      status: 201,
      headers: {
        "Cache-Control":
          "no-store",
      },
    }
  );
}
