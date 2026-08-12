import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

// PATCH /api/orders/[id]  — update status
export async function PATCH(request, { params }) {
  try {
    const { status } = await request.json();
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("orders")
      .update({ status })
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
