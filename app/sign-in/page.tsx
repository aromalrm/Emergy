import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getUser, safeNext } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in · HelpCard" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const nextPath = safeNext((await searchParams).next);
  if (await getUser()) redirect(nextPath);
  return <AuthForm mode="sign-in" nextPath={nextPath} />;
}
