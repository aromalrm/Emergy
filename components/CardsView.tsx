"use client";

import { useState } from "react";
import { Cross } from "@/components/Icon";

export type SavedCard = { id: string; name: string; blood: string; updatedAt: string };

export function CardsView({ email, cards }: { email: string; cards: SavedCard[] }) {
  const [rows, setRows] = useState(cards);
  const [error, setError] = useState("");

  async function signOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    location.href = "/";
  }

  async function remove(card: SavedCard) {
    setError("");
    if (!confirm(`Delete ${card.name}? The printed QR code still opens. This removes the saved copy.`)) return;
    const res = await fetch(`/api/cards/${card.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.error === "string" ? data.error : "Couldn't delete that card.");
      return;
    }
    setRows((list) => list.filter((row) => row.id !== card.id));
  }

  return (
    <main className="maker">
      <header className="account-bar">
        <a className="brand" href="/">
          <Cross className="icon-inline" /> Emergy
        </a>
        <div className="account-meta">
          <span>{email}</span>
          <button type="button" className="link" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>
      <h1 className="maker-title">Your cards</h1>
      <p className="hint maker-sub">Cards you saved. Open one to change it and print it again.</p>
      {error && (
        <p className="field-help error center" role="alert">
          {error}
        </p>
      )}
      <div className="card-list">
        {rows.length === 0 && (
          <div className="saved">
            <div>
              <b>No saved cards yet.</b>
              <p className="field-help">Make a card, then choose Save card.</p>
            </div>
            <a className="primary" href="/#make">
              Make a card
            </a>
          </div>
        )}
        {rows.map((card) => (
          <div className="saved" key={card.id}>
            <div>
              <b>{card.name}</b>
              <p className="field-help">
                {card.blood ? `Blood group ${card.blood}. ` : ""}
                Updated {formatWhen(card.updatedAt)}
              </p>
            </div>
            <div className="actions">
              <a className="secondary" href={`/?card=${card.id}#make`}>
                Open
              </a>
              <button type="button" className="secondary" onClick={() => remove(card)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
