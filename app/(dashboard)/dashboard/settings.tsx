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

export function Settings() {
  const getUserDisplayName = (user: Pick<User, "id" | "nom" | "email">) => {
    return user.nom || user.email || "Unknown User";
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Team Settings</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium">Current Plan: {"Free"}</p>
                <p className="text-sm text-muted-foreground"></p>
              </div>
              <form
                action={() => {
                  console.log("object");
                }}
              >
                <Button type="submit" variant="outline">
                  Manage Subscription
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mt-4"></p>
        </CardContent>
      </Card>
      <InviteTeamMember />
    </section>
  );
}
