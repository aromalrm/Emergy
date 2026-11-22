import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CardsView } from "@/components/CardsView";
import { getUser } from "@/lib/auth";
import { listCards } from "@/lib/cards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your cards · HelpCard" };

export default async function CardsPage() {
  const user = await getUser();
  if (!user) redirect("/sign-in?next=/cards");
  return <CardsView email={user.email} cards={listCards(user.id)} />;
}
