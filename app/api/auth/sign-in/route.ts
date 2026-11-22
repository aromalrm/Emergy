import { getUser, normalizeEmail, setSession, verifyPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (await getUser()) return Response.json({ error: "You are already signed in." }, { status: 400 });
  const body = await req.json().catch(() => null);
  const email = normalizeEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";
  const row = email
    ? (getDb().prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
        | { id: string; password_hash: string }
        | undefined)
    : undefined;
  if (!row || !verifyPassword(password, row.password_hash)) {
    return Response.json({ error: "Email or password doesn't match." }, { status: 401 });
  }
  await setSession(row.id);
  return Response.json({ user: { email } });
}
