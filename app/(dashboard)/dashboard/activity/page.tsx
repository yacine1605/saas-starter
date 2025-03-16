import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { getActivityLogs } from "@/lib/db/queries.server";
import Facture_Utilisatuer_Comp from "./Table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 p-4 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Factures Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <Facture_Utilisatuer_Comp FacturesQuery={logs} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Pas de Factures
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                essai de demande un payement d'un facture
              </p>
              <Link href="/">
                <Button>Dashboard</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
