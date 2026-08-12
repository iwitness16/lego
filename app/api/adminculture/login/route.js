import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const envEmail = (process.env.ADMIN_EMAIL   || "").trim();
    const envPass  = (process.env.ADMIN_PASSWORD || "").trim();

    if (!envEmail || !envPass) {
      console.error("[admin login] ADMIN_EMAIL or ADMIN_PASSWORD not set in .env.local");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const emailMatch    = email.trim().toLowerCase() === envEmail.toLowerCase();
    const passwordMatch = password === envPass;

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin login] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
