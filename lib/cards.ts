import { randomUUID } from "crypto";
import { cardIsReady, normalizeCard, type Card } from "./card";
import { getDb } from "./db";

const MAX_CARDS = 30;

export type CardSummary = { id: string; name: string; blood: string; updatedAt: string };

type CardRow = CardSummary & { payload: string };

export function listCards(userId: string): CardSummary[] {
  // node:sqlite rows have a null prototype, which React cannot pass to a client component.
  const rows = getDb()
    .prepare("SELECT id, name, blood, updated_at AS updatedAt FROM cards WHERE user_id = ? ORDER BY updated_at DESC")
    .all(userId) as CardSummary[];
  return rows.map((row) => ({ id: String(row.id), name: String(row.name), blood: String(row.blood), updatedAt: String(row.updatedAt) }));
}

export function getCard(userId: string, id: string): { id: string; card: Card } | null {
  const row = getDb()
    .prepare("SELECT id, payload FROM cards WHERE id = ? AND user_id = ?")
    .get(id, userId) as Pick<CardRow, "id" | "payload"> | undefined;
  if (!row) return null;
  try {
    const card = normalizeCard(JSON.parse(row.payload));
    return card ? { id: row.id, card } : null;
  } catch {
    return null;
  }
}

export function createCard(userId: string, input: unknown): { id: string } | { error: string } {
  const card = normalizeCard(input);
  if (!card || !cardIsReady(card)) return { error: "Add a name and one phone number to save." };
  const db = getDb();
  const count = db.prepare("SELECT COUNT(*) AS n FROM cards WHERE user_id = ?").get(userId) as { n: number };
  if (count.n >= MAX_CARDS) return { error: "You already have 30 saved cards. Delete one to save another." };
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO cards (id, user_id, name, blood, payload, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  ).run(id, userId, card.name, card.blood, JSON.stringify(card), now, now);
  return { id };
}

export function updateCard(userId: string, id: string, input: unknown): { id: string } | { error: string } | null {
  const card = normalizeCard(input);
  if (!card || !cardIsReady(card)) return { error: "Add a name and one phone number to save." };
  const now = new Date().toISOString();
  const result = getDb()
    .prepare("UPDATE cards SET name = ?, blood = ?, payload = ?, updated_at = ? WHERE id = ? AND user_id = ?")
    .run(card.name, card.blood, JSON.stringify(card), now, id, userId);
  if (Number(result.changes) === 0) return null;
  return { id };
}

export function deleteCard(userId: string, id: string) {
  const result = getDb().prepare("DELETE FROM cards WHERE id = ? AND user_id = ?").run(id, userId);
  return Number(result.changes) > 0;
}
