import { and, eq, desc, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import {
  AdminTable,
  facturesTable,
  livreurTable,
  UtilisateurTable,
} from "./schema";
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
export async function getAdmin() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const admin = await db
    .select()
    .from(AdminTable)
    .where(
      and(
        eq(AdminTable.id, sessionData.user.id),
        isNull(UtilisateurTable.deletedAt)
      )
    )
    .limit(1);

  if (admin.length === 0) {
    return null;
  }

  return admin[0];
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
      num_avis: facturesTable.num_avis,
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
export async function GetAllFactures() {
  const user = await getAdmin();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const FacturesUser = await db
    .select({
      id: facturesTable.id,
      montant: facturesTable.montant,
      status: facturesTable.status,
      date: facturesTable.DemandeAt,
      num_avis: facturesTable.num_avis,
      code_client: facturesTable.utiliateurId,
    })
    .from(facturesTable)
    .leftJoin(livreurTable, eq(facturesTable.livreurNom, livreurTable.id))
    //.leftJoin(
    //  UtilisateurTable,
    //  eq(facturesTable.utiliateurId, user.code_client)
    //) // Ajout du join manquant
    //.where(eq(facturesTable.utiliateurId, user.code_client))
    .orderBy(desc(facturesTable.DemandeAt))
    .limit(5);

  return FacturesUser;
}

export const getAllUtilisateur = async () => {
  const user = await getAdmin();
  if (!user) {
    throw new Error("User not authenticated");
  }
  //const { id, phone, nomComplet } = data;

  const existUser = await db
    .select()
    .from(UtilisateurTable)
    //.where(and(eq(livreurTable.id, id)))
    .limit(1);

  if (existUser.length < 0) {
    return { error: "Le livreur n'existe pas " };
  }
  await db
    .select()
    .from(UtilisateurTable)
    //.where(and(eq(livreurTable.id, id)))
    .limit(200);
};
export const getAllLivreur = async () => {
  const user = await getAdmin();
  if (!user) {
    throw new Error("User not authenticated");
  }
  //const { id, phone, nomComplet } = data;

  const existLivreur = await db
    .select()
    .from(livreurTable)
    //.where(and(eq(livreurTable.id, id)))
    .limit(1);

  if (existLivreur.length < 0) {
    return { error: "Le livreur n'existe pas " };
  }
  await db
    .select()
    .from(livreurTable)
    //.where(and(eq(livreurTable.id, id)))
    .limit(10);
};
