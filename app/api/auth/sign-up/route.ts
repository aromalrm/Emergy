import { randomUUID } from "crypto";
import { getUser, hashPassword, normalizeEmail, passwordError, setSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (await getUser()) return Response.json({ error: "You are already signed in." }, { status: 400 });
  const body = await req.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  if (!email) return Response.json({ error: "Enter an email address." }, { status: 400 });
  const pw = passwordError(body?.password);
  if (pw) return Response.json({ error: pw }, { status: 400 });

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return Response.json({ error: "That email already has an account. Sign in instead." }, { status: 409 });

  const id = randomUUID();
  db.prepare("INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)").run(
    id,
    email,
    hashPassword(body.password),
    new Date().toISOString(),
  );
  await setSession(id);
  return Response.json({ user: { email } }, { status: 201 });
}
