import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminClient } from "@/lib/supabase";
import { formatUSD } from "@/lib/format";

const ADMIN_EMAIL   = "orders.legobrickslink@gmail.com";
const WHATSAPP_USA  = "18287911525"; // primary — E.164, no +
const SITE_NAME     = "LegoBricksLink";
const MIN_ORDER_USD = 100;

// ---------------------------------------------------------------------------
// Nodemailer transporter — Gmail SMTP with App Password
// ---------------------------------------------------------------------------
function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER or GMAIL_APP_PASSWORD is not set in .env.local"
    );
  }

  return nodemailer.createTransport({
    host:   "smtp.gmail.com",
    port:   465,
    secure: true, // TLS on port 465
    auth: { user, pass },
  });
}

// ---------------------------------------------------------------------------
// Generate a readable order number: LBL-YYYYMMDD-XXXX
// ---------------------------------------------------------------------------
function makeOrderNumber() {
  const d   = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `LBL-${ymd}-${rnd}`;
}

// ---------------------------------------------------------------------------
// Build the WhatsApp pre-filled message text
// ---------------------------------------------------------------------------
function buildWhatsAppMessage({ orderNumber, customer, items, subtotal }) {
  const lines = items.map((i) => `• ${i.name} (#${i.number}) × ${i.quantity}`);
  return [
    `Hi ${SITE_NAME} Team! 👋`,
    ``,
    `I'd like to confirm my order:`,
    ``,
    `📦 Order: ${orderNumber}`,
    `👤 Name: ${customer.name}`,
    `📧 Email: ${customer.email}`,
    customer.phone   ? `📞 Phone: ${customer.phone}` : null,
    customer.address ? `📍 Address: ${customer.address}, ${customer.city || ""} ${customer.country || ""}`.trim() : null,
    `💳 Payment: ${customer.paymentMethod || "Not specified"}`,
    ``,
    `🛒 Items:`,
    ...lines,
    ``,
    `💰 Subtotal: ${formatUSD(subtotal)}`,
    customer.note ? `\n📝 Note: ${customer.note}` : null,
    ``,
    `Please send payment instructions for ${customer.paymentMethod || "my chosen method"} and confirm shipping. Thank you!`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

// ---------------------------------------------------------------------------
// Build HTML email body
// ---------------------------------------------------------------------------
function buildEmailHtml({ orderNumber, customer, items, subtotal, isAdmin }) {
  const rows = items
    .map((i) => {
      const lineTotal = formatUSD(
        (parseFloat(i.rrp?.match(/\$\s?([\d,.]+)/)?.[1]?.replace(",", "") || 0)) * i.quantity
      );
      return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e4e8f1;">
          <strong>${i.name}</strong><br/>
          <span style="font-size:12px;color:#6b7690;">#${i.number} · ${i.theme} — ${i.subtheme}</span>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e4e8f1;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e4e8f1;text-align:right;">${lineTotal}</td>
      </tr>`;
    })
    .join("");

  const greeting = isAdmin
    ? `New order received — <strong>${orderNumber}</strong>`
    : `Thank you for your order, <strong>${customer.name}</strong>!`;

  const subheader = isAdmin
    ? `A customer has placed a new order. Details below.`
    : `Your order <strong>${orderNumber}</strong> has been received. We'll confirm shipping details via WhatsApp shortly.`;

  const callout = isAdmin
    ? `<div style="background:#eef3fc;border:1px solid #b3cbee;padding:16px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#1e4694;line-height:1.6;">
          Reply to customer or open WhatsApp:<br/>
          <a href="https://wa.me/${WHATSAPP_USA}" style="color:#1e4694;">https://wa.me/${WHATSAPP_USA}</a>
        </p>
      </div>`
    : `<div style="background:#eef3fc;border:1px solid #b3cbee;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#1e4694;line-height:1.6;">
          <strong>Next step:</strong> A WhatsApp chat is opening so you can confirm with our team.
          If it didn't open, message us at <strong>+1 (828) 791-1525</strong>.
        </p>
        ${customer.paymentMethod
          ? `<p style="margin:0;font-size:13px;color:#1e4694;">
              💳 You selected <strong>${customer.paymentMethod}</strong>.
              Our team will send payment details on WhatsApp.
            </p>`
          : ""}
      </div>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border:1px solid #e4e8f1;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#182338;padding:28px 36px;">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;
                       text-transform:uppercase;font-family:monospace;">${SITE_NAME}</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;">${greeting}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 24px;color:#3c4a64;font-size:15px;line-height:1.6;">${subheader}</p>

            <!-- Customer info -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="margin-bottom:24px;background:#f5f7fb;border:1px solid #e4e8f1;">
              <tr>
                <td colspan="2" style="padding:10px 14px;background:#e4e8f1;font-size:11px;
                    font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#182338;">
                  Customer Details
                </td>
              </tr>
              <tr><td style="padding:8px 14px;font-size:13px;color:#6b7690;width:130px;">Name</td>
                  <td style="padding:8px 14px;font-size:13px;color:#182338;font-weight:600;">${customer.name}</td></tr>
              <tr><td style="padding:8px 14px;font-size:13px;color:#6b7690;">Email</td>
                  <td style="padding:8px 14px;font-size:13px;color:#182338;">${customer.email}</td></tr>
              ${customer.phone
                ? `<tr><td style="padding:8px 14px;font-size:13px;color:#6b7690;">Phone</td>
                       <td style="padding:8px 14px;font-size:13px;color:#182338;">${customer.phone}</td></tr>`
                : ""}
              ${customer.address
                ? `<tr><td style="padding:8px 14px;font-size:13px;color:#6b7690;">Address</td>
                       <td style="padding:8px 14px;font-size:13px;color:#182338;">
                         ${customer.address}, ${customer.city || ""} ${customer.country || ""}
                       </td></tr>`
                : ""}
              ${customer.paymentMethod
                ? `<tr><td style="padding:8px 14px;font-size:13px;color:#6b7690;">Payment</td>
                       <td style="padding:8px 14px;font-size:13px;color:#182338;font-weight:700;">
                         ${customer.paymentMethod}
                       </td></tr>`
                : ""}
              ${customer.note
                ? `<tr><td style="padding:8px 14px;font-size:13px;color:#6b7690;">Note</td>
                       <td style="padding:8px 14px;font-size:13px;color:#182338;font-style:italic;">
                         ${customer.note}
                       </td></tr>`
                : ""}
            </table>

            <!-- Items -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #e4e8f1;margin-bottom:24px;">
              <thead>
                <tr style="background:#e4e8f1;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:1px;
                      text-transform:uppercase;color:#182338;">Product</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:1px;
                      text-transform:uppercase;color:#182338;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:1px;
                      text-transform:uppercase;color:#182338;">Price</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
              <tfoot>
                <tr style="background:#f5f7fb;">
                  <td colspan="2" style="padding:12px;font-weight:700;font-size:14px;color:#182338;">
                    Estimated Total
                  </td>
                  <td style="padding:12px;text-align:right;font-weight:700;font-size:14px;color:#182338;">
                    ${formatUSD(subtotal)}
                  </td>
                </tr>
              </tfoot>
            </table>

            ${callout}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px;border-top:1px solid #e4e8f1;text-align:center;">
            <p style="margin:0;font-size:11px;color:#6b7690;">
              © ${new Date().getFullYear()} ${SITE_NAME} · Not affiliated with the LEGO Group
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Send a single email via Nodemailer / Gmail SMTP
// ---------------------------------------------------------------------------
async function sendEmail({ to, subject, html }) {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from:    `"${SITE_NAME} Orders" <${process.env.GMAIL_USER}>`,
      replyTo: ADMIN_EMAIL,
      to,
      subject,
      html,
    });

    console.log(`[email] ✓ Sent to ${to} — messageId: ${info.messageId}`);
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[email] ✗ Failed to ${to} —`, err.message);
    return { ok: false, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// POST /api/orders
// ---------------------------------------------------------------------------
export async function POST(request) {
  try {
    const { customer, items, subtotal } = await request.json();

    // Basic validation
    if (!customer?.name || !customer?.email || !items?.length) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Minimum order guard
    if (!subtotal || subtotal < MIN_ORDER_USD) {
      return NextResponse.json(
        { error: `Minimum order amount is ${formatUSD(MIN_ORDER_USD)}.` },
        { status: 422 }
      );
    }

    const orderNumber = makeOrderNumber();

    // 1. Save to Supabase
    const admin = getAdminClient();
    const { error: dbErr } = await admin.from("orders").insert({
      order_number:     orderNumber,
      customer_name:    customer.name,
      customer_email:   customer.email,
      customer_phone:   customer.phone       || null,
      customer_address: customer.address     || null,
      customer_city:    customer.city        || null,
      customer_country: customer.country     || null,
      customer_note:    customer.note        || null,
      payment_method:   customer.paymentMethod || null,
      items,
      subtotal_usd:     subtotal,
    });
    if (dbErr) throw new Error(dbErr.message);

    // 2. Build WhatsApp URL
    const waMessage   = buildWhatsAppMessage({ orderNumber, customer, items, subtotal });
    const whatsappUrl = `https://wa.me/${WHATSAPP_USA}?text=${encodeURIComponent(waMessage)}`;

    // 3. Build email HTML for each recipient
    const adminHtml    = buildEmailHtml({ orderNumber, customer, items, subtotal, isAdmin: true });
    const customerHtml = buildEmailHtml({ orderNumber, customer, items, subtotal, isAdmin: false });

    // 4. Send admin notification
    const adminResult = await sendEmail({
      to:      ADMIN_EMAIL,
      subject: `🛒 New Order ${orderNumber} — ${customer.name}`,
      html:    adminHtml,
    });
    console.log("[orders] Admin email:", adminResult);

    // 5. Send customer confirmation
    const customerResult = await sendEmail({
      to:      customer.email,
      subject: `Your ${SITE_NAME} order ${orderNumber} is confirmed`,
      html:    customerHtml,
    });
    console.log("[orders] Customer email:", customerResult);

    return NextResponse.json({ orderNumber, whatsappUrl }, { status: 201 });
  } catch (err) {
    console.error("[orders] POST error:", err);
    return NextResponse.json({ error: err.message || "Server error." }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/orders  (admin dashboard)
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
