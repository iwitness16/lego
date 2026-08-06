import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { adminGetAllProducts, adminCreateProduct } from "@/lib/data";

function adminClient() { return getAdminClient(); }

export async function GET() {
  try {
    const products = await adminGetAllProducts(adminClient());
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const product = await adminCreateProduct(adminClient(), body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
