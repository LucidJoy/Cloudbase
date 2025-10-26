import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ addAccount?: string }>;
}) => {
  const params = await searchParams;
  const isAddingAccount = params.addAccount === "true";

  // Only require unauthenticated access if not adding a new account
  if (!isAddingAccount) {
    await requireUnauth();
  }

  return <LoginForm />;
};

export default Page;
