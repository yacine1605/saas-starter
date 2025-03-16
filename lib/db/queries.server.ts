import { and, eq, desc, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import { facturesTable, livreurTable, UtilisateurTable } from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "string"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(UtilisateurTable)
    .where(
      and(
        eq(UtilisateurTable.code_client, sessionData.user.id),
        isNull(UtilisateurTable.deletedAt)
      )
    )
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

//export async function getTeamByStripeCustomerId(customerId: string) {
//  const result = await db
//    .select()
//    .from(teams)
//    .where(eq(teams.stripeCustomerId, customerId))
//    .limit(1);
//
//  return result.length > 0 ? result[0] : null;
//}

//export async function updateTeamSubscription(
//  teamId: number,
//  subscriptionData: {
//    stripeSubscriptionId: string | null;
//    stripeProductId: string | null;
//    planName: string | null;
//    subscriptionStatus: string;
//  }
//) {
//  await db
//    .update(teams)
//    .set({
//      ...subscriptionData,
//      updatedAt: new Date(),
//    })
//    .where(eq(teams.id, teamId));
//}

//export async function getUserWithTeam(userId: number) {
//  const result = await db
//    .select({
//      user: users,
//      teamId: teamMembers.teamId,
//    })
//    .from(users)
//    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
//    .where(eq(users.id, userId))
//    .limit(1);
//
//  return result[0];
//}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const FacturesUser = await db
    .select({
      id: facturesTable.id,
      montant: facturesTable.montant,
      status: facturesTable.status,
      date: facturesTable.DemandeAt,
    })
    .from(facturesTable)
    .leftJoin(livreurTable, eq(facturesTable.livreurNom, livreurTable.id))
    .leftJoin(
      UtilisateurTable,
      eq(facturesTable.utiliateurId, user.code_client)
    ) // Ajout du join manquant
    .where(eq(facturesTable.utiliateurId, user.code_client))
    .orderBy(desc(facturesTable.DemandeAt))
    .limit(5);

  return FacturesUser;
}
