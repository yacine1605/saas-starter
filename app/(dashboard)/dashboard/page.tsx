import { redirect } from "next/navigation";
import { Settings } from "./settings";
import { getUser } from "@/lib/db/queries.server";

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // const teamData = await getTeamForUser(user.id);
  //
  // if (!teamData) {
  //   throw new Error('Team not found');
  // }

  return <Settings />;
}
