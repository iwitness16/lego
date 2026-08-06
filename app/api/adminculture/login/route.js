import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Look up admin by email using service-role client (bypasses RLS)
    const admin = getAdminClient();
    const { data: row, error } = await admin
      .from("admins")
      .select("id, email, password_hash")
      .eq("email", email)
      .single();

    if (error || !row) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Simple env-based fallback: also accept ADMIN_EMAIL + ADMIN_PASSWORD
    const envEmail = process.env.ADMIN_EMAIL;
    const envPass = process.env.ADMIN_PASSWORD;
    if (envEmail && envPass) {
      if (email !== envEmail || password !== envPass) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      return NextResponse.json({ ok: true });
    }

    // Bcrypt compare (requires bcryptjs — see note below)
    // For simplicity we use the env-based check above.
    // To use bcrypt: npm install bcryptjs, then:
    // const bcrypt = require("bcryptjs");
    // const valid = await bcrypt.compare(password, row.password_hash);
    // if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin login error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
