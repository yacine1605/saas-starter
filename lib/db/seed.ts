import { db } from "./drizzle";
import { accountTable, UtilisateurTable } from "./schema";
import { hashPassword } from "@/lib/auth/session";

//async function createStripeProducts() {
//  console.log('Creating Stripe products and prices...');
//
//  const baseProduct = await stripe.products.create({
//    name: 'Base',
//    description: 'Base subscription plan',
//  });
//
//  await stripe.prices.create({
//    product: baseProduct.id,
//    unit_amount: 800, // $8 in cents
//    currency: 'usd',
//    recurring: {
//      interval: 'month',
//      trial_period_days: 7,
//    },
//  });
//
//  const plusProduct = await stripe.products.create({
//    name: 'Plus',
//    description: 'Plus subscription plan',
//  });
//
//  await stripe.prices.create({
//    product: plusProduct.id,
//    unit_amount: 1200, // $12 in cents
//    currency: 'usd',
//    recurring: {
//      interval: 'month',
//      trial_period_days: 7,
//    },
//  });
//
//  console.log('Stripe products and prices created successfully.');
//}

async function seed() {
  const email = "test@test.com";
  const password = "admin123";
  const ilot = "12";
  const nom = "yacine bouzir";
  const phone = "1245789562";
  const adresse = "ain benian";
  const commune = "alger";
  const code_client = "123456789";
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(UtilisateurTable)
    .values([
      {
        phone,
        nom,
        ilot,
        adresse,
        code_client,
        commune,
        email,
        password: passwordHash,
      },
    ])
    .returning();

  console.log("Initial user created.", user);

  // const [account] = await db
  //   .insert(accountTable)
  //   .values({
  //     userId: code_client,
  //     password: passwordHash,
  //   })
  //   .returning();
  //
  // //await db.insert(teamMembers).values({
  // //  teamId: team.id,
  // //  userId: user.id,
  // //  role: "owner",
  // //});
  // await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error("Seed process failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seed process finished. Exiting...");
    process.exit(0);
  });
