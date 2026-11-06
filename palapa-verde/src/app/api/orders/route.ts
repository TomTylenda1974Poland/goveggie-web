import { NextResponse } from "next/server";
import { getCommerce } from "@/lib/commerce";
import { httpStatusFor, isCommerceError } from "@/lib/commerce/errors";
import { parseOrderRequest } from "@/lib/commerce/validation";

const MAX_BODY_BYTES = 16_000;

/**
 * Recibe el pedido del carrito y lo pasa al proveedor de comercio.
 * No cobra nada: los pagos en línea están desactivados hasta que el negocio decida.
 */
export async function POST(request: Request) {
  // La web no acepta pedidos hasta que el negocio active la venta (ORDERS_ENABLED=true).
  if (process.env.ORDERS_ENABLED !== "true") {
    return NextResponse.json(
      { error: { code: "ORDERS_DISABLED", message: "Palapa Verde todavía no acepta pedidos en línea." } },
      { status: 503 },
    );
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "Pedido demasiado grande" } }, { status: 413 });
  }

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: { code: "INVALID_REQUEST", message: "JSON no válido" } }, { status: 400 });
  }

  try {
    const order = await getCommerce().createOrder(parseOrderRequest(input));
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (isCommerceError(error)) {
      const status = httpStatusFor(error.code);
      // Los detalles de errores del proveedor externo no se envían al navegador.
      const safeDetails = status < 500 ? error.details : undefined;
      return NextResponse.json({ error: { code: error.code, message: error.message, details: safeDetails } }, { status });
    }
    console.error("POST /api/orders", error);
    return NextResponse.json({ error: { code: "INTERNAL", message: "Error interno" } }, { status: 500 });
  }
}
