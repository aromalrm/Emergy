import { getUser } from "@/lib/auth";
import { createCard, listCards } from "@/lib/cards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ error: "Sign in to see your cards." }, { status: 401 });
  return Response.json({ cards: listCards(user.id) });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return Response.json({ error: "Sign in to save this card." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const result = createCard(user.id, body?.card);
  if ("error" in result) return Response.json(result, { status: 400 });
  return Response.json(result, { status: 201 });
}
