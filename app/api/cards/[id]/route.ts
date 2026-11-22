import { getUser } from "@/lib/auth";
import { deleteCard, getCard, updateCard } from "@/lib/cards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const user = await getUser();
  if (!user) return Response.json({ error: "Sign in to open this card." }, { status: 401 });
  const { id } = await params;
  const found = getCard(user.id, id);
  if (!found) return Response.json({ error: "That saved card isn't on this account." }, { status: 404 });
  return Response.json(found);
}

export async function PUT(req: Request, { params }: Params) {
  const user = await getUser();
  if (!user) return Response.json({ error: "Sign in to save this card." }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = updateCard(user.id, id, body?.card);
  if (!result) return Response.json({ error: "That saved card isn't on this account." }, { status: 404 });
  if ("error" in result) return Response.json(result, { status: 400 });
  return Response.json(result);
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getUser();
  if (!user) return Response.json({ error: "Sign in to delete this card." }, { status: 401 });
  const { id } = await params;
  if (!deleteCard(user.id, id)) return Response.json({ error: "That saved card isn't on this account." }, { status: 404 });
  return Response.json({ ok: true });
}
