"use server";

import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  User,
  type NvUser,
  UtilisateurTable,
  facturesTable,
} from "@/lib/db/schema";
import { comparePasswords, hashPassword, setSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
//import { createCheckoutSession } from "@/lib/payments/stripe";
import { getUser } from "@/lib/db/queries";
import {
  validatedAction,
  validatedActionWithUser,
} from "@/lib/auth/middleware";

//async function logActivity(
//  teamId: number | null | undefined,
//  userId: number,
//  type: ActivityType,
//  ipAddress?: string
//) {
//  if (teamId === null || teamId === undefined) {
//    return;
//  }
//  const newActivity: NewActivityLog = {
//    teamId,
//    userId,
//    action: type,
//    ipAddress: ipAddress || "",
//  };
//  await db.insert(activityLogs).values(newActivity);
//}

const signInSchema = z.object({
  email: z.string().email("Email invalide ").min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const userWithTeam = await db
    .select({
      user: UtilisateurTable,
    })
    .from(UtilisateurTable)
    //.leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    //.leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(UtilisateurTable.email, email))
    .limit(1);

  if (userWithTeam.length === 0) {
    return {
      error: " email ou mot de passe .Essay other time.",
      email,
      password,
    };
  }

  const { user: foundUser } = userWithTeam[0];

  const isPasswordValid = await comparePasswords(password, foundUser.password);

  if (!isPasswordValid) {
    return {
      error: "Invalid email or password. Please try again.",
      email,
      password,
    };
  }

  await Promise.all([
    setSession(foundUser),
    //logActivity(foundTeam?.id, foundUser.id, ActivityType.SIGN_IN),
  ]);

  const redirectTo = formData.get("redirect") as string | null;
  //if (redirectTo === "checkout") {
  //  const priceId = formData.get("priceId") as string;
  // // return createCheckoutSession({ team: foundTeam, priceId });
  //}

  redirect("/dashboard");
});

const signUpSchema = z.object({
  nom: z.string().min(2),
  email: z.string().email(),
  adresse: z.string().min(5),
  commune: z.string().min(2),
  ilot: z.string().min(2),
  phone: z.string(),
  code_client: z.string(),
  password: z.string().min(8),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { nom, email, commune, ilot, phone, adresse, code_client, password } =
    data;

  const existingUser = await db
    .select()
    .from(UtilisateurTable)
    .where(eq(UtilisateurTable.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      error: "Failed to create user. Please try again.",
      email,
      password,
      nom,
      commune,
      ilot,
      phone,
      adresse,
      code_client,
    };
  }
  const passwordHash = await hashPassword(password);
  const newUser: NvUser = {
    nom,
    email,
    commune,
    ilot,
    phone,
    adresse,
    code_client,
    password: passwordHash,
  };
  const [createdUser] = await db
    .insert(UtilisateurTable)
    .values(newUser)
    .returning();
  if (!createdUser) {
    return {
      error: "failed to create user",
      nom,
      email,
      commune,
      ilot,
      phone,
      adresse,
      code_client,
      password,
    };
  }
  const redirectTo = formData.get("redirect") as string | null;
  console.log("cre", newUser);

  redirect("/sign-in");
});

export async function signOut() {
  const user = (await getUser()) as User;
  //const userWithTeam = await getUserWithTeam(user.id);
  //await logActivity(userWithTeam?.teamId, user.id, ActivityType.SIGN_OUT);
  (await cookies()).delete("session");
}

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return { error: "Current password is incorrect." };
    }

    if (currentPassword === newPassword) {
      return {
        error: "New password must be different from the current password.",
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
    // const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db
        .update(UtilisateurTable)
        .set({ password: newPasswordHash })
        .where(eq(UtilisateurTable.id, user.id)),
    ]);

    return { success: "Password updated successfully." };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100),
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return { error: "Incorrect password. Account deletion failed." };
    }

    //const userWithTeam = await getUserWithTeam(user.id);

    //await logActivity(
    //  userWithTeam?.teamId,
    //  user.id,
    //  ActivityType.DELETE_ACCOUNT
    //);

    // Soft delete
    await db
      .update(UtilisateurTable)
      .set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
        email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
      })
      .where(eq(UtilisateurTable.id, user.id));

    //if (userWithTeam?.teamId) {
    //  await db
    //    .delete(teamMembers)
    //    .where(
    //      and(
    //        eq(teamMembers.userId, user.id),
    //        eq(teamMembers.teamId, userWithTeam.teamId)
    //      )
    //    );
    //}

    (await cookies()).delete("session");
    redirect("/sign-in");
  }
);

const updateAccountSchema = z.object({
  nom: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { nom, email } = data;
    //const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db
        .update(UtilisateurTable)
        .set({ nom, email })
        .where(eq(UtilisateurTable.id, user.id)),
      // logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT),
    ]);

    return { success: "Account updated successfully." };
  }
);

const removeTeamMemberSchema = z.object({
  memberId: z.number(),
});

//export const removeTeamMember = validatedActionWithUser(
//  removeTeamMemberSchema,
//  async (data, _, user) => {
//    const { memberId } = data;
//   // const userWithTeam = await getUserWithTeam(user.id);
//
//    if (!userWithTeam?.teamId) {
//      return { error: "User is not part of a team" };
//    }
//
//    await db
//      .delete(teamMembers)
//      .where(
//        and(
//          eq(teamMembers.id, memberId),
//          eq(teamMembers.teamId, userWithTeam.teamId)
//        )
//      );
//
//    await logActivity(
//      userWithTeam.teamId,
//      user.id,
//      ActivityType.REMOVE_TEAM_MEMBER
//    );
//
//    return { success: "Team member removed successfully" };
//  }
//);

const inviteTeamMemberSchema = z.object({
  montant: z.number().int().positive("montant invalide"),

  livreurNom: z.number().int().positive("livreur invalide"),
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { montant } = data;
    //const userWithTeam = await getUserWithTeam(user.id);

    //if (!userWithTeam?.teamId) {
    //  return { error: "User is not part of a team" };
    //}
    //
    //const existingMember = await db
    //  .select()
    //  .from(users)
    //  .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    //  .where(
    //    and(eq(users.email, email), eq(teamMembers.teamId, userWithTeam.teamId))
    //  )
    //  .limit(1);
    //
    //if (existingMember.length > 0) {
    //  return { error: "User is already a member of this team" };
    //}

    //Check if there's an existing invitation
    const existingInvitation = await db
      .select()
      .from(facturesTable)
      .where(and(eq(facturesTable.status, "non payé")))
      .limit(1);

    if (existingInvitation.length > 0) {
      return { error: "An invitation has already been sent to this email" };
    }

    // Create a new invitation
    await db.insert(facturesTable).values({
      id: 1,
      utiliateurId: user.code_client,
      montant,
      livreurNom: 1,
    });

    // TODO: Send invitation email and include ?inviteId={id} to sign-up URL
    // await sendInvitationEmail(email, userWithTeam.team.name, role)

    return { success: "Facture sent successfully" };
  }
);
