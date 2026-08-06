import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { adminUpdateProduct, adminDeleteProduct } from "@/lib/data";

function adminClient() { return getAdminClient(); }

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const product = await adminUpdateProduct(adminClient(), params.id, body);
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await adminDeleteProduct(adminClient(), params.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
