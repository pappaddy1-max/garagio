import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type SupplierProductRow = {
  product_id: string;
  stock_quantity: number | null;
  in_stock: boolean;
  estimated_delivery_days: number | null;
  purchase_price: number | null;
  is_active: boolean;
};

type AvailabilityItem = {
  productId: string;
  inStock: boolean;
  stockQuantity: number | null;
  deliveryDays: number | null;
  stockLabel: string;
  deliveryLabel: string;
};

function createAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "Lipsește NEXT_PUBLIC_SUPABASE_URL."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Lipsește SUPABASE_SERVICE_ROLE_KEY."
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

function getStockLabel(
  inStock: boolean,
  quantity: number | null
) {
  if (
    inStock &&
    quantity !== null &&
    quantity > 0
  ) {
    return "În stoc";
  }

  if (inStock) {
    return "Disponibil";
  }

  return "Stoc furnizor";
}

function getDeliveryLabel(
  days: number | null
) {
  if (days === null) {
    return "Termen la confirmare";
  }

  if (days <= 1) {
    return "Livrare 24–48h";
  }

  if (days === 2) {
    return "Livrare 2–3 zile";
  }

  return `Livrare ${days}–${days + 1} zile`;
}

export async function GET() {
  try {
    const supabase =
      createAdminClient();

    /*
     * Endpoint-ul rulează pe server și poate
     * vedea ofertele furnizorilor.
     *
     * purchase_price este folosit doar intern
     * pentru alegerea celei mai bune oferte.
     * NU îl returnăm către browser.
     */
    const {
      data,
      error,
    } = await supabase
      .from("supplier_products")
      .select(
        `
          product_id,
          stock_quantity,
          in_stock,
          estimated_delivery_days,
          purchase_price,
          is_active
        `
      )
      .eq("is_active", true);

    if (error) {
      console.error(
        "Supplier availability error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Nu am putut încărca disponibilitatea.",
        },
        {
          status: 500,
        }
      );
    }

    const rows =
      (data || []) as SupplierProductRow[];

    /*
     * Grupăm ofertele după produs.
     */
    const grouped =
      new Map<
        string,
        SupplierProductRow[]
      >();

    for (const row of rows) {
      const existing =
        grouped.get(
          row.product_id
        ) || [];

      existing.push(row);

      grouped.set(
        row.product_id,
        existing
      );
    }

    const result:
      AvailabilityItem[] = [];

    for (
      const [
        productId,
        offers,
      ] of grouped.entries()
    ) {
      /*
       * Prioritate:
       *
       * 1. ofertă care are stoc
       * 2. termen de livrare mai mic
       * 3. preț de achiziție mai mic
       *
       * IMPORTANT:
       * prețul este folosit doar aici,
       * pe server.
       */
      const sorted =
        [...offers].sort(
          (a, b) => {
            const aAvailable =
              a.in_stock ||
              (a.stock_quantity ??
                0) > 0;

            const bAvailable =
              b.in_stock ||
              (b.stock_quantity ??
                0) > 0;

            if (
              aAvailable !==
              bAvailable
            ) {
              return aAvailable
                ? -1
                : 1;
            }

            const aDays =
              a.estimated_delivery_days ??
              999;

            const bDays =
              b.estimated_delivery_days ??
              999;

            if (
              aDays !== bDays
            ) {
              return (
                aDays - bDays
              );
            }

            const aPrice =
              a.purchase_price ??
              Number.MAX_SAFE_INTEGER;

            const bPrice =
              b.purchase_price ??
              Number.MAX_SAFE_INTEGER;

            return (
              aPrice - bPrice
            );
          }
        );

      const best =
        sorted[0];

      if (!best) {
        continue;
      }

      const available =
        best.in_stock ||
        (best.stock_quantity ??
          0) > 0;

      result.push({
        productId,

        inStock:
          available,

        stockQuantity:
          best.stock_quantity,

        deliveryDays:
          best.estimated_delivery_days,

        stockLabel:
          getStockLabel(
            available,
            best.stock_quantity
          ),

        deliveryLabel:
          getDeliveryLabel(
            best.estimated_delivery_days
          ),
      });
    }

    return NextResponse.json(
      {
        availability:
          result,
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
      "Availability API error:",
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