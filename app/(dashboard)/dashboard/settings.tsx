"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState } from "react";
import { User } from "@/lib/db/schema";
//import { removeTeamMember } from "@/app/(login)/actions";
import { InviteTeamMember } from "./invite-team";

type ActionState = {
  error?: string;
  success?: string;
};
import { Toaster } from "@/components/ui/sonner";

export function Settings() {
  const getUserDisplayName = (user: Pick<User, "id" | "nom" | "email">) => {
    return user.nom || user.email || "Unknown User";
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <InviteTeamMember />
        </CardContent>
      </Card>
      <Toaster />
    </section>
  );
}
